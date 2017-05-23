/* eslint-env mocha */
import { expect } from 'chai'
import {deserialize} from '../../src/index'
import { relationshipsMustBeObject } from '../../src/resourceObject'
import testData from '../test-data.json'

describe('"Resource objects" - Relationships:', () => {
  describe('The value of the relationships key MUST be an object (a "relationships object").', () => {
    it('should raise error on null', () => {
      // Setup
      const document = testData.relationshipNullObject
      // Expectations
      expect(() => relationshipsMustBeObject(document.data)).to.throw(/The value of the relationships key MUST be an object/)
    })

    it('should raise error on string', () => {
      // Setup
      const document = testData.relationshipStringObject
      // Expectations
      expect(() => relationshipsMustBeObject(document.data)).to.throw(/The value of the relationships key MUST be an object/)
    })

    it('should raise error on number', () => {
      // Setup
      const document = testData.relationshipNumberObject
      // Expectations
      expect(() => relationshipsMustBeObject(document.data)).to.throw(/The value of the relationships key MUST be an object/)
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
