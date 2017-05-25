import { isUndefined } from 'lodash'
import invariant from 'fbjs/lib/invariant'

function includedUndefinedOrArray (included) {
  invariant(
    isUndefined(included) || Array.isArray(included),
    `Malformed jsonapi model.\n
    In a compound document, all included resources MUST be represented as an array of resource objects in a top-level included member.\n
    Visit: http://jsonapi.org/format/#document-compound-documents`
  )
}

export { includedUndefinedOrArray }
