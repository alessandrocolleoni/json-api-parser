/* eslint-env mocha */
import { expect } from 'chai'
import { includedUndefinedOrArray } from '../../src/compoundDocuments'

describe('"Links":', () => {
  describe('In a compound document, all included resources MUST be represented as an array of resource objects in a top-level included member.', () => {
    it('should raise error on null', () => {
      // Setup
      const document = {data: {}, included: null}
      // Expectations
      expect(() => includedUndefinedOrArray(document.included)).to.throw(/In a compound document, all included resources MUST be represented as an array of resource objects in a top-level included member/)
    })

    it('should raise error on string', () => {
      // Setup
      const document = {data: {}, included: 'string'}
      // Expectations
      expect(() => includedUndefinedOrArray(document.included)).to.throw(/In a compound document, all included resources MUST be represented as an array of resource objects in a top-level included member/)
    })

    it('should raise error on number', () => {
      // Setup
      const document = {data: {}, included: 2}
      // Expectations
      expect(() => includedUndefinedOrArray(document.included)).to.throw(/In a compound document, all included resources MUST be represented as an array of resource objects in a top-level included member/)
    })

    it('sould raise error on object', () => {
      const document = {data: {}, included: {}}
      expect(() => includedUndefinedOrArray(document.included)).to.throw(/In a compound document, all included resources MUST be represented as an array of resource objects in a top-level included member/)
    })
  })
})
