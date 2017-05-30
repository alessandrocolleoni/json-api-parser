import { forEach, cloneDeep, map } from 'lodash'

import {
  checkIdAndType
} from './resourceObject'

function serialize (jsonModel) {
  let jsonModelClone = cloneDeep(jsonModel)
  let {relationships} = jsonModelClone

  let jsonApiModel = {
    data: {
      id: jsonModelClone.id,
      type: jsonModelClone.type,
      attributes: {}
    }
  }

  checkIdAndType(jsonApiModel.data)

  delete jsonModelClone.id
  delete jsonModelClone.type
  delete jsonModelClone.relationships
  delete jsonModelClone.included
  delete jsonModelClone.meta

  jsonApiModel.data.attributes = {...jsonModelClone}

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
