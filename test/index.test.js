/*
 * Copyright (c) 2017 Alessandro Colleoni
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/* eslint-env mocha */
import assert from 'assert'
import { deserialize } from '../src/index'

// TODO: errors
/*

test('A document MUST contain at least one of the following top-level members: data, errors or meta', () => {

    let toDeserialize = {}
    let deserialized = deserialize(toDeserialize)

})
*/

// TODO: parsing
describe('Parse attributes', () => {
  const toDeserialize = {
    'data': {
      'id': '80ab0682-e7d1-4800-b12a-efca9e2f15c0',
      'type': 'apps',
      'attributes': {
        'name': 'Awesome app',
        'owner_id': 'e1fdbc0e-bb58-4ee1-9258-509d9b6f334c',
        'api_key': 'aHanApYk3y'
      }
    }
  }

  it('should deserialize object', () => {
    const deserialized = deserialize(toDeserialize)

    assert.equal(deserialized.id, '80ab0682-e7d1-4800-b12a-efca9e2f15c0')
    assert.equal(deserialized.type, 'apps')
    assert.equal(Object.keys(deserialized).length, 5)
  })
})
