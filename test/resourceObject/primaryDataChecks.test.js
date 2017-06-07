/* eslint-env mocha */
import { expect } from 'chai'
import { checkResourceIdentifierOrNull, checkResourceArray } from '../../src/resourceObject'
import testData from '../test-data.json'

describe('The document’s "primary data" is a representation of the resource or collection of resources targeted by a request.', () => {
  describe('Primary data MUST be either:', () => {
    it('- a single resource object', () => {
      // Setup
      const document = {
        'data': testData.fakeDataResourceObject
      }
      // Expectations
      expect(() => { checkResourceIdentifierOrNull(document.data) }).not.to.throw(Error)
    })

    it('- a single resource identifier object', () => {
      // Setup
      const document = {
        'data': testData.fakeDataResourceIdentifier
      }
      // Expectations
      expect(() => { checkResourceIdentifierOrNull(document.data) }).not.to.throw(Error)
    })

    it('- null', () => {
      // Setup
      const document = {
        'data': null
      }
      // Expectations
      expect(() => { checkResourceIdentifierOrNull(document.data) }).not.to.throw(Error)
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
      document.data.forEach(resource => {
        expect(() => { checkResourceArray(resource) }).not.to.throw(Error)
      })
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
      document.data.forEach(resource => {
        expect(() => { checkResourceArray(resource) }).not.to.throw(Error)
      })
    })

    it('- an empty array', () => {
      // Setup
      const document = {
        'data': []
      }
      // Expectations
      document.data.forEach(resource => {
        expect(() => { checkResourceArray(resource) }).not.to.throw(Error)
      })
    })
  })

  describe('Primary data MUST raise error for:', () => {
    it('- an Invalid resource identifier', () => {
      // Setup
      const document = {
        'data': {
          'attributes': {
            'attr': 'value'
          }
        }
      }
      // Expectations
      expect(() => { checkResourceIdentifierOrNull(document.data) }).to.throw(/Primary data MUST be either: a single resource object, a single resource identifier object, or null, for requests that target single resources/)
    })

    it('- an array with an Invalid resource object', () => {
      // Setup
      const document = {
        'data': [
          {
            'test': 'error'
          }
        ]
      }
      // Expectations
      document.data.forEach(resource => {
        expect(() => { checkResourceArray(resource) }).to.throw(/Primary data MUST be either: an array of resource objects, an array of resource identifier objects, or an empty array/)
      })
    })
  })
})
