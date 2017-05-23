/* eslint-env mocha */
import { expect } from 'chai'
import testData from '../test-data.json'
import {
  checkIsObject,
  checkContainsAtLeast,
  checkDataAndErrosNotCoexist,
  checkIncludedNotPresent
} from '../../src/constraintsChecks'

describe('Top Level:', () => {
  describe('A JSON object MUST be at the root of every JSON API request and response containing data. This object defines a document’s “top level”.', () => {
    it('should raise error on undefined', () => {
      // Setup
      const document = undefined
      // Expectations
      expect(() => { checkIsObject(document) }).to.throw(/A JSON object MUST be at the root of every JSON API request and response containing data/)
    })

    it('should raise error on null', () => {
      // Setup
      const document = null
      // Expectations
      expect(() => { checkIsObject(document) }).to.throw(/A JSON object MUST be at the root of every JSON API request and response containing data/)
    })

    it('should raise error on number', () => {
      // Setup
      const document = 30
      // Expectations
      expect(() => { checkIsObject(document) }).to.throw(/A JSON object MUST be at the root of every JSON API request and response containing data/)
    })

    it('should raise error on string', () => {
      // Setup
      const document = ''
      // Expectations
      expect(() => { checkIsObject(document) }).to.throw(/A JSON object MUST be at the root of every JSON API request and response containing data/)
    })
  })

  describe('A document MUST contain at least one of the following top-level members: data, errors or meta', () => {
    it('should raise error on empty document', () => {
      // Setup
      let document = testData.emptyDocument
      // Expectations
      expect(() => { checkContainsAtLeast(document) }).to.throw(/A document MUST contain at least one of the following top-level members: data, errors or meta/)
    })
  })

  describe('The members data and errors MUST NOT coexist in the same document.', () => {
    it('should raise an error on malformed document', () => {
      // Setup
      const document = {
        data: testData.fakeDataResourceIdentifier,
        errors: testData.fakeErrorObject
      }
      // Expectations
      expect(() => { checkDataAndErrosNotCoexist(document) }).to.throw(/The members data and errors MUST NOT coexist in the same document./)
    })
  })

  describe('If a document does not contain a top-level data key, the included member MUST NOT be present either.', () => {
    it('should raise an error on malformed document', () => {
      // Setup
      const document = {
        errors: testData.fakeErrorObject,
        included: []
      }
      // Expectations
      expect(() => { checkIncludedNotPresent(document) }).to.throw(/If a document does NOT contain a top-level data key, the included member MUST NOT be present either./)
    })
  })
})
