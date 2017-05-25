/* eslint-env mocha */
import { expect } from 'chai'
import { includedUndefinedOrArray } from '../../src/compoundDocuments'

describe('"Errors":', () => {
  describe('Error objects MUST be returned as an array keyed by errors in the top level of a JSON API document.', () => {
    it('should raise error on null', () => {
      // Setup
      const document = {errors: null}
      // Expectations
      expect(() => includedUndefinedOrArray(document.errors)).to.throw(/Error objects MUST be returned as an array keyed by errors in the top level of a JSON API document/)
    })

    it('should raise error on string', () => {
      // Setup
      const document = {errors: 'string'}
      // Expectations
      expect(() => includedUndefinedOrArray(document.errors)).to.throw(/Error objects MUST be returned as an array keyed by errors in the top level of a JSON API document/)
    })

    it('should raise error on number', () => {
      // Setup
      const document = {errors: 2}
      // Expectations
      expect(() => includedUndefinedOrArray(document.errors)).to.throw(/Error objects MUST be returned as an array keyed by errors in the top level of a JSON API document/)
    })

    it('sould raise error on object', () => {
      const document = {errors: {}}
      expect(() => includedUndefinedOrArray(document.errors)).to.throw(/Error objects MUST be returned as an array keyed by errors in the top level of a JSON API document/)
    })
  })
})
