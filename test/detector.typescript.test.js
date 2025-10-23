const expect = require('chai').expect;

const ChannelDetectorImport = require('../build/index');
const ChannelDetector = ChannelDetectorImport.default;
const Types = ChannelDetectorImport.Types;
const name = 'TS';

function expectStateToHaveId(states, name, id, alternativeId) {
    const control = states.find(s => s.name === name);
    expect(control, `Failed checking ${name}`).to.be.ok;
    if (id !== undefined) {
        expect(control, `Failed checking ${name}`).to.have.property('id');
        if (control.id !== id && control.id !== alternativeId) {
            expect(control.id).to.be.equal(id);
        }
    } else {
        expect(control, `Failed checking ${name}`).to.not.have.property('id');
    }
}

function detect(objectDef, options = {}) {
    const detector = new ChannelDetector();

    if (!options.objects) {
        const objects = typeof objectDef === 'string' ? require(objectDef) : objectDef;
        Object.keys(objects).forEach(id => (objects[id]._id = id));

        options.objects = objects;
    }

    const controls = detector.detect(options);
    if (controls) {
        for (const types of controls) {
            console.log(`Found ${types.type}`);
        }
    }
    return controls;
}

function validate(data, detectedType, detectedFields, ignoreAdditionalDetectedStates = false) {
    expect(data.type).to.be.equal(detectedType);
    const expectMyStateToHaveId = expectStateToHaveId.bind(null, data.states);
    let statesChecked = 0;
    for (const [name, ids] of Object.entries(detectedFields)) {
        let id;
        let altId;
        if (Array.isArray(ids)) {
            id = ids[0];
            altId = ids[1];
        } else {
            id = ids;
        }
        expectMyStateToHaveId(name, id, altId);
        if (id !== undefined) {
            statesChecked++;
        }
    }
    if (!ignoreAdditionalDetectedStates) {
        const allMatchedStates = data.states.filter(({ id }) => !!id).length;
        expect(allMatchedStates).to.be.equal(
            statesChecked,
            `Expected ${statesChecked} states to be matched, but ${allMatchedStates} were found`,
        );
    }
}

describe(`${name} Test Detector`, () => {
    it(`${name} Must detect humidity sensor from channel`, done => {
        const objects = {
            'ham.0.TemperatureAndHumidity': {
                common: {
                    name: 'Current Relative Humidity Channel',
                },
                type: 'channel',
            },
            'ham.0.TemperatureAndHumidity.Current-Relative-Humidity': {
                common: {
                    name: 'Current Relative Humidity',
                    type: 'number',
                    unit: '%',
                    role: 'value.humidity',
                    min: 0,
                    max: 100,
                    read: true,
                    write: false,
                },
                type: 'state',
            },
        };

        const controls = detect(objects, {
            id: 'ham.0.TemperatureAndHumidity',
        });

        validate(controls[0], Types.humidity, {
            ACTUAL: 'ham.0.TemperatureAndHumidity.Current-Relative-Humidity',
        });

        done();
    });

    it('Must detect nothing if not all required states are defined', done => {
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

        const controls = detect(objects, {
            id: 'something.0.channel',
        });

        expect(controls).to.be.null;

        done();
    });

    it('Must detect humidity sensor from state', done => {
        const objects = {
            'ham.0.TemperatureAndHumidity.Current-Relative-Humidity': {
                common: {
                    name: 'Current Relative Humidity',
                    type: 'number',
                    unit: '%',
                    role: 'value.humidity',
                    min: 0,
                    max: 100,
                    read: true,
                    write: false,
                },
                type: 'state',
            },
        };

        const controls = detect(objects, {
            id: 'ham.0.TemperatureAndHumidity.Current-Relative-Humidity',
        });

        validate(controls[0], Types.humidity, {
            ACTUAL: 'ham.0.TemperatureAndHumidity.Current-Relative-Humidity',
        });

        done();
    });

    it('Must detect humidity sensor from state when searching non existent parent', done => {
        const objects = {
            'ham.0.TemperatureAndHumidity.Current-Relative-Humidity': {
                common: {
                    name: 'Current Relative Humidity',
                    type: 'number',
                    unit: '%',
                    role: 'value.humidity',
                    min: 0,
                    max: 100,
                    read: true,
                    write: false,
                },
                type: 'state',
            },
        };

        const controls = detect(objects, {
            id: 'ham.0.TemperatureAndHumidity',
        });

        validate(controls[0], Types.humidity, {
            ACTUAL: 'ham.0.TemperatureAndHumidity.Current-Relative-Humidity',
        });

        done();
    });

    it('Must detect air conditioner sensor from channel', done => {
        const objects = {
            'alias.0.Hauptzimmer.AC': {
                common: {
                    name: {
                        de: 'AC',
                    },
                    role: 'airCondition',
                },
                native: {},
                type: 'channel',
            },
            'alias.0.Hauptzimmer.AC.SET': {
                common: {
                    name: 'SET',
                    role: 'level.temperature',
                    type: 'number',
                    read: true,
                    write: true,
                    alias: {
                        id: 'javascript.0.ac.temperature',
                    },
                    unit: '°C',
                },
                native: {},
                type: 'state',
            },
            'alias.0.Hauptzimmer.AC.MODE': {
                common: {
                    name: 'MODE',
                    role: 'level.mode.airconditioner',
                    type: 'number',
                    read: true,
                    write: true,
                    alias: {
                        id: 'javascript.0.ac.mode',
                    },
                    states: {
                        0: 'OFF',
                        1: 'AUTO',
                        2: 'COOL',
                        3: 'HEAT',
                        4: 'ECO',
                        5: 'FAN_ONLY',
                        6: 'DRY',
                    },
                },
                native: {},
                type: 'state',
            },
            'alias.0.Hauptzimmer.AC.POWER': {
                native: {},
                type: 'state',
                common: {
                    alias: {
                        id: 'javascript.0.ac.power',
                    },
                    name: 'POWER',
                    role: 'switch.power',
                    write: true,
                    type: 'boolean',
                },
            },
        };

        const controls = detect(objects, {
            id: 'alias.0.Hauptzimmer.AC',
            //allowedTypes:       [Types.airCondition], // for tests
        });

        validate(controls[0], Types.airCondition, {
            POWER: 'alias.0.Hauptzimmer.AC.POWER',
            SET: 'alias.0.Hauptzimmer.AC.SET',
            MODE: 'alias.0.Hauptzimmer.AC.MODE',
        });

        done();
    });

    it('Must detect vacuum mihome from states', done => {
        const controls = detect('./mihome-vacuum.0.json', {
            id: 'mihome-vacuum.0',
        });

        validate(controls[0], Types.vacuumCleaner, {
            POWER: 'mihome-vacuum.0.control.clean_home',
            MODE: 'mihome-vacuum.0.control.fan_power',
            MAP_BASE64: 'mihome-vacuum.0.cleanmap.map64',
            MAP_URL: 'mihome-vacuum.0.cleanmap.mapURL',
            BATTERY: 'mihome-vacuum.0.info.battery',
            STATE: 'mihome-vacuum.0.info.state',
            PAUSE: 'mihome-vacuum.0.control.pauseResume',
            FILTER: 'mihome-vacuum.0.consumable.filter',
            BRUSH: 'mihome-vacuum.0.consumable.main_brush',
            SENSORS: 'mihome-vacuum.0.consumable.sensors',
            SIDE_BRUSH: 'mihome-vacuum.0.consumable.side_brush',
        });

        done();
    });

    it('Must detect cameras from states', done => {
        const controls = detect('./cameras.0.cameras.json', {
            id: 'cameras.0.cameras',
        });

        validate(controls[0], Types.camera, {
            URL: 'cameras.0.cameras.cam1',
        });

        done();
    });

    it('Must detect charts from states', done => {
        const objects = {
            'echarts.0.Place.PresetMy': {
                common: {
                    name: 'PresetMy',
                },
                native: {
                    url: '',
                    data: {},
                },
                type: 'chart',
                _id: 'echarts.0.Place.PresetMy',
            },
        };

        const controls = detect(objects, {
            id: 'echarts.0.Place.PresetMy',
        });

        validate(controls[0], Types.chart, {
            CHART: 'echarts.0.Place.PresetMy',
        });

        done();
    });

    it('Must detect fire sensor from states', done => {
        const controls = detect('./fireSensor.json', {
            id: 'alias.0.MyFolder.Gerät_1',
        });

        validate(controls[0], Types.fireAlarm, {
            ACTUAL: 'alias.0.MyFolder.Gerät_1.ACTUAL',
        });

        done();
    });

    it('Must detect forecast from accuweather and assign days correctly', done => {
        const controls = detect('./weather_accuweather.json', {
            id: 'accuweather.0.Summary',
        });

        const detectionDef = {
            ICON: ['accuweather.0.Summary.WeatherIconURL_d1', 'accuweather.0.Summary.WeatherIconURL'],
            TEMP: 'accuweather.0.Summary.Temperature',
            DATE: ['accuweather.0.Summary.DateTime_d1', 'accuweather.0.Summary.Date'],
            FEELS_LIKE: 'accuweather.0.Summary.RealFeelTemperature',
            WIND_SPEED: ['accuweather.0.Summary.WindSpeed_d1', 'accuweather.0.Summary.WindSpeed'],
            WIND_DIRECTION: ['accuweather.0.Summary.WindDirection', 'accuweather.0.Summary.WindDirection_d1'],
            WIND_DIRECTION_STR: ['accuweather.0.Summary.WindDirectionStr', 'accuweather.0.Summary.WindDirectionStr_d1'],
            HUMIDITY: 'accuweather.0.Summary.RelativeHumidity',
            PRESSURE: 'accuweather.0.Summary.Pressure',
            DOW: ['accuweather.0.Summary.DayOfWeek', 'accuweather.0.Summary.DayOfWeek_d1'],
            TEMP_MIN: 'accuweather.0.Summary.TempMin_d1',
            TEMP_MAX: 'accuweather.0.Summary.TempMax_d1',
        };
        const days = [1, 2, 3, 4];
        for (const day of days) {
            detectionDef[`DATE${day}`] = `accuweather.0.Summary.DateTime_d${day + 1}`;
            detectionDef[`ICON${day}`] = `accuweather.0.Summary.WeatherIconURL_d${day + 1}`;
            detectionDef[`STATE${day}`] = `accuweather.0.Summary.WeatherText_d${day + 1}`;
            detectionDef[`TEMP_MIN${day}`] = `accuweather.0.Summary.TempMin_d${day + 1}`;
            detectionDef[`TEMP_MAX${day}`] = `accuweather.0.Summary.TempMax_d${day + 1}`;
            detectionDef[`WIND_SPEED${day}`] = `accuweather.0.Summary.WindSpeed_d${day + 1}`;
            detectionDef[`WIND_DIRECTION${day}`] = `accuweather.0.Summary.WindDirection_d${day + 1}`;
            detectionDef[`WIND_DIRECTION_STR${day}`] = `accuweather.0.Summary.WindDirectionStr_d${day + 1}`;
            detectionDef[`DOW${day}`] = `accuweather.0.Summary.DayOfWeek_d${day + 1}`;
            detectionDef[`PRECIPITATION_CHANCE${day}`] = `accuweather.0.Summary.PrecipitationProbability_d${day + 1}`;
            detectionDef[`PRECIPITATION${day}`] = `accuweather.0.Summary.TotalLiquidVolume_d${day + 1}`;
        }

        validate(controls[0], Types.weatherForecast, detectionDef, true);

        done();
    });

    it('Must detect forecast from dasWetter and assign days correctly', done => {
        const controls = detect('./weather_daswetter.json', {
            id: 'daswetter.0.NextDays.Location_1',
        });

        const detectionDef = {
            ICON: 'daswetter.0.NextDays.Location_1.Day_1.iconURL',
            TEMP_MIN: 'daswetter.0.NextDays.Location_1.Day_1.Minimale_Temperatur_value',
            TEMP_MAX: 'daswetter.0.NextDays.Location_1.Day_1.Maximale_Temperatur_value',
        };
        const days = [1, 2, 3, 4, 5, 6];
        for (const day of days) {
            detectionDef[`ICON${day}`] = `daswetter.0.NextDays.Location_1.Day_${day + 1}.iconURL`;
            detectionDef[`TEMP_MIN${day}`] = `daswetter.0.NextDays.Location_1.Day_${day + 1}.Minimale_Temperatur_value`;
            detectionDef[`TEMP_MAX${day}`] = `daswetter.0.NextDays.Location_1.Day_${day + 1}.Maximale_Temperatur_value`;
            detectionDef[`DOW${day}`] = `daswetter.0.NextDays.Location_1.Day_${day + 1}.Tag_value`;
        }

        validate(controls[0], Types.weatherForecast, detectionDef, true);

        done();
    });

    it('Must detect forecast from weatherunderground and assign days correctly', done => {
        const controls = detect('./weather_weatherunderground.json', {
            id: 'weatherunderground.0.forecast',
        });

        const detectionDef = {
            ICON: 'weatherunderground.0.forecast.0d.iconURL',
            TEMP: 'weatherunderground.0.forecast.current.temp',
            TEMP_MIN: 'weatherunderground.0.forecast.0d.tempMin',
            TEMP_MAX: 'weatherunderground.0.forecast.0d.tempMax',
            PRECIPITATION_CHANCE: 'weatherunderground.0.forecast.0d.precipitationChance',
            DATE: 'weatherunderground.0.forecast.0d.date',
            STATE: 'weatherunderground.0.forecast.0d.state',
            PRESSURE: 'weatherunderground.0.forecast.current.pressure',
            HUMIDITY: 'weatherunderground.0.forecast.0d.humidity',
            WIND_CHILL: 'weatherunderground.0.forecast.current.windChill',
        };
        const days = [1, 2, 3];
        for (const day of days) {
            detectionDef[`ICON${day}`] = `weatherunderground.0.forecast.${day}d.iconURL`;
            detectionDef[`TEMP_MIN${day}`] = `weatherunderground.0.forecast.${day}d.tempMin`;
            detectionDef[`TEMP_MAX${day}`] = `weatherunderground.0.forecast.${day}d.tempMax`;
            detectionDef[`DATE${day}`] = `weatherunderground.0.forecast.${day}d.date`;
        }

        validate(controls[0], Types.weatherForecast, detectionDef, true);

        done();
    });

    it('Must detect blinds correctly', done => {
        const controls = detect('./blinds.json', {
            id: 'hm-rpc.1.00AAABBBA74CCC.4',
        });

        validate(controls[0], Types.blind, {
            SET: 'hm-rpc.1.00AAABBBA74CCC.4.LEVEL',
            STOP: 'hm-rpc.1.00AAABBBA74CCC.4.STOP',
            UNREACH: 'hm-rpc.1.00AAABBBA74CCC.0.UNREACH',
        });

        done();
    });

    it(`${name} Must detect light correctly`, done => {
        const controls = detect('./light.json', {
            id: 'alias.0.Schlafzimmer.Licht.SET',
        });

        validate(controls[0], Types.light, {
            SET: 'alias.0.Schlafzimmer.Licht.SET',
        });

        done();
    });

    it(`${name} Must detect light correctly with allowedTypes`, done => {
        const controls = detect('./huergb.json', {
            id: 'hue.0.Büro',
            allowedTypes: [Types.dimmer],
        });

        validate(controls[0], Types.dimmer, {
            ON_SET: 'hue.0.Büro.on',
            SET: 'hue.0.Büro.level',
        });

        done();
    });

    it(`${name} Must detect multiple types`, done => {
        const controls = detect('./multi-detect.json', {
            id: 'hm-rpc.0.001658A99FD264.2',
            ignoreEnums: true,
            detectAllPossibleDevices: true,
        });

        validate(controls[0], Types.blind, {
            SET: 'hm-rpc.0.001658A99FD264.2.LEVEL',
            STOP: 'hm-rpc.0.001658A99FD264.2.STOP',
        });
        expect(controls[0].states.filter(({ id }) => !!id).length).to.be.equal(2);

        validate(controls[1], Types.dimmer, {
            SET: 'hm-rpc.0.001658A99FD264.2.LEVEL',
        });
        expect(controls[1].states.filter(({ id }) => !!id).length).to.be.equal(1);

        validate(controls[2], Types.slider, {
            SET: 'hm-rpc.0.001658A99FD264.2.LEVEL',
        });
        expect(controls[2].states.filter(({ id }) => !!id).length).to.be.equal(1);

        validate(controls[3], Types.button, {
            SET: 'hm-rpc.0.001658A99FD264.2.STOP',
        });
        expect(controls[3].states.filter(({ id }) => !!id).length).to.be.equal(1);

        done();
    });

    it(`${name} Must detect rgb correctly`, done => {
        const controls = detect('./huergb.json', {
            id: 'hue.0.Büro',
        });

        validate(controls[0], Types.rgb, {
            ON: 'hue.0.Büro.on',
            DIMMER: 'hue.0.Büro.level',
            RED: 'hue.0.Büro.r',
            GREEN: 'hue.0.Büro.g',
            BLUE: 'hue.0.Büro.b',
            TEMPERATURE: 'hue.0.Büro.ct',
        });

        done();
    });

    it(`${name} Must detect lock correctly`, done => {
        const controls = detect('./lock.json', {
            id: 'hm-rpc.0.LEQ090XYZ.1',
        });

        validate(controls[0], Types.lock, {
            SET: 'hm-rpc.0.LEQ090XYZ.1.STATE',
            OPEN: 'hm-rpc.0.LEQ090XYZ.1.OPEN',
            DOOR_STATE: 'hm-rpc.0.LEQ090XYZ.1.DOOR_STATE',
            DIRECTION: 'hm-rpc.0.LEQ090XYZ.1.DIRECTION',
            ERROR: 'hm-rpc.0.LEQ090XYZ.1.ERROR',
        });

        done();
    });

    it(`${name} Must detect thermostat correctly when device is used`, done => {
        const controls = detect('./hm-thermostat.json', {
            id: 'hm-rpc.1.JEQ0XXXXXX',
        });

        validate(controls[0], Types.thermostat, {
            SET: 'hm-rpc.1.JEQ0XXXXXX.2.SETPOINT',
            ACTUAL: 'hm-rpc.1.JEQ0XXXXXX.1.TEMPERATURE',
            HUMIDITY: 'hm-rpc.1.JEQ0XXXXXX.1.HUMIDITY',
            POWER: 'hm-rpc.1.JEQ0XXXXXX.2.STATE',
            UNREACH: 'hm-rpc.1.JEQ0XXXXXX.0.UNREACH',
            LOWBAT: 'hm-rpc.1.JEQ0XXXXXX.0.LOWBAT',
        });

        done();
    });

    it(`${name} Must detect sub channels directly when executed by channel`, done => {
        const options = {
            id: 'hm-rpc.1.JEQ0XXXXXX.1',
        };

        const controls = detect('./hm-thermostat.json', options);

        validate(controls[0], Types.temperature, {
            ACTUAL: 'hm-rpc.1.JEQ0XXXXXX.1.TEMPERATURE',
            SECOND: 'hm-rpc.1.JEQ0XXXXXX.1.HUMIDITY',
            UNREACH: 'hm-rpc.1.JEQ0XXXXXX.0.STICKY_UNREACH',
            LOWBAT: 'hm-rpc.1.JEQ0XXXXXX.0.LOWBAT',
        });

        options.id = 'hm-rpc.1.JEQ0XXXXXX.2';

        const controls2 = detect('./hm-thermostat.json', options);

        validate(controls2[0], Types.thermostat, {
            SET: 'hm-rpc.1.JEQ0XXXXXX.2.SETPOINT',
            ACTUAL: 'hm-rpc.1.JEQ0XXXXXX.1.TEMPERATURE',
            HUMIDITY: 'hm-rpc.1.JEQ0XXXXXX.1.HUMIDITY',
            POWER: 'hm-rpc.1.JEQ0XXXXXX.2.STATE',
            UNREACH: 'hm-rpc.1.JEQ0XXXXXX.0.STICKY_UNREACH',
            LOWBAT: 'hm-rpc.1.JEQ0XXXXXX.0.LOWBAT',
        });

        done();
    });

    it(`${name} Must detect one device only also when starting on channel when using checkParent option`, done => {
        const options = {
            id: 'hm-rpc.1.JEQ0XXXXXX.1',
            detectParent: true,
        };

        const controls = detect('./hm-thermostat.json', options);

        validate(controls[0], Types.thermostat, {
            SET: 'hm-rpc.1.JEQ0XXXXXX.2.SETPOINT',
            ACTUAL: 'hm-rpc.1.JEQ0XXXXXX.1.TEMPERATURE',
            HUMIDITY: 'hm-rpc.1.JEQ0XXXXXX.1.HUMIDITY',
            POWER: 'hm-rpc.1.JEQ0XXXXXX.2.STATE',
            UNREACH: 'hm-rpc.1.JEQ0XXXXXX.0.UNREACH',
            LOWBAT: 'hm-rpc.1.JEQ0XXXXXX.0.LOWBAT',
        });

        options.id = 'hm-rpc.1.JEQ0XXXXXX.2';

        const controls2 = detect('./hm-thermostat.json', options);
        expect(controls2).to.be.null;

        options.id = 'hm-rpc.1.JEQ0XXXXXX';

        const controls3 = detect('./hm-thermostat.json', options);
        expect(controls3).to.be.null;

        done();
    });

    it(`${name} Must detect one device only still when starting on channel when using checkParent option`, done => {
        const controls = detect('./hm-thermostat.json', {
            id: 'hm-rpc.1.JEQ0XXXXXX',
            detectParent: true,
        });

        validate(
            controls[0],
            Types.thermostat,
            {
                SET: 'hm-rpc.1.JEQ0XXXXXX.2.SETPOINT',
                ACTUAL: 'hm-rpc.1.JEQ0XXXXXX.1.TEMPERATURE',
                HUMIDITY: 'hm-rpc.1.JEQ0XXXXXX.1.HUMIDITY',
            },
            true,
        );

        done();
    });

    it(`${name} Must detect rgb light correctly when device is used with normal prioritization`, done => {
        const controls = detect('./zigbee.0.AAAAAAA.json', {
            id: 'zigbee.0.AAAAAAA',
        });

        validate(controls[0], Types.rgb, {
            RED: 'zigbee.0.AAAAAAA.color_rgb.r',
            GREEN: 'zigbee.0.AAAAAAA.color_rgb.g',
            BLUE: 'zigbee.0.AAAAAAA.color_rgb.b',
            DIMMER: 'zigbee.0.AAAAAAA.brightness',
            TEMPERATURE: 'zigbee.0.AAAAAAA.colortemp',
            ON: 'zigbee.0.AAAAAAA.state',
        });

        done();
    });

    it(`${name} Must detect rgb light correctly when state in device is and device detected with normal prioritization`, done => {
        const controls = detect('./zigbee.0.AAAAAAA.json', {
            id: 'zigbee.0.AAAAAAA',
            detectParent: true,
        });

        validate(controls[0], Types.rgb, {
            RED: 'zigbee.0.AAAAAAA.color_rgb.r',
            GREEN: 'zigbee.0.AAAAAAA.color_rgb.g',
            BLUE: 'zigbee.0.AAAAAAA.color_rgb.b',
            DIMMER: 'zigbee.0.AAAAAAA.brightness',
            TEMPERATURE: 'zigbee.0.AAAAAAA.colortemp',
            ON: 'zigbee.0.AAAAAAA.state',
        });

        done();
    });

    it(`${name} Must detect rgb light correctly when state in channel is used`, done => {
        const controls = detect('./zigbee.0.AAAAAAA.json', {
            id: 'zigbee.0.AAAAAAA.color_rgb',
        });

        validate(controls[0], Types.rgb, {
            RED: 'zigbee.0.AAAAAAA.color_rgb.r',
            GREEN: 'zigbee.0.AAAAAAA.color_rgb.g',
            BLUE: 'zigbee.0.AAAAAAA.color_rgb.b',
            DIMMER: undefined,
            TEMPERATURE: undefined,
            ON: undefined,
        });

        done();
    });

    it(`${name} Must detect rgb light correctly when state in channel below device is and device detected with normal prioritization`, done => {
        const controls = detect('./zigbee.0.AAAAAAA.json', {
            id: 'zigbee.0.AAAAAAA.color_rgb.r',
            detectParent: true,
        });

        validate(controls[0], Types.rgb, {
            RED: 'zigbee.0.AAAAAAA.color_rgb.r',
            GREEN: 'zigbee.0.AAAAAAA.color_rgb.g',
            BLUE: 'zigbee.0.AAAAAAA.color_rgb.b',
            DIMMER: 'zigbee.0.AAAAAAA.brightness',
            TEMPERATURE: 'zigbee.0.AAAAAAA.colortemp',
            ON: 'zigbee.0.AAAAAAA.state',
        });

        done();
    });

    it(`${name} Must detect hue light correctly when device is used with adjusted prioritization`, done => {
        const controls = detect('./zigbee.0.AAAAAAA.json', {
            id: 'zigbee.0.AAAAAAA',
            prioritizedTypes: [[Types.hue, Types.rgb]],
        });

        validate(controls[0], Types.hue, {
            HUE: 'zigbee.0.AAAAAAA.color_hs.hue',
            SATURATION: 'zigbee.0.AAAAAAA.color_hs.saturation',
            DIMMER: 'zigbee.0.AAAAAAA.brightness',
            TEMPERATURE: 'zigbee.0.AAAAAAA.colortemp',
            ON: 'zigbee.0.AAAAAAA.state',
        });

        // We still secondary detect other types, but only the minimal states
        validate(controls[1], Types.rgb, {
            RED: 'zigbee.0.AAAAAAA.color_rgb.r',
            GREEN: 'zigbee.0.AAAAAAA.color_rgb.g',
            BLUE: 'zigbee.0.AAAAAAA.color_rgb.b',
        });

        // We still secondary detect other types, but only the minimal states
        validate(controls[2], Types.rgbSingle, {
            RGB: 'zigbee.0.AAAAAAA.color',
        });

        done();
    });

    it(`${name} Must detect hue light only when device is used with adjusted prioritization and limitation`, done => {
        const controls = detect('./zigbee.0.AAAAAAA.json', {
            id: 'zigbee.0.AAAAAAA',
            prioritizedTypes: [[Types.hue, Types.rgb]],
            limitTypesToOneOf: [[Types.rgb, Types.rgbSingle, Types.rgbwSingle, Types.hue]]
        });

        validate(controls[0], Types.hue, {
            HUE: 'zigbee.0.AAAAAAA.color_hs.hue',
            SATURATION: 'zigbee.0.AAAAAAA.color_hs.saturation',
            DIMMER: 'zigbee.0.AAAAAAA.brightness',
            TEMPERATURE: 'zigbee.0.AAAAAAA.colortemp',
            ON: 'zigbee.0.AAAAAAA.state',
        });

        expect(controls[1].type === Types.rgb).to.be.false;
        expect(controls[2].type === Types.rgbSingle).to.be.false;

        done();
    });

    it('Must detect the window state with the role with more sublevels also when alphabetically comes first', done => {
        const objects = {
            'test.0.window': {
                common: {
                    name: 'window',
                },
                type: 'device',
            },
            'test.0.window.x-contact': {
                common: {
                    name: 'contact',
                    type: 'boolean',
                    role: 'state',
                    read: true,
                    write: false,
                },
                type: 'state',
            },
            'test.0.window.a-opened': {
                common: {
                    name: 'opened',
                    type: 'boolean',
                    role: 'sensor.window',
                    read: true,
                    write: false,
                },
                type: 'state',
            },
        };

        const controls = detect(objects, {
            id: 'test.0.window',
            ignoreEnums: true
        });

        validate(controls[0], Types.window, {
            ACTUAL: 'test.0.window.a-opened',
        });

        done();
    });

    it('Must detect the window state with the role without overwriting with more sublevels also when alphabetically comes last', done => {
        const objects = {
            'test.0.window': {
                common: {
                    name: 'window',
                },
                type: 'device',
            },
            'test.0.window.a-opened': {
                common: {
                    name: 'opened',
                    type: 'boolean',
                    role: 'sensor.window',
                    read: true,
                    write: false,
                },
                type: 'state',
            },
            'test.0.window.x-contact': {
                common: {
                    name: 'contact',
                    type: 'boolean',
                    role: 'state',
                    read: true,
                    write: false,
                },
                type: 'state',
            },
        };

        const controls = detect(objects, {
            id: 'test.0.window',
            ignoreEnums: true
        });

        validate(controls[0], Types.window, {
            ACTUAL: 'test.0.window.a-opened',
        });

        done();
    });

    it('Must detect the window state with the role other than state also when alphabetically comes first', done => {
        const objects = {
            'test.0.window': {
                common: {
                    name: 'window',
                },
                type: 'device',
            },
            'test.0.window.x-contact': {
                common: {
                    name: 'contact',
                    type: 'boolean',
                    role: 'sensor',
                    read: true,
                    write: false,
                },
                type: 'state',
            },
            'test.0.window.a-opened': {
                common: {
                    name: 'opened',
                    type: 'boolean',
                    role: 'state',
                    read: true,
                    write: false,
                },
                type: 'state',
            },
        };

        const controls = detect(objects, {
            id: 'test.0.window',
            ignoreEnums: true
        });

        validate(controls[0], Types.window, {
            ACTUAL: 'test.0.window.x-contact',
        });

        done();
    });

    it('Must detect the window state with last entry when same role', done => {
        const objects = {
            'test.0.window': {
                common: {
                    name: 'window',
                },
                type: 'device',
            },
            'test.0.window.a-opened': {
                common: {
                    name: 'opened',
                    type: 'boolean',
                    role: 'sensor',
                    read: true,
                    write: false,
                },
                type: 'state',
            },
            'test.0.window.x-contact': {
                common: {
                    name: 'contact',
                    type: 'boolean',
                    role: 'sensor',
                    read: true,
                    write: false,
                },
                type: 'state',
            },
        };

        const controls = detect(objects, {
            id: 'test.0.window',
            ignoreEnums: true
        });

        validate(controls[0], Types.window, {
            ACTUAL: 'test.0.window.x-contact',
        });

        done();
    });

    it('Must detect the favored state even with role not matching', done => {
        const objects = {
            'test.0.window': {
                common: {
                    name: 'window',
                },
                type: 'device',
            },
            'test.0.window.x-contact': {
                common: {
                    name: 'contact',
                    type: 'boolean',
                    role: 'state',
                    read: true,
                    write: false,
                },
                type: 'state',
            },
            'test.0.window.a-opened': {
                common: {
                    name: 'opened',
                    type: 'boolean',
                    role: 'sensor.window',
                    read: true,
                    write: false,
                },
                type: 'state',
            },
        };

        const controls = detect(objects, {
            id: 'test.0.window.x-contact',
            ignoreEnums: true
        });

        validate(controls[0], Types.window, {
            ACTUAL: 'test.0.window.x-contact',
        });

        done();
    });

    it('Must ignore favored ID when detecting via parent', done => {
        const objects = {
            'test.0.window': {
                common: {
                    name: 'window',
                },
                type: 'device',
            },
            'test.0.window.x-contact': {
                common: {
                    name: 'contact',
                    type: 'boolean',
                    role: 'state',
                    read: true,
                    write: false,
                },
                type: 'state',
            },
            'test.0.window.a-opened': {
                common: {
                    name: 'opened',
                    type: 'boolean',
                    role: 'sensor.window',
                    read: true,
                    write: false,
                },
                type: 'state',
            },
        };

        const controls = detect(objects, {
            id: 'test.0.window.x-contact',
            detectParent: true,
            ignoreEnums: true
        });

        validate(controls[0], Types.window, {
            ACTUAL: 'test.0.window.a-opened',
        });

        done();
    });

    it('Must detect dimmer with power switch', done => {
        const objects = require('./dimmer.json');

        const controls = detect(objects, {
            id: 'alias.0.Test-Devices.Dimmer.SET',
            ignoreEnums: true,
            detectParent: true
        });
        const states = controls[0].states.filter(s => !!s.id);
        expect(states.length).to.be.equal(8, 'Should detect 8 states for dimmer with power switch');

        validate(controls[0], Types.dimmer, {
            SET: 'alias.0.Test-Devices.Dimmer.SET',
            ON_SET: 'alias.0.Test-Devices.Dimmer.ON_SET',
            ACTUAL: 'alias.0.Test-Devices.Dimmer.ACTUAL',
            WORKING: 'alias.0.Test-Devices.Dimmer.WORKING',
            UNREACH: 'alias.0.Test-Devices.Dimmer.UNREACH',
            LOWBAT: 'alias.0.Test-Devices.Dimmer.LOWBAT',
            MAINTAIN: 'alias.0.Test-Devices.Dimmer.MAINTAIN',
            ERROR: 'alias.0.Test-Devices.Dimmer.ERROR',
        });

        done();
    });

    it('Must detect RGB color with power switch', done => {
        const objects = require('./nanoleaf-lightpanels.3.json');

        const controls = detect(objects, {
            id: 'nanoleaf-lightpanels.3.Shapes.colorRGB',
            ignoreEnums: true,
            detectParent: true
        });
        const states = controls[0].states.filter(s => !!s.id);
        expect(states.length).to.be.equal(4, 'Should detect 4 states for dimmer with power switch');

        validate(controls[0], Types.rgbSingle, {
            RGB: 'nanoleaf-lightpanels.3.Shapes.colorRGB',
            DIMMER: 'nanoleaf-lightpanels.3.Shapes.brightness',
            TEMPERATURE: 'nanoleaf-lightpanels.3.Shapes.colorTemp',
            ON: 'nanoleaf-lightpanels.3.Shapes.state',
        });

        done();
    });

    it('Must detect Blinds from just one state', done => {
        const objects = require('./simpleBlind.json');

        const controls = detect(objects, {
            id: 'mqtt.0.vantage.obergeschoss.buro.blind.rollos.percent',
            ignoreEnums: true,
            detectParent: true
        });
        const states = controls[0].states.filter(s => !!s.id);
        expect(states.length).to.be.equal(1, 'Should detect 1 state for dimmer with power switch');

        validate(controls[0], Types.blind, {
            SET: 'mqtt.0.vantage.obergeschoss.buro.blind.rollos.percent',
        });

        done();
    });

    it('Must detect Dimmer from Homematic', done => {
        const objects = require('./hm-rpc.dimmer.json');

        const controls = detect(objects, {
            id: 'hm-rpc.1.00123456789077.2.LEVEL',
            ignoreEnums: true,
            //detectParent: true
        });
        const states = controls[0].states.filter(s => !!s.id);
        expect(states.length).to.be.equal(2, 'Should detect 2 states for dimmer with voltage and unreach');

        validate(controls[0], Types.dimmer, {
            SET: 'hm-rpc.1.00123456789077.2.LEVEL',
            UNREACH: 'hm-rpc.1.00123456789077.0.UNREACH',
        });

        done();
    });

    it('Must detect HUE from hue adapter', done => {
        const objects = require('./hue-combined.json');

        const controls = detect(objects, {
            id: 'hue.0.Hue_Küche_Küchezeile.hue',
            ignoreEnums: true,
            detectOnlyChannel: true,
            prioritizedTypes: [[Types.hue, Types.rgb]],
        });
        const states = controls[0].states.filter(s => !!s.id);
        expect(states.length).to.be.equal(5, 'Should detect 5 states: hue, dimmer, saturation, temperature, on');

        validate(controls[0], Types.hue, {
            HUE: 'hue.0.Hue_Küche_Küchezeile.hue',
            DIMMER: 'hue.0.Hue_Küche_Küchezeile.level',
            SATURATION: 'hue.0.Hue_Küche_Küchezeile.sat',
            TEMPERATURE: 'hue.0.Hue_Küche_Küchezeile.ct',
            ON: 'hue.0.Hue_Küche_Küchezeile.on',
        });

        done();
    });

    it.only('Must detect Shelly Dimmer as dimmer', done => {
        const objects = require('./shelly-dimmer.json');

        const controls = detect(objects, {
            id: 'shelly.0.SHDM-2#081234567896#1.lights.brightness',
            ignoreEnums: true,
            detectOnlyChannel: true,
            detectAllPossibleDevices: true,
        });
        const states = controls[0].states.filter(s => !!s.id);
        expect(states.length).to.be.equal(4, 'Should detect 5 states: hue, dimmer, saturation, temperature, on');

        validate(controls[0], Types.dimmer, {
            SET: 'shelly.0.SHDM-2#081234567896#1.lights.brightness',
            ON_SET: 'shelly.0.SHDM-2#081234567896#1.lights.Switch',
            ELECTRIC_POWER: 'shelly.0.SHDM-2#081234567896#1.lights.Power',
            CONSUMPTION: 'shelly.0.SHDM-2#081234567896#1.lights.Energy',
        });

        done();
    });
});
