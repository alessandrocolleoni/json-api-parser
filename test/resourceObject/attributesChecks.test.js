/* eslint-env mocha */
import { expect } from 'chai'
import { attributesMustBeObject, checkNestedRelationshipsOrLinks } from '../../src/resourceObject'

describe('"Resource objects" - Attributes:', () => {
  describe('The value of the attributes key MUST be an object (an "attributes object").', () => {
    it('should raise error on undefined', () => {
      // Setup
      const document = {
        'data': {
          'id': '1',
          'type': 'test',
          'attributes': undefined
        }
      }
      // Expectations
      expect(() => attributesMustBeObject(document.data)).to.throw(/The value of the attributes key MUST be an object/)
    })

    it('should raise error on null', () => {
      // Setup
      const document = {
        'data': {
          'id': '1',
          'type': 'test',
          'attributes': null
        }
      }
      // Expectations
      expect(() => attributesMustBeObject(document.data)).to.throw(/The value of the attributes key MUST be an object/)
    })

    it('should raise error on number', () => {
      // Setup
      const document = {
        'data': {
          'id': '1',
          'type': 'test',
          'attributes': 2
        }
      }
      // Expectations
      expect(() => attributesMustBeObject(document.data)).to.throw(/The value of the attributes key MUST be an object/)
    })

    it('should raise error on string', () => {
      // Setup
      const document = {
        'data': {
          'id': '1',
          'type': 'test',
          'attributes': 'string'
        }
      }
      // Expectations
      expect(() => attributesMustBeObject(document.data)).to.throw(/The value of the attributes key MUST be an object/)
    })
  })

  describe('any object that constitutes an attribute MUST NOT contain', () => {
    it('a "relationships" member', () => {
      // Setup
      const document = {
        'data': {
          'id': '1',
          'type': 'test',
          'attributes': {
            'object2': {
              'relationships': {
                'test': 'fail'
              }
            }
          }
        }
      }
      // Expectations
      expect(() => checkNestedRelationshipsOrLinks(document.data.attributes)).to.throw(/Any object that constitutes or is contained in an attribute MUST NOT contain a "relationships" or "links" member/)
    })

    it('a "links" member', () => {
      // Setup
      const document = {
        'data': {
          'id': '1',
          'type': 'test',
          'attributes': {
            'object1': {
              'links': {
                'test': 'fail'
              }
            }
          }
        }
      }
      // Expectations
      expect(() => checkNestedRelationshipsOrLinks(document.data.attributes)).to.throw(/Any object that constitutes or is contained in an attribute MUST NOT contain a "relationships" or "links" member/)
    })
  })

  describe('any object that is contained in an attribute MUST NOT contain', () => {
    it('a "relationships" member', () => {
      // Setup
      const document = {
        'data': {
          'id': '1',
          'type': 'test',
          'attributes': {
            'object2': {
              'subObject2': {
                'relationships': {
                  'test': 'fail'
                }
              }
            }
          }
        }
      }
      // Expectations
      expect(() => checkNestedRelationshipsOrLinks(document.data.attributes)).to.throw(/Any object that constitutes or is contained in an attribute MUST NOT contain a "relationships" or "links" member/)
    })

    it('a "links" member', () => {
      // Setup
      const document = {
        'data': {
          'id': '1',
          'type': 'test',
          'attributes': {
            'object1': {
              'subObject1': {
                'links': {
                  'test': 'fail'
                }
              }
            }
          }
        }
      }
      // Expectations
      expect(() => checkNestedRelationshipsOrLinks(document.data.attributes)).to.throw(/Any object that constitutes or is contained in an attribute MUST NOT contain a "relationships" or "links" member/)
    })
  })
})

describe('"Resource objects" - extras', () => {
  it('should handle "null" values', () => {
    expect(() => checkNestedRelationshipsOrLinks(null)).not.to.throw()
  })

  it('should handle "undefined" values', () => {
    expect(() => checkNestedRelationshipsOrLinks(undefined)).not.to.throw()
  })
})
