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

function relationshipMustContain (relationship) {
  invariant(
    has(relationship, 'data') || has(relationship, 'links') || has(relationship, 'meta'),
    `Malformed jsonapi model.\n
     A "relationship object" MUST contain at least one of the following: links, data or meta.\n
     Visit: http://jsonapi.org/format/#document-resource-object-relationships`
  )
}

export { relationshipsMustBeObject, relationshipMustContain }
