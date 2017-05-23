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
})
