/* eslint-env mocha */
import { expect } from 'chai'
import { linksMustBeObject, linksMustHaveAtLeast } from '../../src/links'

describe('"Links":', () => {
  describe('The value of each links member MUST be an object (a “links object”).', () => {
    it('should raise error on null', () => {
      // Setup
      const document = {'links': null}
      // Expectations
      expect(() => linksMustBeObject(document.links)).to.throw(/The value of each links member MUST be an object/)
    })

    it('should raise error on string', () => {
      // Setup
      const document = {'links': 'test'}
      // Expectations
      expect(() => linksMustBeObject(document.links)).to.throw(/The value of each links member MUST be an object/)
    })

    it('should raise error on number', () => {
      // Setup
      const document = {'links': 2}
      // Expectations
      expect(() => linksMustBeObject(document.links)).to.throw(/The value of each links member MUST be an object/)
    })
  })

  describe('A "links object" MUST contain at least one of the following: self or related', () => {
    it('should raise error on empty links object', () => {
      // Setup
      const document = {'links': {}}
      // Expectations
      expect(() => linksMustHaveAtLeast(document.links)).to.throw(/A "links object" MUST contain at least one of the following: self or related/)
    })

    it('should raise error on empty \'related\' member', () => {
      const document = {
        'links': {
          'related': {}
        }
      }
      expect(() => linksMustHaveAtLeast(document.links)).to.throw(/An “link object” which can contain the following members: href or meta/)
    })
  })
})
