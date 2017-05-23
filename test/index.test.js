/*
 * Copyright (c) 2017 Alessandro Colleoni
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/* eslint-env mocha */
import { expect } from 'chai'
import { serialize, deserialize } from '../src/index'
import testData from './test-data.json'

describe('The document’s "primary data" is a representation of the resource or collection of resources targeted by a request.', () => {
  describe('Primary data MUST be either:', () => {
    it('- a single resource object', () => {
      // Setup
      const document = {
        'data': testData.fakeDataResourceObject
      }
      // Expectations
      expect(() => { deserialize(document) }).not.to.throw(Error)
    })

    it('- a single resource identifier object', () => {
      // Setup
      const document = {
        'data': testData.fakeDataResourceIdentifier
      }
      // Expectations
      expect(() => { deserialize(document) }).not.to.throw(Error)
    })

    it('- null', () => {
      // Setup
      const document = {
        'data': null
      }
      // Expectations
      expect(() => { deserialize(document) }).not.to.throw(Error)
    })

    it('- an array of resource objects', () => {
      // Setup
      const document = {
        'data': [
          testData.fakeDataResourceObject,
          testData.fakeDataResourceObject
        ]
      }
      // Expectations
      expect(() => { deserialize(document) }).not.to.throw(Error)
    })

    it('- an array of resource identifier objects', () => {
      // Setup
      const document = {
        'data': [
          testData.fakeDataResourceIdentifier,
          testData.fakeDataResourceIdentifier
        ]
      }
      // Expectations
      expect(() => { deserialize(document) }).not.to.throw(Error)
    })

    it('- an empty array', () => {
      // Setup
      const document = {
        'data': []
      }
      // Expectations
      expect(() => { deserialize(document) }).not.to.throw(Error)
    })
  })
})

describe('"Resource objects" appear in a JSON API document to represent resources.', () => {
  it('A resource object MUST contain at least the following top-level members: id and type', () => {
    // Setup
    const document = {
      'data': testData.invalidResourceObject
    }
    // Expectations
    expect(() => { deserialize(document) }).to.throw(Error)
  })

  describe('Identification:', () => {
    describe('The values of the id and type members MUST be strings.', () => {
      it('should raise error when both "id" and "type" are NOT string', () => {
        // Setup
        const document = {
          'data': testData.invalidIdTypeResourceObject
        }
        // Expectations
        expect(() => { deserialize(document) }).to.throw(/The values of the id and type members MUST be strings./)
      })

      it('should raise error when "id" is NOT string', () => {
        // Setup
        const document = {
          'data': testData.invalidIdResourceObject
        }
        // Expectations
        expect(() => { deserialize(document) }).to.throw(/The values of the id and type members MUST be strings./)
      })

      it('should raise error when "type" member is NOT string', () => {
        // Setup
        const document = {
          'data': testData.invalidTypeResourceObject
        }
        // Expectations
        expect(() => { deserialize(document) }).to.throw(/The values of the id and type members MUST be strings./)
      })
    })
  })

  describe('Fields:', () => {
    describe('Fields for a resource object MUST share a common namespace with each other and with type and id.', () => {
      it('a resource can NOT have an "attribute" and "relationship" with the same name', () => {
        // Setup
        const document = testData.attributesRelationshipsCrossedNamespaceObject
        // Expectations
        expect(() => deserialize(document)).to.throw(/A resource can NOT have an "attribute" and "relationship" with the same name/)
      })

      it('nor can it have an attribute or relationship named "type" or "id".', () => {
        // Setup
        const document = testData.attributesRelationshipsParentCrossedNamespaceObject
        // Expectations
        expect(() => deserialize(document)).to.throw(/A resource can not have an "attribute" or "relationship" named type or id/)
      })

      it('nor can it have an attribute named "type" or "id".', () => {
        // Setup
        const document = testData.attributesParentCrossedNamespaceObject
        // Expectations
        expect(() => deserialize(document)).to.throw(/A resource can not have an "attribute" or "relationship" named type or id/)
      })

      it('nor can it have a relationship named "type" or "id".', () => {
        // Setup
        const document = testData.relationshipsParentCrossedNamespaceObject
        // Expectations
        expect(() => deserialize(document)).to.throw(/A resource can not have an "attribute" or "relationship" named type or id/)
      })
    })

    describe('Attributes:', () => {
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
          expect(() => deserialize(document)).to.throw(/The value of the attributes key MUST be an object/)
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
          expect(() => deserialize(document)).to.throw(/The value of the attributes key MUST be an object/)
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
          expect(() => deserialize(document)).to.throw(/The value of the attributes key MUST be an object/)
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
          expect(() => deserialize(document)).to.throw(/The value of the attributes key MUST be an object/)
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
          expect(() => deserialize(document)).to.throw(/Any object that constitutes or is contained in an attribute MUST NOT contain a "relationships" or "links" member/)
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
          expect(() => deserialize(document)).to.throw(/Any object that constitutes or is contained in an attribute MUST NOT contain a "relationships" or "links" member/)
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
          expect(() => deserialize(document)).to.throw(/Any object that constitutes or is contained in an attribute MUST NOT contain a "relationships" or "links" member/)
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
          expect(() => deserialize(document)).to.throw(/Any object that constitutes or is contained in an attribute MUST NOT contain a "relationships" or "links" member/)
        })
      })
    })

    describe('Relationships:', () => {
      describe('The value of the relationships key MUST be an object (a "relationships object").', () => {
        it('should raise error on null', () => {
            // Setup
          const document = testData.relationshipNullObject
            // Expectations
          expect(() => deserialize(document)).to.throw(/The value of the relationships key MUST be an object (a "relationships object")/)
        })

        it('should raise error on string', () => {
            // Setup
          const document = testData.relationshipStringObject
            // Expectations
          expect(() => deserialize(document)).to.throw(/The value of the relationships key MUST be an object (a "relationships object")/)
        })

        it('should raise error on number', () => {
            // Setup
          const document = testData.relationshipNumberObject
            // Expectations
          expect(() => deserialize(document)).to.throw(/The value of the relationships key MUST be an object (a "relationships object")/)
        })
      })

      describe('A "relationship object" MUST contain at least one of the following: links, data or meta', () => {
        it('should raise error on empty relationships object', () => {
            // Setup
          const document = testData.relationshipEmptyObject
            // Expectations
          expect(() => deserialize(document)).to.throw(/A "relationship object" MUST contain at least one of the following: links, data or meta/)
        })

        describe('links: a "links object" containing at least one of the following: self, data or meta', () => {
          it('should raise error on empty links object', () => {
            // Setup
            const document = testData.relationshipEmptyLinksObject
            // Expectations
            expect(() => deserialize(document)).to.throw(/a "links object" containing at least one of the following: self, data or meta/)
          })
        })

        describe('data: a "resource linkage" object', () => {
          describe('Resource linkage MUST be represented as one of the following:', () => {
            it('- null for empty to-one relationships', () => {
                // Setup
              const document = testData.relationshipDataNullObject
                // Expectations
              expect(() => { deserialize(document) }).not.to.throw(Error)
            })

            it('- an empty array ([]) for empty to-many relationships.', () => {
              // Setup
              const document = testData.relationshipDataEmptyArrayObject
              // Expectations
              expect(() => { deserialize(document) }).not.to.throw(Error)
            })

            it('- a single resource identifier object for non-empty to-one relationships.', () => {
              // Setup
              const document = testData.relationshipDataOneObject
              // Expectations
              expect(() => { deserialize(document) }).not.to.throw(Error)
            })

            it('- an array of resource identifier objects for non-empty to-many relationships.', () => {
              // Setup
              const document = testData.relationshipDataManyObject
              // Expectations
              expect(() => { deserialize(document) }).not.to.throw(Error)
            })
          })

          it('should raise error on string', () => {
              // Setup
            const document = testData.relationshipDataStringObject
              // Expectations
            expect(() => { deserialize(document) }).to.throw(/Resource linkage MUST be represented as one of the following: null, an empty array, a resource identifier object or an array of resource identifier objects/)
          })

          it('should raise error on number', () => {
              // Setup
            const document = testData.relationshipDataNumberObject
              // Expectations
            expect(() => { deserialize(document) }).to.throw(/Resource linkage MUST be represented as one of the following: null, an empty array, a resource identifier object or an array of resource identifier objects/)
          })
        })

        describe('meta: a "meta" object that contains non-standard meta-information about the relationship.', () => {
          describe('The value of each meta member MUST be an object (a "meta object").', () => {
            it('should raise error on null', () => {
              // Setup
              const document = testData.relationshipMetaNullObject
              // Expectations
              expect(() => { deserialize(document) }).to.throw(/The value of each meta member MUST be an object (a "meta object")/)
            })

            it('should raise error on string', () => {
              // Setup
              const document = testData.relationshipMetaStringObject
              // Expectations
              expect(() => { deserialize(document) }).to.throw(/The value of each meta member MUST be an object (a "meta object")/)
            })

            it('should raise error on number', () => {
              // Setup
              const document = testData.relationshipMetaNumberObject
              // Expectations
              expect(() => { deserialize(document) }).to.throw(/The value of each meta member MUST be an object (a "meta object")/)
            })
          })
        })
      })
    })
  })
})

// TODO: parsing
describe('Parse attributes', () => {
  const toDeserialize = {
    'data': {
      'id': '80ab0682-e7d1-4800-b12a-efca9e2f15c0',
      'type': 'apps',
      'attributes': {
        'name': 'Awesome app',
        'owner_id': 'e1fdbc0e-bb58-4ee1-9258-509d9b6f334c',
        'api_key': 'aHanApYk3y'
      }
    }
  }

  it('should deserialize object', () => {
    const deserialized = deserialize(toDeserialize)

    expect(deserialized.id).to.equal('80ab0682-e7d1-4800-b12a-efca9e2f15c0')
    expect(deserialized.type).to.equal('apps')
    expect(Object.keys(deserialized).length).to.equal(5)
  })
})

describe('Serialize json to json Api', () => {
  it('should serialize object', () => {
    const toSerialize = {
      'id': '80ab0682-e7d1-4800-b12a-efca9e2f15c0',
      'type': 'apps',
      'name': 'Awesome app',
      'owner_id': 'e1fdbc0e-bb58-4ee1-9258-509d9b6f334c',
      'api_key': 'aHanApYk3y'
    }

    const serialized = serialize(toSerialize)

    expect(serialized.data).to.be.an('object')
    expect(serialized.data.id).to.equal('80ab0682-e7d1-4800-b12a-efca9e2f15c0')
    expect(serialized.data.type).to.equal('apps')

    expect(serialized.data.attributes).to.be.an('object')
    expect(serialized.data.attributes.name).to.equal('Awesome app')
    expect(serialized.data.attributes.owner_id).to.equal('e1fdbc0e-bb58-4ee1-9258-509d9b6f334c')
    expect(serialized.data.attributes.api_key).to.equal('aHanApYk3y')

    expect(serialized.data.relationships).to.be.an('undefined')
  })

  it('should serialize object with single relationships', () => {
    const toSerialize = {
      'id': '80ab0682-e7d1-4800-b12a-efca9e2f15c0',
      'type': 'apps',
      'name': 'Awesome app',
      'relationships': {
        'user': {
          'id': 'e1fdbc0e-bb58-4ee1-9258-509d9b6f334b',
          'type': 'users'
        }
      },
      'meta': {
        'count': 10
      },
      'included': {
        'id': 'da465173-2a99-4cdf-b43f-4164b14ad5a7',
        'type': 'areas',
        'attributes': {
          'name': 'asdasd',
          'coordinates': {
            'x': 240.0625,
            'y': 560
          }
        }
      }
    }

    const serialized = serialize(toSerialize)
    expect(serialized.data).to.be.an('object')
    expect(serialized.data.relationships).to.be.an('object')
    expect(serialized.data.relationships.user).to.be.an('object')
    expect(serialized.data.relationships.user.id).to.equal('e1fdbc0e-bb58-4ee1-9258-509d9b6f334b')
    expect(serialized.data.relationships.user.type).to.equal('users')

    expect(serialized.meta).to.be.an('undefined')
    expect(serialized.included).to.be.an('undefined')
  })

  it('should serialize object with multiple relationships', () => {

  })
})
