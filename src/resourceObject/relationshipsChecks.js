import { isObject, has } from 'lodash'
import invariant from 'fbjs/lib/invariant'

function relationshipsMustBeObject (data) {
  invariant(
    !has(data, 'relationships') || isObject(data.relationships),
    `Malformed jsonapi model.\n
       The value of the relationships key MUST be an object (a “relationships object”).\n
       Visit: http://jsonapi.org/format/#document-resource-object-relationships`
  )
}

export { relationshipsMustBeObject }
