import { forEach, cloneDeep, map } from 'lodash'

import {
  checkIdAndType
} from './resourceObject'

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

  checkIdAndType(jsonApiModel.data)

  delete jsonModelClone.id
  delete jsonModelClone.type
  delete jsonModelClone.relationships
  delete jsonModelClone.included
  delete jsonModelClone.meta

  forEach(jsonModelClone, (value, key) => {
    jsonApiModel.data.attributes[key] = value
  })

  if (relationships) {
    jsonApiModel.data.relationships = {}
    forEach(relationships, (relationship, key) => {
      if (Array.isArray(relationship)) {
        jsonApiModel.data.relationships[key] = {data: map(relationship, value => ({id: value.id, type: value.type}))}
      } else {
        jsonApiModel.data.relationships[key] = {data: {id: relationship.id, type: relationship.type}}
      }
    })
  }

  return jsonApiModel
}

export default serialize
