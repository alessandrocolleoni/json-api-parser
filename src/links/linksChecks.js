import { isObject, has } from 'lodash'
import invariant from 'fbjs/lib/invariant'

function linksMustBeObject (links) {
  invariant(
    isObject(links),
    `Malformed jsonapi model.\n
     The value of each links member MUST be an object (a “links object”).\n
     Visit: http://jsonapi.org/format/#document-links`
  )
}

function linksMustHaveAtLeast (links) {
  invariant(
    has(links, 'self') || has(links, 'related'),
    `Malformed jsonapi model.\n
     A "links object" MUST contain at least one of the following: self or related\n
     Each member of a links object is a “link”. A link MUST be represented as either:\n
     a string containing the link’s URL or an object (“link object”)\n
     Visit: http://jsonapi.org/format/#document-links`
  )

  if (has(links, 'related')) {
    const {related} = links
    invariant(
      has(related, 'href') || has(related, 'meta'),
      `Malformed jsonapi model.\n
      An “link object” which can contain the following members: href or meta\n
      Visit: http://jsonapi.org/format/#document-links`
    )
  }
}

export { linksMustBeObject, linksMustHaveAtLeast }
