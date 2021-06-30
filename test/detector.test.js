var expect = require('chai').expect;

const {Types, ChannelDetector} = require('../index');

describe('Test Detector', () => {
    it('Must detect temperature sensor from channel', done => {
        const detector = new ChannelDetector();

        const objects = {
            "ham.0.TemperatureAndHumidity" :{
                "common": {
                    "name": "Current Relative Humidity Channel",
                },
                "type": "channel"
            },
            "ham.0.TemperatureAndHumidity.Current-Relative-Humidity" :{
                "common": {
                    "name": "Current Relative Humidity",
                    "type": "number",
                    "unit": "%",
                    "role": "value.humidity",
                    "min": 0,
                    "max": 100,
                    "read": true,
                    "write": false
                },
                "type": "state"
            }
        };

        Object.keys(objects).forEach(id => objects[id]._id = id);

        const options = {
            objects:            objects,
            id:                 'ham.0.TemperatureAndHumidity',
            _keysOptional:      Object.keys(objects),
            _usedIdsOptional:   []
        };

        const controls = detector.detect(options);

        console.log(JSON.stringify(controls));
        expect(controls[0].type).to.be.equal(Types.humidity);

        done();
    });

    it('Must detect nothing if not all required states are defined', done => {
        const detector = new ChannelDetector();

        const objects = {
            'something.0.channel': {
                common: {
                    name: 'Channel',
                },
                type: 'channel',
            },
            'something.0.channel.state': {
                common: {
                    name: 'Some state',
                    type: 'some-type',
                    role: 'some-role.inhibit',
                    read: false,
                    write: false,
                },
                type: 'state',
            },
        };

        Object.keys(objects).forEach(id => (objects[id]._id = id));

        const options = {
            objects: objects,
            id: 'something.0.channel',
            _keysOptional: Object.keys(objects),
            _usedIdsOptional: [],
        };

        const controls = detector.detect(options);

        console.log(JSON.stringify(controls));
        expect(controls).to.be.null;

        done();
    });

    it('Must detect temperature sensor from state', done => {
        const detector = new ChannelDetector();

        const objects = {
            "ham.0.TemperatureAndHumidity.Current-Relative-Humidity" :{
                "common": {
                    "name": "Current Relative Humidity",
                    "type": "number",
                    "unit": "%",
                    "role": "value.humidity",
                    "min": 0,
                    "max": 100,
                    "read": true,
                    "write": false
                },
                "type": "state"
            }
        };

        Object.keys(objects).forEach(id => objects[id]._id = id);

        const options = {
            objects:            objects,
            id:                  Object.keys(objects)[0],
            _keysOptional:      Object.keys(objects),
            _usedIdsOptional:   []
        };

        const controls = detector.detect(options);

        console.log(JSON.stringify(controls));
        expect(controls[0].type).to.be.equal(Types.humidity);

        done();
    });

    it('Must detect air conditioner sensor from state', done => {
        const detector = new ChannelDetector();

        const objects = {
            "alias.0.Hauptzimmer.AC": {
                "common": {
                    "name": {
                        "de": "AC"
                    },
                    "role": "airCondition",
                },
                "native": {},
                "type": "channel"
            },
            "alias.0.Hauptzimmer.AC.SET": {
                "common": {
                    "name": "SET",
                    "role": "level.temperature",
                    "type": "number",
                    "read": true,
                    "write": true,
                    "alias": {
                        "id": "javascript.0.ac.temperature"
                    },
                    "unit": "°C"
                },
                "native": {},
                "type": "state"
            },
            "alias.0.Hauptzimmer.AC.MODE": {
                "common": {
                    "name": "MODE",
                    "role": "level.mode.airconditioner",
                    "type": "number",
                    "read": true,
                    "write": true,
                    "alias": {
                        "id": "javascript.0.ac.mode"
                    },
                    "states": {
                        "0": "OFF",
                        "1": "AUTO",
                        "2": "COOL",
                        "3": "HEAT",
                        "4": "ECO",
                        "5": "FAN_ONLY",
                        "6": "DRY"
                    }
                },
                "native": {},
                "type": "state"
            },
            "alias.0.Hauptzimmer.AC.POWER": {
                "native": {},
                "type": "state",
                "common": {
                    "alias": {
                        "id": "javascript.0.ac.power"
                    },
                    "name": "POWER",
                    "role": "switch.power",
                    "write": true,
                    "type": "boolean"
                }
            }
        };

        Object.keys(objects).forEach(id => objects[id]._id = id);

        const options = {
            objects:            objects,
            id:                 Object.keys(objects)[0],
            _keysOptional:      Object.keys(objects),
            _usedIdsOptional:   [],
            //allowedTypes:       [Types.airCondition], // for tests
        };

        const controls = detector.detect(options);

        console.log(JSON.stringify(controls));
        expect(controls[0].type).to.be.equal(Types.airCondition);

        const powerId = controls[0].states.find(s => s.name === 'POWER').id;
        expect(powerId).to.be.equal(Object.keys(objects).pop());

        done();
    });

    it('Must detect vacuum mihome from states', done => {
        const detector = new ChannelDetector();

        const objects = require('./mihome-vacuum.0.json');

        Object.keys(objects).forEach(id => objects[id]._id = id);

        const options = {
            objects,
            id:                 Object.keys(objects)[0],
            _keysOptional:      Object.keys(objects),
            _usedIdsOptional:   [],
            //allowedTypes:       [Types.airCondition], // for tests
        };

        const controls = detector.detect(options);

        console.log(JSON.stringify(controls));
        expect(controls[0].type).to.be.equal(Types.vacuumCleaner);

        const powerId = controls[0].states.find(s => s.name === 'POWER').id;
        expect(powerId).to.be.equal('mihome-vacuum.0.control.clean_home');

        done();
    });

    it('Must detect cameras from states', done => {
        const detector = new ChannelDetector();

        const objects = require('./cameras.0.cameras.json');

        Object.keys(objects).forEach(id => objects[id]._id = id);

        const options = {
            objects,
            id:                 Object.keys(objects)[0],
            _keysOptional:      Object.keys(objects),
            _usedIdsOptional:   [],
            //allowedTypes:       [Types.airCondition], // for tests
        };

        const controls = detector.detect(options);

        console.log(JSON.stringify(controls));
        expect(controls[0].type).to.be.equal(Types.camera);

        const powerId = controls[0].states.find(s => s.name === 'FILE').id;
        expect(powerId).to.be.equal('cameras.0.cameras.cam1');

        done();
    });

    it('Must detect charts from states', done => {
        const detector = new ChannelDetector();

        const objects = {
            "echarts.0.Place.PresetMy": {
                "common": {
                    "name": "PresetMy"
                },
                "native": {
                    "url": "",
                    "data": {

                    }
                },
                "type": "chart",
                "_id": "echarts.0.Place.PresetMy"
            }
        };

        Object.keys(objects).forEach(id => objects[id]._id = id);

        const options = {
            objects,
            id:                 Object.keys(objects)[0],
            _keysOptional:      Object.keys(objects),
            _usedIdsOptional:   [],
            //allowedTypes:       [Types.airCondition], // for tests
        };

        const controls = detector.detect(options);

        console.log(JSON.stringify(controls));
        expect(controls[0].type).to.be.equal(Types.chart);

        const powerId = controls[0].states.find(s => s.name === 'CHART').id;
        expect(powerId).to.be.equal('echarts.0.Place.PresetMy');

        done();
    });

    it('Must detect fire sensor from states', done => {
        const detector = new ChannelDetector();

        const objects = require('./fireSensor.json');

        Object.keys(objects).forEach(id => objects[id]._id = id);

        const options = {
            objects,
            id:                 Object.keys(objects)[0],
            _keysOptional:      Object.keys(objects),
            _usedIdsOptional:   [],
            //allowedTypes:       [Types.airCondition], // for tests
        };

        const controls = detector.detect(options);

        console.log(JSON.stringify(controls));
        expect(controls[0].type).to.be.equal(Types.fireAlarm);

        const powerId = controls[0].states.find(s => s.name === 'ACTUAL').id;
        expect(powerId).to.be.equal('alias.0.MyFolder.Gerät_1.ACTUAL');

        done();
    });
});