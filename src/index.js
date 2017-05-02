/*
 * Copyright (c) 2017 Alessandro Colleoni
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import _ from 'lodash'

function deserialize (jsonApiModel) {
  if (_.isUndefined(jsonApiModel.data) && _.isUndefined(jsonApiModel.errors) && _.isUndefined(jsonApiModel.meta)) {
    throw new Error(
      `Malformed jsonapi model.\n 
            A document MUST contain at least one of the following top-level members:\n
            data, errors or meta\n
            Visit: http://jsonapi.org/format/#document-top-level`)
  }

  if (_.isUndefined(jsonApiModel.data) && jsonApiModel.included) {
    throw new Error(`
            Malformed jsonapi model.\n
            If a document does not contain a top-level data key, the included member MUST NOT be present either.\n
            Visit: http://jsonapi.org/format/#document-top-level`)
  }

  if (!Array.isArray(jsonApiModel.data)) {
    if (!isResourceIdentifier(jsonApiModel.data) || _.isNull(jsonApiModel.data)) {
      throw new Error(`
            Malformed jsonapi model.\n
            Primary data MUST be either: a single resource object, a single resource identifier object, or null, for requests that target single resources.\n
            Visit: http://jsonapi.org/format/#document-top-level`)
    }
  } else {
    for (let obj in jsonApiModel.data) {
      if (obj && !isResourceIdentifier(obj)) {
        throw new Error(`
                Malformed jsonapi model.\n
                Primary data MUST be either: an array of resource objects, an array of resource identifier objects, or an empty array ([]), for requests that target resource collections.\n
                Visit: http://jsonapi.org/format/#document-top-level`)
      }
    }
  }

  let data = _.clone(jsonApiModel.data)
  let included = _.clone(jsonApiModel.included)

  let jsonModel = _.clone(data.attributes)
  jsonModel.id = data.id
  jsonModel.type = data.type

  if (data.relationships) {
    // TODO: Relationships checks
    jsonModel.relationships = _.cloneDeep(data.relationships)
  }

  if (data.meta) {
    jsonApiModel.meta = _.cloneDeep(data.meta)
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

          let itemConverted = _.clone(jsonApiModel.attributes)
          itemConverted.id = itemIncludedJson.id

          if (itemIncludedJson.meta) {
            itemConverted.meta = _.clone(itemIncludedJson.meta)
          }

          if (itemIncludedJson.relationships && !mapRelationships.has(actualRelationship.id)) {
            mapRelationships.set(actualRelationship.id, null)
            itemConverted.included = populateInclude({included: {}}, itemIncludedJson, includedData, mapRelationships)
            itemConverted.relationships = _.clone(itemIncludedJson.relationships)
            mapRelationships.set(actualRelationship.id, itemConverted)
          }
          /* else if (itemIncludedJson.relationships && mapRelationships[actualRelationship.id] && mapRelationships[actualRelationship.id].data) {
           itemConverted = mapRelationships[actualRelationship.id].data
           } */

          array.push(itemConverted)
        }

        jsonModel.included[key] = array
      } else {
        let itemConverted = {}
        let itemIncludedJson = includedData.find(candidateItem => candidateItem.id === relationshipData.id)

        if (itemIncludedJson) {
          itemConverted = _.clone(itemIncludedJson)
          itemConverted.id = itemIncludedJson.id

          if (itemIncludedJson.meta) {
            itemConverted.meta = _.clone(itemIncludedJson.meta)
          }

          if (itemIncludedJson.relationships && !mapRelationships.has(relationshipData.id)) {
            mapRelationships.set(relationshipData.id, null)
            itemConverted.included = populateInclude({included: {}}, itemIncludedJson, includedData, mapRelationships)
            itemConverted.relationships = _.clone(itemIncludedJson.relationships)
            mapRelationships.set(relationshipData.id, itemConverted)
            // mapRelationships[relationshipData.id].data = itemConverted;
          }
          /* else if (itemIncludedJson.relationships && mapRelationships[relationshipData.id] && mapRelationships[relationshipData.id].data) {
           mapRelationships = mapRelationships[relationshipData.id].data;
           } */

          jsonModel.included[key] = itemConverted
        }
      }
    }
  }

  return jsonModel.included
}

function isResourceIdentifier (obj) {
  return _.conformsTo(obj,
    {
      'id': id => !_.isNil(id),
      'type': type => !_.isNil(type)
    })
}

export {serialize, deserialize}
