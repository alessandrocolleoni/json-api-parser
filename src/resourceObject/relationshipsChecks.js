import { isObject, has, isNil, isEmpty, forEach, forOwn } from 'lodash'
import { linksMustBeObject, linksMustHaveAtLeast } from '../links'
import { metaMustBeObject } from '../meta'
import { isResourceIdentifier } from '../common'
import invariant from 'fbjs/lib/invariant'

function relationshipsMustBeObject (data) {
  invariant(
    !has(data, 'relationships') || isObject(data.relationships),
    `Malformed jsonapi model.\n
     The value of the relationships key MUST be an object (a “relationships object”).\n
     Visit: http://jsonapi.org/format/#document-resource-object-relationships`
  )
}

function relationshipMustContain (relationships) {
  forOwn(relationships, function (relationship) {
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
    if (has(relationship, 'meta')) {
      const {meta} = relationship
      metaMustBeObject(meta)
    }
  })
}

function isResourceLinkage (resourceLinkage) {
  const {data} = resourceLinkage
  if (Array.isArray(data)) {
    invariant(
      Array.isArray(data) || isEmpty(data),
      `Malformed jsonapi model.\n
      Resource linkage MUST be represented as one of the following: null, an empty array, a resource identifier object or an array of resource identifier objects\n
      http://jsonapi.org/format/#document-resource-object-linkage
      `
    )
    forEach(data, resource =>
      invariant(
        isResourceIdentifier(resource),
        `Malformed jsonapi model.\n
          Resource linkage MUST be represented as one of the following: null, an empty array, a resource identifier object or an array of resource identifier objects\n
          http://jsonapi.org/format/#document-resource-object-linkage
          `
      )
    )
  } else {
    invariant(
      isNil(data) || isResourceIdentifier(data),
      `Malformed jsonapi model.\n
      Resource linkage MUST be represented as one of the following: null, an empty array, a resource identifier object or an array of resource identifier objects\n
      http://jsonapi.org/format/#document-resource-object-linkage
      `)
  }
}

export { relationshipsMustBeObject, relationshipMustContain, isResourceLinkage }
