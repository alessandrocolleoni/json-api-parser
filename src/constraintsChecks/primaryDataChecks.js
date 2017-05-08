import { conformsTo, isNil, isNull } from 'lodash'
import invariant from 'fbjs/lib/invariant'

function checkResourceIdentifierOrNull (data) {
  invariant(
    isResourceIdentifier(data) || isNull(data),
    `Malformed jsonapi model.\n
     Primary data MUST be either: a single resource object, a single resource identifier object, or null, for requests that target single resources.\n
     Visit: http://jsonapi.org/format/#document-top-level`
  )
}

function checkResourceArray (resource) {
  invariant(
    resource && isResourceIdentifier(resource),
    `Malformed jsonapi model.\n
        Primary data MUST be either: an array of resource objects, an array of resource identifier objects, or an empty array ([]), for requests that target resource collections.\n
        Visit: http://jsonapi.org/format/#document-top-level`
  )
}

function isResourceIdentifier (obj) {
  return conformsTo(obj,
    {
      'id': id => !isNil(id),
      'type': type => !isNil(type)
    })
}

export { checkResourceIdentifierOrNull, checkResourceArray }
