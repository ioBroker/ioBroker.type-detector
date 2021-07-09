var expect = require('chai').expect;

const {Types, ChannelDetector} = require('../index');

function expectStateToHaveId(states, name, id, alternativeId) {
    const control = states.find(s => s.name === name);
    expect(control).to.be.ok;
    expect(control).to.have.property('id');
    if (control.id !== id && control.id !== alternativeId) {
        expect(control.id).to.be.equal(id);
    }
}

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

    it('Must detect forecast from accuweather and assign days correctly', done => {
        const detector = new ChannelDetector();

        const objects = require('./weather_accuweather.json');
        Object.keys(objects).forEach(id => objects[id]._id = id);

        const options = {
            objects,
            id:                 Object.keys(objects)[0],
            _keysOptional:      Object.keys(objects),
            _usedIdsOptional:   []
        };

        const controls = detector.detect(options);
        console.dir(controls, { depth: null});
        expect(controls[0].type).to.be.equal(Types.weatherForecast);
        const expectMyStateToHaveId = expectStateToHaveId.bind(null, controls[0].states);
        expectMyStateToHaveId('ICON', 'accuweather.0.Summary.WeatherIconURL_d1', 'accuweather.0.Summary.WeatherIconURL');
        expectMyStateToHaveId('TEMP', 'accuweather.0.Summary.Temperature');
        expectMyStateToHaveId('DATE', 'accuweather.0.Summary.DateTime_d1', 'accuweather.0.Summary.Date');
        expectMyStateToHaveId('FEELS_LIKE', 'accuweather.0.Summary.RealFeelTemperature');
        expectMyStateToHaveId('WIND_SPEED', 'accuweather.0.Summary.WindSpeed_d1', 'accuweather.0.Summary.WindSpeed');
        expectMyStateToHaveId('WIND_DIRECTION', 'accuweather.0.Summary.WindDirection', 'accuweather.0.Summary.WindDirection_d1');
        expectMyStateToHaveId('WIND_DIRECTION_STR', 'accuweather.0.Summary.WindDirectionStr', 'accuweather.0.Summary.WindDirectionStr_d1');
        expectMyStateToHaveId('HUMIDITY', 'accuweather.0.Summary.RelativeHumidity');
        expectMyStateToHaveId('PRESSURE', 'accuweather.0.Summary.Pressure');
        expectMyStateToHaveId('DOW', 'accuweather.0.Summary.DayOfWeek', 'accuweather.0.Summary.DayOfWeek_d1');
        expectMyStateToHaveId('TEMP_MIN', 'accuweather.0.Summary.TempMin_d1');
        expectMyStateToHaveId('TEMP_MAX', 'accuweather.0.Summary.TempMax_d1');

        const days = [1, 2, 3, 4]
        for (const day of days) {
            expectMyStateToHaveId(`DATE${day}`, `accuweather.0.Summary.DateTime_d${day + 1}`);
            expectMyStateToHaveId(`ICON${day}`, `accuweather.0.Summary.WeatherIconURL_d${day + 1}`);
            expectMyStateToHaveId(`STATE${day}`, `accuweather.0.Summary.WeatherText_d${day + 1}`);
            expectMyStateToHaveId(`TEMP_MIN${day}`, `accuweather.0.Summary.TempMin_d${day + 1}`);
            expectMyStateToHaveId(`TEMP_MAX${day}`, `accuweather.0.Summary.TempMax_d${day + 1}`);
            expectMyStateToHaveId(`WIND_SPEED${day}`, `accuweather.0.Summary.WindSpeed_d${day + 1}`);
            expectMyStateToHaveId(`WIND_DIRECTION${day}`, `accuweather.0.Summary.WindDirection_d${day + 1}`);
            expectMyStateToHaveId(`WIND_DIRECTION_STR${day}`, `accuweather.0.Summary.WindDirectionStr_d${day + 1}`);
            expectMyStateToHaveId(`DOW${day}`, `accuweather.0.Summary.DayOfWeek_d${day + 1}`);
            expectMyStateToHaveId(`PRECIPITATION_CHANCE${day}`, `accuweather.0.Summary.PrecipitationProbability_d${day + 1}`);
            expectMyStateToHaveId(`PRECIPITATION${day}`, `accuweather.0.Summary.TotalLiquidVolume_d${day + 1}`);
        }
        done();
    });

    it('Must detect forecast from dasWetter and assign days correctly', done => {
        const detector = new ChannelDetector();

        const objects = require('./weather_daswetter.json');
        Object.keys(objects).forEach(id => objects[id]._id = id);

        const options = {
            objects,
            id:                 Object.keys(objects)[0],
            _keysOptional:      Object.keys(objects),
            _usedIdsOptional:   []
        };

        const controls = detector.detect(options);
        console.dir(controls, { depth: null});
        expect(controls[0].type).to.be.equal(Types.weatherForecast);
        const expectMyStateToHaveId = expectStateToHaveId.bind(null, controls[0].states);
        expectMyStateToHaveId('ICON', 'daswetter.0.NextDays.Location_1.Day_1.iconURL');
        expectMyStateToHaveId('TEMP_MIN', 'daswetter.0.NextDays.Location_1.Day_1.Minimale_Temperatur_value');
        expectMyStateToHaveId('TEMP_MAX', 'daswetter.0.NextDays.Location_1.Day_1.Maximale_Temperatur_value');


        const days = [1, 2, 3, 4, 5, 6];
        for (const day of days) {
            expectMyStateToHaveId(`ICON${day}`, `daswetter.0.NextDays.Location_1.Day_${day+1}.iconURL`);
            expectMyStateToHaveId(`TEMP_MIN${day}`, `daswetter.0.NextDays.Location_1.Day_${day+1}.Minimale_Temperatur_value`);
            expectMyStateToHaveId(`TEMP_MAX${day}`, `daswetter.0.NextDays.Location_1.Day_${day+1}.Maximale_Temperatur_value`);
            expectMyStateToHaveId(`DOW${day}`, `daswetter.0.NextDays.Location_1.Day_${day+1}.Tag_value`);
        }
        done();
    });

    it('Must detect forecast from weatherunderground and assign days correctly', done => {
        const detector = new ChannelDetector();

        const objects = require('./weather_weatherunderground.json');
        Object.keys(objects).forEach(id => objects[id]._id = id);

        const options = {
            objects,
            id:                 Object.keys(objects)[0],
            _keysOptional:      Object.keys(objects),
            _usedIdsOptional:   []
        };

        const controls = detector.detect(options);
        console.dir(controls, { depth: null});
        for (const types of controls) {
            console.log('Found ' + types.type);
        }
        expect(controls[0].type).to.be.equal(Types.weatherForecast);
        const expectMyStateToHaveId = expectStateToHaveId.bind(null, controls[0].states);
        expectMyStateToHaveId('ICON', 'weatherunderground.0.forecast.0d.iconURL');
        expectMyStateToHaveId('TEMP', 'weatherunderground.0.forecast.current.temp');
        expectMyStateToHaveId('TEMP_MIN', 'weatherunderground.0.forecast.0d.tempMin');
        expectMyStateToHaveId('TEMP_MAX', 'weatherunderground.0.forecast.0d.tempMax');
        expectMyStateToHaveId('PRECIPITATION_CHANCE', 'weatherunderground.0.forecast.0d.precipitationChance');
        expectMyStateToHaveId('DATE', 'weatherunderground.0.forecast.current.observationTime');
        expectMyStateToHaveId('STATE', 'weatherunderground.0.forecast.current.weather');
        expectMyStateToHaveId('PRESSURE', 'weatherunderground.0.forecast.current.pressure');
        expectMyStateToHaveId('HUMIDITY', 'weatherunderground.0.forecast.current.relativeHumidity');
        expectMyStateToHaveId('WIND_CHILL', 'weatherunderground.0.forecast.current.windChill');
        expectMyStateToHaveId('WIND_CHILL', 'weatherunderground.0.forecast.current.windChill');

        const days = [1, 2, 3];
        for (const day of days) {
            expectMyStateToHaveId(`ICON${day}`, `weatherunderground.0.forecast.${day}d.iconURL`);
            expectMyStateToHaveId(`TEMP_MIN${day}`, `weatherunderground.0.forecast.${day}d.tempMin`);
            expectMyStateToHaveId(`TEMP_MAX${day}`, `weatherunderground.0.forecast.${day}d.tempMax`);
            expectMyStateToHaveId(`DATE${day}`, `weatherunderground.0.forecast.${day}d.date`);
        }

        done();
    });
});

