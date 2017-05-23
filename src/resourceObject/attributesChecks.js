import { isObject, get, has } from 'lodash'
import invariant from 'fbjs/lib/invariant'

function attributesMustBeObject (data) {
  invariant(
    !has(data, 'attributes') || isObject(data.attributes),
    `Malformed jsonapi model.\n
       The value of the attributes key MUST be an object.\n
       Visit: http://jsonapi.org/format/#document-resource-object-attributes`
  )
}

function checkNestedRelationshipsOrLinks (obj) {
  if (!obj) {
    return
  }
  for (let o in obj) {
    let curr = get(obj, o)
    if (isObject(curr)) {
      invariant(
        !has(curr, 'relationships') && !has(curr, 'links'),
        `Malformed jsonapi model.\n
        Any object that constitutes or is contained in an attribute MUST NOT contain a "relationships" or "links" member.\n
        Visit: http://jsonapi.org/format/#document-resource-object-attributes`
      )
      checkNestedRelationshipsOrLinks(curr)
    }
  }
}

export { attributesMustBeObject, checkNestedRelationshipsOrLinks }
