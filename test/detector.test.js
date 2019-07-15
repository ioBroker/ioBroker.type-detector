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
            id:                 'ham.0.TemperatureAndHumidity.Current-Relative-Humidity',
            _keysOptional:      Object.keys(objects),
            _usedIdsOptional:   []
        };

        const controls = detector.detect(options);

        console.log(JSON.stringify(controls));
        expect(controls[0].type).to.be.equal(Types.humidity);

        done();
    });
});