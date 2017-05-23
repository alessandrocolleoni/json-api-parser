/* eslint-env mocha */
import { expect } from 'chai'
import { checkCommonNamespace } from '../../src/constraintsChecks'
import testData from '../test-data.json'

describe('"Resource objects" - Fields:', () => {
  describe('Fields for a resource object MUST share a common namespace with each other and with type and id.', () => {
    it('a resource can NOT have an "attribute" and "relationship" with the same name', () => {
      // Setup
      const document = testData.attributesRelationshipsCrossedNamespaceObject
      // Expectations
      expect(() => checkCommonNamespace(document.data)).to.throw(/A resource can NOT have an "attribute" and "relationship" with the same name/)
    })

    it('nor can it have an attribute or relationship named "type" or "id".', () => {
      // Setup
      const document = testData.attributesRelationshipsParentCrossedNamespaceObject
      // Expectations
      expect(() => checkCommonNamespace(document.data)).to.throw(/A resource can not have an "attribute" or "relationship" named type or id/)
    })

    it('nor can it have an attribute named "type" or "id".', () => {
      // Setup
      const document = testData.attributesParentCrossedNamespaceObject
      // Expectations
      expect(() => checkCommonNamespace(document.data)).to.throw(/A resource can not have an "attribute" or "relationship" named type or id/)
    })

    it('nor can it have a relationship named "type" or "id".', () => {
      // Setup
      const document = testData.relationshipsParentCrossedNamespaceObject
      // Expectations
      expect(() => checkCommonNamespace(document.data)).to.throw(/A resource can not have an "attribute" or "relationship" named type or id/)
    })
  })
})
