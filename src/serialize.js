import { cloneDeep } from 'lodash'

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

export default serialize
