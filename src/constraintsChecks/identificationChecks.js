import invariant from 'fbjs/lib/invariant'

function checkIdAndType (resource) {
  if (resource) {
    invariant(
      typeof resource.id === 'string' && typeof resource.type === 'string',
      `Malformed jsonapi model.\n
      Every resource object MUST contain an id member and a type member. The values of the id and type members MUST be strings.\n
      Visit: http://jsonapi.org/format/#document-resource-object-identification`
    )
  }
}

export { checkIdAndType }
