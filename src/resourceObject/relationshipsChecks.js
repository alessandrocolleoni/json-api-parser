import { isObject, has, conformsTo, isNil, isEmpty, forEach } from 'lodash'
import { linksMustBeObject, linksMustHaveAtLeast } from '../links'
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

  if (has(relationship, 'links')) {
    const {links} = relationship
    linksMustBeObject(links)
    linksMustHaveAtLeast(links)
  }
}

function isResourceLinkage (resourceLinkage) {
  if (Array.isArray(resourceLinkage)) {
    invariant(
      isEmpty(resourceLinkage),
      `Malformed jsonapi model.\n
      Resource linkage MUST be represented as one of the following: null, an empty array, a resource identifier object or an array of resource identifier objects\n
      http://jsonapi.org/format/#document-resource-object-linkage
      `
    )
    forEach(resourceLinkage, current =>
      invariant(
        isResourceIdentifier(current),
        `Malformed jsonapi model.\n
        Resource linkage MUST be represented as one of the following: null, an empty array, a resource identifier object or an array of resource identifier objects\n
        http://jsonapi.org/format/#document-resource-object-linkage
      `
      )
    )
  } else {
    invariant(
      isNil(resourceLinkage) || isResourceIdentifier(resourceLinkage),
      `Malformed jsonapi model.\n
      Resource linkage MUST be represented as one of the following: null, an empty array, a resource identifier object or an array of resource identifier objects\n
      http://jsonapi.org/format/#document-resource-object-linkage
      `)
  }
}

function isResourceIdentifier (obj) {
  return conformsTo(obj,
    {
      'id': id => !isNil(id),
      'type': type => !isNil(type)
    })
}

export { relationshipsMustBeObject, relationshipMustContain, isResourceLinkage }
