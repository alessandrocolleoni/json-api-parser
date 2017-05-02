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
  isUndefined
} from 'lodash'
import invariant from 'fbjs/lib/invariant'

function deserialize (jsonApiModel) {
  // TODO: refactor
  invariant(
    isUndefined(jsonApiModel.data) && isUndefined(jsonApiModel.errors) && isUndefined(jsonApiModel.meta),
    `Malformed jsonapi model.\n 
            A document MUST contain at least one of the following top-level members:\n
            data, errors or meta\n
            Visit: http://jsonapi.org/format/#document-top-level`
  )

  invariant(
    isUndefined(jsonApiModel.data) && jsonApiModel.included,
    `Malformed jsonapi model.\n
    If a document does not contain a top-level data key, the included member MUST NOT be present either.\n
    Visit: http://jsonapi.org/format/#document-top-level`
  )

  if (!Array.isArray(jsonApiModel.data)) {
    invariant(
      !isResourceIdentifier(jsonApiModel.data) || isNull(jsonApiModel.data),
      `Malformed jsonapi model.\n
     Primary data MUST be either: a single resource object, a single resource identifier object, or null, for requests that target single resources.\n
     Visit: http://jsonapi.org/format/#document-top-level`
    )
  } else {
    for (let obj in jsonApiModel.data) {
      invariant(
        obj && !isResourceIdentifier(obj),
        `Malformed jsonapi model.\n
        Primary data MUST be either: an array of resource objects, an array of resource identifier objects, or an empty array ([]), for requests that target resource collections.\n
        Visit: http://jsonapi.org/format/#document-top-level`
      )
    }
  }

  let data = clone(jsonApiModel.data)
  let included = clone(jsonApiModel.included)

  let jsonModel = clone(data.attributes)
  jsonModel.id = data.id
  jsonModel.type = data.type

  if (data.relationships) {
    // TODO: Relationships checks
    jsonModel.relationships = cloneDeep(data.relationships)
  }

  if (data.meta) {
    jsonApiModel.meta = cloneDeep(data.meta)
  }

  if (included) {
    // TODO: inclusion checks
    jsonModel.included = {}
    let mapRelationships = new Map()
    jsonModel.included = populateInclude(jsonModel, data, included, mapRelationships)
    console.log(mapRelationships)
  }

  return jsonModel
}

function serialize () {

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

export { serialize, deserialize }
