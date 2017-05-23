/* eslint-env mocha */
import { expect } from 'chai'
import { metaMustBeObject } from '../../src/meta'

describe('"Meta":', () => {
  describe('The value of each meta member MUST be an object (a “meta object”).', () => {
    it('should raise error on null', () => {
      // Setup
      const document = {
        'meta': null,
        'data': {}
      }
      // Expectations
      expect(() => metaMustBeObject(document.meta)).to.throw(/The value of each meta member MUST be an object/)
    })

    it('should raise error on string', () => {
      // Setup
      const document = {
        'meta': 'meta',
        'data': {}
      }
      // Expectations
      expect(() => metaMustBeObject(document.meta)).to.throw(/The value of each meta member MUST be an object/)
    })

    it('should raise error on number', () => {
      // Setup
      const document = {
        'meta': 2,
        'data': {}
      }
      // Expectations
      expect(() => metaMustBeObject(document.meta)).to.throw(/The value of each meta member MUST be an object/)
    })
  })
})
