/* eslint-env mocha */
import { expect } from 'chai'
import { errorsIsArray, errorsAcceptedFields } from '../../src/errors'

describe('"Errors":', () => {
  describe('Error objects MUST be returned as an array keyed by errors in the top level of a JSON API document.', () => {
    it('should raise error on null', () => {
      // Setup
      const document = {errors: null}
      // Expectations
      expect(() => errorsIsArray(document.errors)).to.throw(/Error objects MUST be returned as an array keyed by errors in the top level of a JSON API document/)
    })

    it('should raise error on string', () => {
      // Setup
      const document = {errors: 'string'}
      // Expectations
      expect(() => errorsIsArray(document.errors)).to.throw(/Error objects MUST be returned as an array keyed by errors in the top level of a JSON API document/)
    })

    it('should raise error on number', () => {
      // Setup
      const document = {errors: 2}
      // Expectations
      expect(() => errorsIsArray(document.errors)).to.throw(/Error objects MUST be returned as an array keyed by errors in the top level of a JSON API document/)
    })

    it('sould raise error on object', () => {
      const document = {errors: {}}
      expect(() => errorsIsArray(document.errors)).to.throw(/Error objects MUST be returned as an array keyed by errors in the top level of a JSON API document/)
    })
  })

  describe('Accepted fields', () => {
    it('should raise error on non accepted field', () => {
      const document = {
        errors: [
          {
            test: ''
          }
        ]
      }

      document.errors.forEach(error => {
        expect(() => errorsAcceptedFields(error)).to.throw(/An error object MAY have the following members: id, links, status, code, title, detail, source, meta/)
      })
    })

    it('should check links', () => {
      const document = {
        errors: [
          {
            links: {
              self: 'protocol://url'
            }
          }
        ]
      }

      document.errors.forEach(error => {
        expect(() => errorsAcceptedFields(error)).to.throw(/A links object containing the following members: about/)
      })
    })

    it('should check meta', () => {
      const document = {
        errors: [
          {
            meta: 'protocol://url'
          }
        ]
      }

      document.errors.forEach(error => {
        expect(() => errorsAcceptedFields(error)).to.throw(/The value of each meta member MUST be an object/)
      })
    })

    it('should accept error', () => {
      const document = {
        errors: [
          {
            id: 'error-id'
          }
        ]
      }

      document.errors.forEach(error => {
        expect(() => errorsAcceptedFields(error)).not.to.throw()
      })
    })
  })
})
