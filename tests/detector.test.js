var expect = require('chai').expect;

const {Types, ChannelDetector} = require('../index');

describe('Test Detector', () => {
    it('Must detect temperature sensor', done => {
        const detector = new ChannelDetector();

        const objects = {
            "ham.0.TemperatureAndHumidity.Current-Relative-Humidity" :{
                "_id": "ham.0.TemperatureAndHumidity.Current-Relative-Humidity",
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

        const options = {
            objects:            objects,
            id:                 'ham.0.TemperatureAndHumidity.Current-Relative-Humidity',
            _keysOptional:      Object.keys(objects),
            _usedIdsOptional:   []
        };

        const controls = detector.detect(options);

        console.log(JSON.stringify(controls));
        expect(controls[0].type).to.be.equal('info');

        done();
    });
});