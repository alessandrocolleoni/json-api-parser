import { has } from 'lodash'
import invariant from 'fbjs/lib/invariant'

function checkCommonNamespace (obj) {
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

export { checkCommonNamespace }
