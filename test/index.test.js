/*
 * Copyright (c) 2017 Alessandro Colleoni
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { deserialize } from '../src/index'


// TODO: errors
/*

test('A document MUST contain at least one of the following top-level members: data, errors or meta', () => {

    let toDeserialize = {}
    let deserialized = deserialize(toDeserialize)

})
*/

// TODO: parsing
test('Parse attributes', () => {

    let toDeserialize = {
        "data": {
            "id": "80ab0682-e7d1-4800-b12a-efca9e2f15c0",
            "type": "apps",
            "attributes": {
                "name": "Awesome app",
                "owner_id": "e1fdbc0e-bb58-4ee1-9258-509d9b6f334c",
                "api_key": "aHanApYk3y",
            }
        }
    }

    let deserialized = deserialize(toDeserialize)

    expect(deserialized.id).toBe("80ab0682-e7d1-4800-b12a-efca9e2f15c0")
    expect(deserialized.type).toBe("apps")

    expect(Object.keys(deserialized).length).toBe(5)

})

test('Included', () => {

    let toDeserialize = {"data":{"id":"ea49f080-29f3-41f1-8db2-7ed3ea9d1e09","type":"locations","attributes":{"name":"Top","sector":null,"description":null,"address":"Via Gerolamo Zanchi, 22, 24126 Bergamo BG, Italy","logo":{"url":"https://dev-iab-media.s3.amazonaws.com/uploads/location/logo/ea49f080-29f3-41f1-8db2-7ed3ea9d1e09/file.png","thumb":{"url":"https://dev-iab-media.s3.amazonaws.com/uploads/location/logo/ea49f080-29f3-41f1-8db2-7ed3ea9d1e09/thumb_file.png"},"thumb_2x":{"url":"https://dev-iab-media.s3.amazonaws.com/uploads/location/logo/ea49f080-29f3-41f1-8db2-7ed3ea9d1e09/thumb_2x_file.png"}},"subway":[{"title":"linea gialla","text":"prendi la metro e muoviti"},{"title":"2","text":"è la gialla"},{"title":"verde","text":"verde"},{"title":"azzurra","text":"Prova"},{"title":"Prova","text":"Prova"}],"plane":[{"title":"aereo","text":"1"},{"title":"aereo","text":"3"},{"title":"aereo","text":"2"}],"train":[{"title":"treno 2","text":"treno da boh"},{"title":"3","text":"3"}],"surface":[]},"relationships":{"events":{"data":[{"id":"9674661f-2725-4b0e-b39e-f36052902350","type":"events"},{"id":"e5587cfc-230b-44e0-8d0d-d698919b045d","type":"events"}]},"areas":{"data":[{"id":"da465173-2a99-4cdf-b43f-4164b14ad5a7","type":"areas"},{"id":"594bf80d-d05c-42db-9e92-b57c2705d9eb","type":"areas"},{"id":"b83cbc23-4480-41f8-8b46-4d1a8f54d315","type":"areas"},{"id":"023f9709-a5bb-4e9b-9bd4-83503bc7e499","type":"areas"},{"id":"f45adb2e-e970-4ad4-96ab-0a949cc84294","type":"areas"},{"id":"cc8c8a5c-d93b-46c0-9f5f-87dab463e1b2","type":"areas"},{"id":"f3223b18-5da3-477f-9057-fa200e41f453","type":"areas"},{"id":"c586c7e8-cfd3-4f78-95c7-311035b1fad5","type":"areas"}]},"maps":{"data":[{"id":"9bfe2a52-6a85-4054-8d2e-49d59f3bbbfd","type":"maps"},{"id":"58ca8831-c6a0-4fac-9ad4-0d00e0b8f92b","type":"maps"}]}},"meta":{"logo_processing":false}},"included":[{"id":"da465173-2a99-4cdf-b43f-4164b14ad5a7","type":"areas","attributes":{"name":"asdasd","coordinates":{"x":240.0625,"y":560}},"relationships":{"event_sessions":{"data":[{"id":"4f218ac6-6ef4-43f8-a05a-1bc124f37043","type":"event_sessions"}]},"map":{"data":{"id":"9bfe2a52-6a85-4054-8d2e-49d59f3bbbfd","type":"maps"}}}},{"id":"4f218ac6-6ef4-43f8-a05a-1bc124f37043","type":"event_sessions","attributes":{"title":"test","description":"tppd","kind":"registration","super_group":"keynote","starts_at":"2017-04-03T10:00:00.000Z","ends_at":"2017-04-03T10:30:00.000Z","logo":{"url":null,"thumb":{"url":null},"thumb_2x":{"url":null}},"feedback_text":null},"relationships":{"company":{"data":null},"event":{"data":{"id":"e5587cfc-230b-44e0-8d0d-d698919b045d","type":"events"}},"speakers":{"data":[]},"area":{"data":{"id":"da465173-2a99-4cdf-b43f-4164b14ad5a7","type":"areas"}},"topic":{"data":null},"documents":{"data":[]}}},{"id":"9bfe2a52-6a85-4054-8d2e-49d59f3bbbfd","type":"maps","attributes":{"name":"3","map":{"url":"https://dev-iab-media.s3.amazonaws.com/uploads/map/map/9bfe2a52-6a85-4054-8d2e-49d59f3bbbfd/file.jpeg","medium":{"url":"https://dev-iab-media.s3.amazonaws.com/uploads/map/map/9bfe2a52-6a85-4054-8d2e-49d59f3bbbfd/medium_file.jpeg"},"medium_2x":{"url":"https://dev-iab-media.s3.amazonaws.com/uploads/map/map/9bfe2a52-6a85-4054-8d2e-49d59f3bbbfd/medium_2x_file.jpeg"}}},"relationships":{"location":{"data":{"id":"ea49f080-29f3-41f1-8db2-7ed3ea9d1e09","type":"locations"}},"areas":{"data":[{"id":"da465173-2a99-4cdf-b43f-4164b14ad5a7","type":"areas"},{"id":"594bf80d-d05c-42db-9e92-b57c2705d9eb","type":"areas"},{"id":"b83cbc23-4480-41f8-8b46-4d1a8f54d315","type":"areas"},{"id":"023f9709-a5bb-4e9b-9bd4-83503bc7e499","type":"areas"},{"id":"f45adb2e-e970-4ad4-96ab-0a949cc84294","type":"areas"},{"id":"cc8c8a5c-d93b-46c0-9f5f-87dab463e1b2","type":"areas"}]}},"meta":{"map_processing":true}},{"id":"594bf80d-d05c-42db-9e92-b57c2705d9eb","type":"areas","attributes":{"name":"asd","coordinates":{"x":-175.9375,"y":592}},"relationships":{"event_sessions":{"data":[]},"map":{"data":{"id":"9bfe2a52-6a85-4054-8d2e-49d59f3bbbfd","type":"maps"}}}},{"id":"b83cbc23-4480-41f8-8b46-4d1a8f54d315","type":"areas","attributes":{"name":"test content","coordinates":{"x":172.0625,"y":316}},"relationships":{"event_sessions":{"data":[{"id":"2dcbe4b2-a7f3-41ff-b08c-a201e5c5d025","type":"event_sessions"},{"id":"8b483dbd-5f7a-4e77-8255-2a2ee04dd941","type":"event_sessions"}]},"map":{"data":{"id":"9bfe2a52-6a85-4054-8d2e-49d59f3bbbfd","type":"maps"}}}},{"id":"2dcbe4b2-a7f3-41ff-b08c-a201e5c5d025","type":"event_sessions","attributes":{"title":"deded","description":"ededede","kind":"speech","super_group":"keynote","starts_at":"2017-04-03T14:06:00.000Z","ends_at":"2017-04-03T15:06:00.000Z","logo":{"url":null,"thumb":{"url":null},"thumb_2x":{"url":null}},"feedback_text":"eded"},"relationships":{"company":{"data":null},"event":{"data":{"id":"9674661f-2725-4b0e-b39e-f36052902350","type":"events"}},"speakers":{"data":[{"id":"99166197-c058-4272-9af8-7f070ad782b2","type":"speakers"}]},"area":{"data":{"id":"b83cbc23-4480-41f8-8b46-4d1a8f54d315","type":"areas"}},"topic":{"data":null},"documents":{"data":[]}}},{"id":"8b483dbd-5f7a-4e77-8255-2a2ee04dd941","type":"event_sessions","attributes":{"title":"www","description":"www","kind":"speech","super_group":"keynote","starts_at":"2017-04-03T13:58:00.000Z","ends_at":"2017-04-03T14:58:00.000Z","logo":{"url":null,"thumb":{"url":null},"thumb_2x":{"url":null}},"feedback_text":"ww"},"relationships":{"company":{"data":null},"event":{"data":{"id":"e5587cfc-230b-44e0-8d0d-d698919b045d","type":"events"}},"speakers":{"data":[{"id":"99166197-c058-4272-9af8-7f070ad782b2","type":"speakers"}]},"area":{"data":{"id":"b83cbc23-4480-41f8-8b46-4d1a8f54d315","type":"areas"}},"topic":{"data":null},"documents":{"data":[{"id":"d2ae92f8-6bc4-47c6-8017-0ed3ea05c588","type":"documents"}]}}},{"id":"023f9709-a5bb-4e9b-9bd4-83503bc7e499","type":"areas","attributes":{"name":"af","coordinates":{"x":-223.9375,"y":336}},"relationships":{"event_sessions":{"data":[]},"map":{"data":{"id":"9bfe2a52-6a85-4054-8d2e-49d59f3bbbfd","type":"maps"}}}},{"id":"f45adb2e-e970-4ad4-96ab-0a949cc84294","type":"areas","attributes":{"name":"cxxz","coordinates":{"x":-27.9375,"y":284}},"relationships":{"event_sessions":{"data":[]},"map":{"data":{"id":"9bfe2a52-6a85-4054-8d2e-49d59f3bbbfd","type":"maps"}}}},{"id":"cc8c8a5c-d93b-46c0-9f5f-87dab463e1b2","type":"areas","attributes":{"name":"Test","coordinates":{"x":-452,"y":1012}},"relationships":{"event_sessions":{"data":[]},"map":{"data":{"id":"9bfe2a52-6a85-4054-8d2e-49d59f3bbbfd","type":"maps"}}}},{"id":"f3223b18-5da3-477f-9057-fa200e41f453","type":"areas","attributes":{"name":"xxxxx","coordinates":{"x":-291.9375,"y":500}},"relationships":{"event_sessions":{"data":[]},"map":{"data":{"id":"58ca8831-c6a0-4fac-9ad4-0d00e0b8f92b","type":"maps"}}}},{"id":"58ca8831-c6a0-4fac-9ad4-0d00e0b8f92b","type":"maps","attributes":{"name":"1","map":{"url":"https://dev-iab-media.s3.amazonaws.com/uploads/map/map/58ca8831-c6a0-4fac-9ad4-0d00e0b8f92b/file.jpeg","medium":{"url":"https://dev-iab-media.s3.amazonaws.com/uploads/map/map/58ca8831-c6a0-4fac-9ad4-0d00e0b8f92b/medium_file.jpeg"},"medium_2x":{"url":"https://dev-iab-media.s3.amazonaws.com/uploads/map/map/58ca8831-c6a0-4fac-9ad4-0d00e0b8f92b/medium_2x_file.jpeg"}}},"relationships":{"location":{"data":{"id":"ea49f080-29f3-41f1-8db2-7ed3ea9d1e09","type":"locations"}},"areas":{"data":[{"id":"f3223b18-5da3-477f-9057-fa200e41f453","type":"areas"},{"id":"c586c7e8-cfd3-4f78-95c7-311035b1fad5","type":"areas"}]}},"meta":{"map_processing":true}},{"id":"c586c7e8-cfd3-4f78-95c7-311035b1fad5","type":"areas","attributes":{"name":"add","coordinates":{"x":168.0625,"y":584}},"relationships":{"event_sessions":{"data":[]},"map":{"data":{"id":"58ca8831-c6a0-4fac-9ad4-0d00e0b8f92b","type":"maps"}}}}]}

    let deserialized = deserialize(toDeserialize);
    //console.log(deserialized)

})
