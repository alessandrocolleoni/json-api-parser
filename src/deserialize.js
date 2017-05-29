import { forEach, has } from 'lodash'

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
  includedUndefinedOrArray
} from './compoundDocuments'

import {
  linksMustBeObject,
  linksMustHaveAtLeast
} from './links'

import {
  metaMustBeObject
} from './meta'

import {
  errorsIsArray,
  errorsAcceptedFields
} from './errors'

function deserialize (jsonApiModel) {
  checkIsObject(jsonApiModel)

  const {data, errors, meta, included, links} = jsonApiModel

  checkContainsAtLeast({data, errors, meta})
  checkDataAndErrosNotCoexist({data, errors})
  checkIncludedNotPresent({data, included})

  let jsonModel = {}
  if (!Array.isArray(data)) {
    checkResourceIdentifierOrNull(data)
    checkIdAndType(data)
    checkCommonNamespace(data)
    attributesMustBeObject(data)
    jsonModel = convertData(data, {links, included})
  } else {
    jsonModel = []
    forEach(data, resource => {
      checkResourceArray(resource)
      checkIdAndType(resource)
      checkCommonNamespace(resource)
      jsonModel.push(convertData(data, {included}))
    })
  }

  if (errors) {
    errorsIsArray(errors)
    forEach(errors, error => {
      errorsAcceptedFields(error)
    })
    jsonModel = {...errors}
  }

  return jsonModel
}

function convertData (data, {links, included} = {}) {
  const {attributes} = data
  let jsonModel = {...attributes, id: data.id, type: data.type}
  checkNestedRelationshipsOrLinks(attributes)

  if (has(data, 'relationships')) {
    const {relationships} = data
    jsonModel.relationships = {}
    relationshipsChecks(data, relationships)
    forEach(relationships, (value, key) => {
      const {data} = value
      if (Array.isArray(data)) {
        jsonModel.relationships[key] = [].concat(data)
      } else {
        jsonModel.relationships[key] = {...data}
      }
    })
  }

  if (has(data, 'meta')) {
    jsonModel.meta = metaChecks(data)
  }

  if (links) {
    linksMustBeObject(links)
    linksMustHaveAtLeast(links)
    jsonModel.links = {...links}
  }

  includedUndefinedOrArray(included)
  if (included && included.length > 0) {
    const incl = [].concat(included)
    let mapRelationships = new Map()
    jsonModel.included = {}
    jsonModel.included = populateInclude(jsonModel, data, incl, mapRelationships)
  }
  return jsonModel
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
  forEach(jsonApiModel.relationships, (value, key) => {
    let relationshipData = value.data
    jsonModel.included[key] = {}

    if (relationshipData && Array.isArray(relationshipData)) {
      let array = []
      forEach(relationshipData, actualRelationship => {
        let itemIncludedJson = includedData.find(candidateItem => candidateItem.id === actualRelationship.id)
        if (!itemIncludedJson) {
          return
        }

        let itemConverted = {...jsonApiModel.attributes, id: itemIncludedJson.id}
        if (itemIncludedJson.meta) {
          itemConverted.meta = metaChecks(itemIncludedJson)
        }

        nestedIncluded(itemIncludedJson, itemConverted, mapRelationships, actualRelationship, includedData)
        array.push(itemConverted)
      })

      jsonModel.included[key] = array
    } else if (relationshipData) {
      let itemIncludedJson = includedData.find(candidateItem => candidateItem.id === relationshipData.id)
      if (!itemIncludedJson) {
        return
      }

      let itemConverted = {...itemIncludedJson, id: itemIncludedJson.id}
      if (itemIncludedJson.meta) {
        itemConverted.meta = metaChecks(itemIncludedJson)
      }

      nestedIncluded(itemIncludedJson, itemConverted, mapRelationships, relationshipData, includedData)
      jsonModel.included[key] = itemConverted
    }
  })

  return jsonModel.included
}

function nestedIncluded (itemIncludedJson, itemConverted, mapRelationships, relationship, includedData) {
  if (itemIncludedJson.relationships && !mapRelationships.has(relationship.id)) {
    mapRelationships.set(relationship.id, null)
    itemConverted.included = populateInclude({included: {}}, itemIncludedJson, includedData, mapRelationships)
    itemConverted.relationships = relationshipsChecks(itemIncludedJson)
    mapRelationships.set(relationship.id, itemConverted)
  } else if (itemIncludedJson.relationships && mapRelationships.get(relationship.id)) {
    itemConverted = mapRelationships.get(relationship.id)
  }
}

function relationshipsChecks (data, relationships) {
  relationshipsMustBeObject(data)
  relationshipMustContain(relationships)
  isResourceLinkage(relationships)
}

function metaChecks (data) {
  const {meta} = data
  metaMustBeObject(meta)
  return {...meta}
}

export default deserialize
