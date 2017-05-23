import { isObject, isUndefined } from 'lodash'
import invariant from 'fbjs/lib/invariant'

/**
 * Check if the input model is an object
 * @param jsonApiModel
 */
function checkIsObject (jsonApiModel) {
  invariant(
    isObject(jsonApiModel),
    `Malformed jsonapi model. A JSON object MUST be at the root of every JSON API request and response containing data.\nVisit: http://jsonapi.org/format/#document-top-level`
  )
}

/**
 * Check if a json api model in input has AT LEAST one of the following top-level members:
 * data, errors or meta
 *
 * @param data
 * @param errors
 * @param meta
 */
function checkContainsAtLeast ({data, errors, meta}) {
  invariant(
    !(isUndefined(data) && isUndefined(errors) && isUndefined(meta)),
    `Malformed jsonapi model.A document MUST contain at least one of the following top-level members: data, errors or meta\nVisit: http://jsonapi.org/format/#document-top-level`
  )
}

/**
 * Check if data and errors properties not coexists
 * @param data
 * @param errors
 */
function checkDataAndErrosNotCoexist ({data, errors}) {
  invariant(
    (!isUndefined(data) && isUndefined(errors)) || (isUndefined(data) && !isUndefined(errors)),
    `Malformed jsonapi model. The members data and errors MUST NOT coexist in the same document.\nVisit: http://jsonapi.org/format/#document-top-level`
  )
}

function checkIncludedNotPresent ({data, included}) {
  invariant(
    !(isUndefined(data) && included),
    `Malformed jsonapi model.\n
    If a document does NOT contain a top-level data key, the included member MUST NOT be present either.\n
    Visit: http://jsonapi.org/format/#document-top-level`
  )
}

export { checkIsObject, checkContainsAtLeast, checkDataAndErrosNotCoexist, checkIncludedNotPresent }
