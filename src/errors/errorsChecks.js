import { has } from 'lodash'
import invariant from 'fbjs/lib/invariant'
import { linksMustBeObject, linksMustHaveAtLeast } from '../links'
import { metaMustBeObject } from '../meta'

function errorsIsArray (errors) {
  invariant(
    Array.isArray(errors),
    `Malformed jsonapi model.\n
    Error objects MUST be returned as an array keyed by errors in the top level of a JSON API document.\n
    Visit: http://jsonapi.org/format/#error-objects`
  )
}

function errorsAcceptedFields (error) {
  invariant(
    has(error, 'id') || has(error, 'links') || has(error, 'status') || has(error, 'code') || has(error, 'title') || has(error, 'detail') || has(error, 'source') || has(error, 'meta'),
    `Malformed jsonapi model.\n
    An error object MAY have the following members: id, links, status, code, title, detail, source, meta.\n
    Visit: http://jsonapi.org/format/#error-objects`
  )

  if (has(error, 'links')) {
    const {links} = error
    linksMustBeObject(links)
    linksMustHaveAtLeast(links)
    invariant(
      has(links, 'about'),
      `Malformed jsonapi model.\n
      A links object containing the following members: about\n
      Visit: http://jsonapi.org/format/#error-objects`
    )
  }

  if (has(error, 'meta')) {
    const {meta} = error
    metaMustBeObject(meta)
  }
}

export { errorsIsArray, errorsAcceptedFields }
