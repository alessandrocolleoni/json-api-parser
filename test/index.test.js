/*
 * Copyright (c) 2017 Alessandro Colleoni
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/* eslint-env mocha */
import { expect } from 'chai'
import { serialize, deserialize } from '../src/index'

describe('Deserialize json Api to json', () => {
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

    expect(deserialized.id).to.equal('80ab0682-e7d1-4800-b12a-efca9e2f15c0')
    expect(deserialized.type).to.equal('apps')
    expect(Object.keys(deserialized).length).to.equal(5)
  })
})

describe('Serialize json to json Api', () => {
  it('should serialize object', () => {
    const toSerialize = {
      'id': '80ab0682-e7d1-4800-b12a-efca9e2f15c0',
      'type': 'apps',
      'name': 'Awesome app',
      'owner_id': 'e1fdbc0e-bb58-4ee1-9258-509d9b6f334c',
      'api_key': 'aHanApYk3y'
    }

    const serialized = serialize(toSerialize)

    expect(serialized.data).to.be.an('object')
    expect(serialized.data.id).to.equal('80ab0682-e7d1-4800-b12a-efca9e2f15c0')
    expect(serialized.data.type).to.equal('apps')

    expect(serialized.data.attributes).to.be.an('object')
    expect(serialized.data.attributes.name).to.equal('Awesome app')
    expect(serialized.data.attributes.owner_id).to.equal('e1fdbc0e-bb58-4ee1-9258-509d9b6f334c')
    expect(serialized.data.attributes.api_key).to.equal('aHanApYk3y')

    expect(serialized.data.relationships).to.be.an('undefined')
  })

  it('should serialize object with single relationships', () => {
    const toSerialize = {
      'id': '80ab0682-e7d1-4800-b12a-efca9e2f15c0',
      'type': 'apps',
      'name': 'Awesome app',
      'relationships': {
        'user': {
          'id': 'e1fdbc0e-bb58-4ee1-9258-509d9b6f334b',
          'type': 'users'
        }
      },
      'meta': {
        'count': 10
      },
      'included': {
        'id': 'da465173-2a99-4cdf-b43f-4164b14ad5a7',
        'type': 'areas',
        'attributes': {
          'name': 'asdasd',
          'coordinates': {
            'x': 240.0625,
            'y': 560
          }
        }
      }
    }

    const serialized = serialize(toSerialize)
    expect(serialized.data).to.be.an('object')
    expect(serialized.data.relationships).to.be.an('object')
    expect(serialized.data.relationships.user).to.be.an('object')
    expect(serialized.data.relationships.user.id).to.equal('e1fdbc0e-bb58-4ee1-9258-509d9b6f334b')
    expect(serialized.data.relationships.user.type).to.equal('users')

    expect(serialized.meta).to.be.an('undefined')
    expect(serialized.included).to.be.an('undefined')
  })

  it('should serialize object with multiple relationships', () => {

  })
})
