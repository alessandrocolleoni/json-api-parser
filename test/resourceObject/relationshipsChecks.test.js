/* eslint-env mocha */
import { expect } from 'chai'
import {deserialize} from '../../src/index'
import { relationshipsMustBeObject, relationshipMustContain, isResourceLinkage } from '../../src/resourceObject'
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
      expect(() => relationshipMustContain(document.data.relationships)).to.throw(/A "relationship object" MUST contain at least one of the following: links, data or meta/)
    })

    describe('links: a "links object" containing at least one of the following: self or related', () => {
      it('should raise error on empty links object', () => {
        // Setup
        const document = testData.relationshipEmptyLinksObject
        // Expectations
        expect(() => relationshipMustContain(document.data.relationships)).to.throw(/A "links object" MUST contain at least one of the following: self or related/)
      })
    })

    describe('meta: a "meta" object that contains non-standard meta-information about the relationship.', () => {
      describe('The value of each meta member MUST be an object (a "meta object").', () => {
        it('should raise error on null', () => {
          // Setup
          const document = testData.relationshipMetaNullObject
          // Expectations
          expect(() => { relationshipMustContain(document.data.relationships) }).to.throw(/The value of each meta member MUST be an object/)
        })

        it('should raise error on string', () => {
          // Setup
          const document = testData.relationshipMetaStringObject
          // Expectations
          expect(() => { relationshipMustContain(document.data.relationships) }).to.throw(/The value of each meta member MUST be an object/)
        })

        it('should raise error on number', () => {
          // Setup
          const document = testData.relationshipMetaNumberObject
          // Expectations
          expect(() => { relationshipMustContain(document.data.relationships) }).to.throw(/The value of each meta member MUST be an object/)
        })
      })
    })

    describe('data: a "resource linkage" object', () => {
      it('should raise error on string', () => {
        // Setup
        const document = testData.relationshipDataStringObject
        // Expectations
        expect(() => { isResourceLinkage(document.data.relationships) }).to.throw(/Resource linkage MUST be represented as one of the following: null, an empty array, a resource identifier object or an array of resource identifier objects/)
      })

      it('should raise error on number', () => {
        // Setup
        const document = testData.relationshipDataNumberObject
        // Expectations
        expect(() => { isResourceLinkage(document.data.relationships) }).to.throw(/Resource linkage MUST be represented as one of the following: null, an empty array, a resource identifier object or an array of resource identifier objects/)
      })

      describe('Resource linkage MUST be represented as one of the following:', () => {
        it('- null for empty to-one relationships', () => {
          // Setup
          const document = testData.relationshipDataNullObject
          // Expectations
          expect(() => { isResourceLinkage(document.data.relationships) }).not.to.throw(Error)
        })

        it('- an empty array ([]) for empty to-many relationships.', () => {
          // Setup
          const document = testData.relationshipDataEmptyArrayObject
          // Expectations
          expect(() => { isResourceLinkage(document.data.relationships) }).not.to.throw(Error)
        })

        it('- a single resource identifier object for non-empty to-one relationships.', () => {
          // Setup
          const document = testData.relationshipDataOneObject
          // Expectations
          expect(() => { isResourceLinkage(document.data.relationships) }).not.to.throw(Error)
        })

        it('- an array of resource identifier objects for non-empty to-many relationships.', () => {
          // Setup
          const document = testData.relationshipDataManyObject
          // Expectations
          expect(() => { isResourceLinkage(document.data.relationships) }).not.to.throw(Error)
        })
      })
    })
  })
})
