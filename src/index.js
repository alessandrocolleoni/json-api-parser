/*
 * Copyright (c) 2017 Alessandro Colleoni
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
  clone,
  cloneDeep,
  conformsTo,
  isNil,
  isNull,
  isUndefined,
  isObject,
  has
} from 'lodash'
import invariant from 'fbjs/lib/invariant'

function deserialize (jsonApiModel) {
  invariant(
    isObject(jsonApiModel),
    `Malformed jsonapi model. A JSON object MUST be at the root of every JSON API request and response containing data.\nVisit: http://jsonapi.org/format/#document-top-level`
  )

  const {data, errors, meta, included} = jsonApiModel

  // TODO: refactor
  invariant(
    !(isUndefined(data) && isUndefined(errors) && isUndefined(meta)),
    `Malformed jsonapi model.A document MUST contain at least one of the following top-level members: data, errors or meta\nVisit: http://jsonapi.org/format/#document-top-level`
  )

  invariant(
    (!isUndefined(data) && isUndefined(errors)) || (isUndefined(data) && !isUndefined(errors)),
    `Malformed jsonapi model. The members data and errors MUST NOT coexist in the same document.\nVisit: http://jsonapi.org/format/#document-top-level`
  )

  invariant(
    !(isUndefined(data) && included),
    `Malformed jsonapi model.\n
    If a document does NOT contain a top-level data key, the included member MUST NOT be present either.\n
    Visit: http://jsonapi.org/format/#document-top-level`
  )

  if (!Array.isArray(data)) {
    invariant(
      isResourceIdentifier(data) || isNull(data),
      `Malformed jsonapi model.\n
     Primary data MUST be either: a single resource object, a single resource identifier object, or null, for requests that target single resources.\n
     Visit: http://jsonapi.org/format/#document-top-level`
    )

    idAndTypesAreString(data)
    fieldsCommonNamespace(data)
  } else {
    for (let obj of data) {
      invariant(
        obj && isResourceIdentifier(obj),
        `Malformed jsonapi model.\n
        Primary data MUST be either: an array of resource objects, an array of resource identifier objects, or an empty array ([]), for requests that target resource collections.\n
        Visit: http://jsonapi.org/format/#document-top-level`
      )
      idAndTypesAreString(obj)
      fieldsCommonNamespace(obj)
    }
  }

  // TODO: refactor with errors
  if (data) {
    let jsonModel = {...data.attributes, id: data.id, type: data.type}

    if (data.relationships) {
      // TODO: Relationships checks
      jsonModel.relationships = {...data.relationships}
    }

    if (data.meta) {
      jsonApiModel.meta = {...data.meta}
    }

    invariant(
      isUndefined(jsonApiModel.included) || Array.isArray(jsonApiModel.included),
      `Malformed jsonapi model.\n
    In a compound document, all included resources MUST be represented as an array of resource objects in a top-level included member.\n
    Visit: http://jsonapi.org/format/#document-compound-documents`
    )

    if (included && included.length > 0) {
      // TODO: inclusion checks
      const incl = [].concat(jsonApiModel.included)
      jsonModel.included = {}
      let mapRelationships = new Map()
      jsonModel.included = populateInclude(jsonModel, data, incl, mapRelationships)
    }
    return jsonModel
  }

  // TODO: errors
  return {}
}

function serialize (jsonModel) {
  let jsonApiModel = {
    data: {
      attributes: {}
    }
  }

  let jsonModelClone = cloneDeep(jsonModel)
  let {relationships} = jsonModelClone

  jsonApiModel.data.id = jsonModelClone.id
  jsonApiModel.data.type = jsonModelClone.type

  delete jsonModelClone.id
  delete jsonModelClone.type
  delete jsonModelClone.relationships
  delete jsonModelClone.included
  delete jsonModelClone.meta

  for (let key in jsonModelClone) {
    jsonApiModel.data.attributes[key] = jsonModelClone[key]
  }

  if (relationships) {
    // TODO: improve relationships
    jsonApiModel.data.relationships = {}
    for (let key in relationships) {
      jsonApiModel.data.relationships[key] = relationships[key]
    }
  }

  return jsonApiModel
}

/**
 *
 * Method to convert a json api format "include" to a more readable json format.
 * This take cares also for nested relationships inside an include element.
 *
 * @param jsonModel
 * @param jsonApiModel
 * @param includedData
 * @returns {*}
 */
function populateInclude (jsonModel, jsonApiModel, includedData, mapRelationships) {
  for (let key in jsonApiModel.relationships) {
    let relationshipData = jsonApiModel.relationships[key].data
    jsonModel.included[key] = {}

    if (relationshipData) {
      if (Array.isArray(relationshipData)) {
        let array = []
        for (let actualRelationship of relationshipData) {
          let itemIncludedJson = includedData.find(candidateItem => candidateItem.id === actualRelationship.id)

          if (!itemIncludedJson) {
            continue
          }

          let itemConverted = clone(jsonApiModel.attributes)
          itemConverted.id = itemIncludedJson.id

          if (itemIncludedJson.meta) {
            itemConverted.meta = clone(itemIncludedJson.meta)
          }

          if (itemIncludedJson.relationships && !mapRelationships.has(actualRelationship.id)) {
            mapRelationships.set(actualRelationship.id, null)
            itemConverted.included = populateInclude({included: {}}, itemIncludedJson, includedData, mapRelationships)
            itemConverted.relationships = clone(itemIncludedJson.relationships)
            mapRelationships.set(actualRelationship.id, itemConverted)
          } else if (itemIncludedJson.relationships && mapRelationships.get(actualRelationship.id)) {
            itemConverted = mapRelationships[actualRelationship.id].data
          }

          array.push(itemConverted)
        }

        jsonModel.included[key] = array
      } else {
        let itemConverted = {}
        let itemIncludedJson = includedData.find(candidateItem => candidateItem.id === relationshipData.id)

        if (itemIncludedJson) {
          itemConverted = clone(itemIncludedJson)
          itemConverted.id = itemIncludedJson.id

          if (itemIncludedJson.meta) {
            itemConverted.meta = clone(itemIncludedJson.meta)
          }

          if (itemIncludedJson.relationships && !mapRelationships.has(relationshipData.id)) {
            mapRelationships.set(relationshipData.id, null)
            itemConverted.included = populateInclude({included: {}}, itemIncludedJson, includedData, mapRelationships)
            itemConverted.relationships = clone(itemIncludedJson.relationships)
            mapRelationships.set(relationshipData.id, itemConverted)
            mapRelationships.set(relationshipData.id, itemConverted)
          } else if (itemIncludedJson.relationships && mapRelationships.get(relationshipData.id)) {
            mapRelationships = mapRelationships[relationshipData.id].data
          }

          jsonModel.included[key] = itemConverted
        }
      }
    }
  }

  return jsonModel.included
}

function isResourceIdentifier (obj) {
  return conformsTo(obj,
    {
      'id': id => !isNil(id),
      'type': type => !isNil(type)
    })
}

function idAndTypesAreString (obj) {
  if (obj) {
    invariant(
      typeof obj.id === 'string' && typeof obj.type === 'string',
      `Malformed jsonapi model.\n
     Every resource object MUST contain an id member and a type member. The values of the id and type members MUST be strings.\n
     Visit: http://jsonapi.org/format/#document-resource-object-identification`
    )
  }
}

function fieldsCommonNamespace (obj) {
  if (!obj) {
    return
  }

  const {attributes, relationships} = obj

  invariant(
    !has(relationships, 'id') && !has(relationships, 'type') && !has(attributes, 'id') && !has(attributes, 'type'),
    `Malformed jsonapi model.\n
     A resource can not have an "attribute" or "relationship" named type or id.\n
     Visit: http://jsonapi.org/format/#document-resource-object-fields`
  )

  if (relationships) {
    for (let key in attributes) {
      invariant(
        !relationships.hasOwnProperty(key),
        `Malformed jsonapi model.\n
         A resource can NOT have an "attribute" and "relationship" with the same name.\n
         Visit: http://jsonapi.org/format/#document-resource-object-fields`
      )
    }
  }
}

export { serialize, deserialize }
