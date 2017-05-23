import { conformsTo, isNil } from 'lodash'

function isResourceIdentifier (obj) {
  return conformsTo(obj,
    {
      'id': id => !isNil(id),
      'type': type => !isNil(type)
    })
}

export {isResourceIdentifier}
