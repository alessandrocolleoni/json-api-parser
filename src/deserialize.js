import { isUndefined, has } from 'lodash'
import invariant from 'fbjs/lib/invariant'

import {
  checkIsObject,
  checkContainsAtLeast,
  checkDataAndErrosNotCoexist,
  checkIncludedNotPresent
} from './topLevel'

import {
  checkResourceIdentifierOrNull,
  checkResourceArray,
  checkIdAndType,
  checkCommonNamespace,
  attributesMustBeObject,
  checkNestedRelationshipsOrLinks,
  relationshipsMustBeObject,
  relationshipMustContain,
  isResourceLinkage
} from './resourceObject'

import {
  linksMustBeObject,
  linksMustHaveAtLeast
} from './links'

import {
  metaMustBeObject
} from './meta'

function deserialize (jsonApiModel) {
  checkIsObject(jsonApiModel)

  const {data, errors, meta, included, links} = jsonApiModel

  checkContainsAtLeast({data, errors, meta})
  checkDataAndErrosNotCoexist({data, errors})
  checkIncludedNotPresent({data, included})

  if (!Array.isArray(data)) {
    checkResourceIdentifierOrNull(data)
    checkIdAndType(data)
    checkCommonNamespace(data)
  } else {
    data.forEach(resource => {
      checkResourceArray(resource)
      checkIdAndType(resource)
      checkCommonNamespace(resource)
    })
  }

  // TODO: refactor with errors
  if (data) {
    attributesMustBeObject(data)

    const {attributes} = data
    let jsonModel = {...attributes, id: data.id, type: data.type}
    checkNestedRelationshipsOrLinks(attributes)

    if (has(data, 'relationships')) {
      jsonModel.relationships = relationshipsChecks(data)
    }

    if (has(data, 'meta')) {
      jsonApiModel.meta = metaChecks(data)
    }

    if (links) {
      linksMustBeObject(links)
      linksMustHaveAtLeast(links)
      jsonApiModel.links = {...links}
    }

    invariant(
      isUndefined(jsonApiModel.included) || Array.isArray(jsonApiModel.included),
      `Malformed jsonapi model.\n
      In a compound document, all included resources MUST be represented as an array of resource objects in a top-level included member.\n
      Visit: http://jsonapi.org/format/#document-compound-documents`
    )

    if (included && included.length > 0) {
      const incl = [].concat(jsonApiModel.included)
      let mapRelationships = new Map()
      jsonModel.included = {}
      jsonModel.included = populateInclude(jsonModel, data, incl, mapRelationships)
    }
    return jsonModel
  }

  // TODO: errors
  return {}
}

/**
 *
 * Method to convert a json api format "include" to a more readable json format.
 * This take cares also for nested relationships inside an include element.
 *
 * @param jsonModel
 * @param jsonApiModel
 * @param includedData
 * @param mapRelationships
 * @returns {*}
 */
function populateInclude (jsonModel, jsonApiModel, includedData, mapRelationships) {
  // TODO: refactor
  /*
  console.log('xxxxx')
   forEach(jsonApiModel.relationships, curr => {
   console.log(curr)
   })
   console.log('yyyyy')
   forEach(jsonApiModel.relationships, (curr, xd) => {
   console.log(curr)
   console.log(xd)
   })
   */

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

          let itemConverted = {...jsonApiModel.attributes, id: itemIncludedJson.id}
          if (itemIncludedJson.meta) {
            itemConverted.meta = metaChecks(itemIncludedJson)
          }

          if (itemIncludedJson.relationships && !mapRelationships.has(actualRelationship.id)) {
            mapRelationships.set(actualRelationship.id, null)
            itemConverted.included = populateInclude({included: {}}, itemIncludedJson, includedData, mapRelationships)
            itemConverted.relationships = relationshipsChecks(itemIncludedJson)
            mapRelationships.set(actualRelationship.id, itemConverted)
          } else if (itemIncludedJson.relationships && mapRelationships.get(actualRelationship.id)) {
            itemConverted = mapRelationships[actualRelationship.id]
          }

          array.push(itemConverted)
        }

        jsonModel.included[key] = array
      } else {
        let itemConverted = {}
        let itemIncludedJson = includedData.find(candidateItem => candidateItem.id === relationshipData.id)

        if (itemIncludedJson) {
          itemConverted = {...itemIncludedJson, id: itemIncludedJson.id}

          if (itemIncludedJson.meta) {
            itemConverted.meta = metaChecks(itemIncludedJson)
          }

          if (itemIncludedJson.relationships && !mapRelationships.has(relationshipData.id)) {
            mapRelationships.set(relationshipData.id, null)
            itemConverted.included = populateInclude({included: {}}, itemIncludedJson, includedData, mapRelationships)
            itemConverted.relationships = relationshipsChecks(itemIncludedJson)
            mapRelationships.set(relationshipData.id, itemConverted)
          } else if (itemIncludedJson.relationships && mapRelationships.get(relationshipData.id)) {
            mapRelationships = mapRelationships[relationshipData.id]
          }

          jsonModel.included[key] = itemConverted
        }
      }
    }
  }

  return jsonModel.included
}

function relationshipsChecks (data) {
  const {relationships} = data
  relationshipsMustBeObject(data)
  relationshipMustContain(relationships)
  isResourceLinkage(relationships)
  return {...relationships}
}

function metaChecks (data) {
  const {meta} = data
  metaMustBeObject(meta)
  return {...meta}
}

export default deserialize
