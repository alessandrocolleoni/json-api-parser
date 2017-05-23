import { isObject } from 'lodash'
import invariant from 'fbjs/lib/invariant'

function metaMustBeObject (meta) {
  invariant(
    isObject(meta),
    `Malformed jsonapi model.\n
     The value of each meta member MUST be an object (a “meta" object”).\n
     Visit: http://jsonapi.org/format/#document-meta`
  )
}

export { metaMustBeObject }
