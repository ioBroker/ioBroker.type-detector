const ChannelDetectorImport = require('../build/index');
const ChannelDetector = ChannelDetectorImport.default;
const Types = ChannelDetectorImport.Types;
const name = 'TS';

function expect(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

function expectStateToHaveId(states, name, id, alternativeId) {
    const control = states.find(s => s.name === name);
    expect(!!control, `Failed checking ${name}`);
    if (id !== undefined) {
        expect(Object.prototype.hasOwnProperty.call(control, 'id'), `Failed checking ${name}`);
        if (control.id !== id && control.id !== alternativeId) {
            expect(control.id === 'id', 'unexpected ID'); // will always fail
        }
    } else {
        expect(!Object.prototype.hasOwnProperty.call(control, 'id'), `Failed checking ${name}`);
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
    expect(data.type === detectedType, `Expected type ${detectedType} but found ${data.type}`);
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
        expect(
            allMatchedStates === statesChecked,
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

    it(`${name} Must detect tank level (percent) from channel`, done => {
        const objects = {
            'cistern.0.Tank': {
                common: {
                    name: 'Rain water cistern',
                },
                type: 'channel',
            },
            'cistern.0.Tank.Level': {
                common: {
                    name: 'Fill level',
                    type: 'number',
                    unit: '%',
                    role: 'value.fill',
                    min: 0,
                    max: 100,
                    read: true,
                    write: false,
                },
                type: 'state',
            },
        };

        const controls = detect(objects, {
            id: 'cistern.0.Tank',
        });

        validate(controls[0], Types.fillLevel, {
            ACTUAL: 'cistern.0.Tank.Level',
        });

        done();
    });

    it(`${name} Must detect air quality sensor with concentrations and levels`, done => {
        const numberState = (name, role, unit) => ({
            common: { name, type: 'number', unit, role, read: true, write: false },
            type: 'state',
        });
        const objects = {
            'matter.0.AirQuality': {
                common: { name: 'IKEA ALPSTUGA' },
                type: 'device',
            },
            'matter.0.AirQuality.airQuality': numberState('Air quality index', 'value.airquality'),
            'matter.0.AirQuality.co2': numberState('CO2', 'value.co2', 'ppm'),
            'matter.0.AirQuality.co2Level': numberState('CO2 level', 'value.co2.level'),
            'matter.0.AirQuality.pm25': numberState('PM2.5', 'value.pm25', 'µg/m³'),
            'matter.0.AirQuality.pm25Level': numberState('PM2.5 level', 'value.pm25.level'),
            'matter.0.AirQuality.tvoc': numberState('TVOC', 'value.tvoc', 'ppb'),
            'matter.0.AirQuality.pressure': numberState('Pressure', 'value.pressure', 'hPa'),
            'matter.0.AirQuality.temperature': numberState('Temperature', 'value.temperature', '°C'),
            'matter.0.AirQuality.humidity': numberState('Humidity', 'value.humidity', '%'),
            'matter.0.AirQuality.power': {
                common: { name: 'Power', type: 'boolean', role: 'switch.power', read: true, write: true },
                type: 'state',
            },
            'matter.0.AirQuality.battery': numberState('Battery', 'value.battery', '%'),
        };

        const controls = detect(objects, {
            id: 'matter.0.AirQuality',
        });

        validate(controls[0], Types.airQuality, {
            AQI: 'matter.0.AirQuality.airQuality',
            CO2: 'matter.0.AirQuality.co2',
            CO2_LEVEL: 'matter.0.AirQuality.co2Level',
            PM25: 'matter.0.AirQuality.pm25',
            PM25_LEVEL: 'matter.0.AirQuality.pm25Level',
            TVOC: 'matter.0.AirQuality.tvoc',
            PRESSURE: 'matter.0.AirQuality.pressure',
            ACTUAL: 'matter.0.AirQuality.temperature',
            HUMIDITY: 'matter.0.AirQuality.humidity',
            POWER: 'matter.0.AirQuality.power',
            BATTERY: 'matter.0.AirQuality.battery',
        });

        done();
    });

    it(`${name} Must detect air quality sensor when the clusters are separate channels`, done => {
        const numberState = (name, role, unit) => ({
            common: { name, type: 'number', unit, role, read: true, write: false },
            type: 'state',
        });
        const objects = {
            'matter.0.Endpoint1': { common: { name: 'Air quality sensor' }, type: 'device' },
            'matter.0.Endpoint1.airQuality': { common: { name: 'Air quality cluster' }, type: 'channel' },
            'matter.0.Endpoint1.airQuality.airQuality': numberState('Air quality index', 'value.airquality'),
            'matter.0.Endpoint1.co2': { common: { name: 'CO2 cluster' }, type: 'channel' },
            'matter.0.Endpoint1.co2.measuredValue': numberState('CO2', 'value.co2', 'ppm'),
            'matter.0.Endpoint1.co2.levelValue': numberState('CO2 level', 'value.co2.level'),
            'matter.0.Endpoint1.temperature': { common: { name: 'Temperature cluster' }, type: 'channel' },
            'matter.0.Endpoint1.temperature.measuredValue': numberState('Temperature', 'value.temperature', '°C'),
        };

        const controls = detect(objects, {
            id: 'matter.0.Endpoint1.airQuality',
        });

        validate(controls[0], Types.airQuality, {
            AQI: 'matter.0.Endpoint1.airQuality.airQuality',
            CO2: 'matter.0.Endpoint1.co2.measuredValue',
            CO2_LEVEL: 'matter.0.Endpoint1.co2.levelValue',
            ACTUAL: 'matter.0.Endpoint1.temperature.measuredValue',
        });

        done();
    });

    it(`${name} Must detect air quality sensor from the index state alone`, done => {
        const objects = {
            'matter.0.AirSensor.airQuality': {
                common: {
                    name: 'Air quality index',
                    type: 'number',
                    role: 'value.airquality',
                    read: true,
                    write: false,
                },
                type: 'state',
            },
        };

        const controls = detect(objects, {
            id: 'matter.0.AirSensor.airQuality',
        });

        validate(controls[0], Types.airQuality, {
            AQI: 'matter.0.AirSensor.airQuality',
        });

        done();
    });

    it(`${name} Must detect tank level (liters) from state`, done => {
        const objects = {
            'cistern.0.Tank.Volume': {
                common: {
                    name: 'Fill level',
                    type: 'number',
                    unit: 'l',
                    role: 'value.fill.tank',
                    min: 0,
                    max: 5000,
                    read: true,
                    write: false,
                },
                type: 'state',
            },
        };

        const controls = detect(objects, {
            id: 'cistern.0.Tank.Volume',
        });

        validate(controls[0], Types.fillLevel, {
            ACTUAL: 'cistern.0.Tank.Volume',
        });

        done();
    });

    it(`${name} Must detect a slider that can also be switched off`, done => {
        const objects = {
            'test.0.Motor': { common: { name: 'Motor' }, type: 'device' },
            'test.0.Motor.speed': {
                common: {
                    name: 'Speed',
                    type: 'number',
                    role: 'level.speed.motor',
                    min: 0,
                    max: 100,
                    read: true,
                    write: true,
                },
                type: 'state',
            },
            'test.0.Motor.on': {
                common: { name: 'On', type: 'boolean', role: 'switch', read: true, write: true },
                type: 'state',
            },
            'test.0.Motor.running': {
                common: { name: 'Running', type: 'boolean', role: 'sensor.switch', read: true, write: false },
                type: 'state',
            },
        };

        const controls = detect(objects, { id: 'test.0.Motor' });

        // The on/off belongs to the slider, it must not become a separate socket
        expect(controls.length === 1, `Expected a single control but found ${controls.length}`);
        validate(controls[0], Types.slider, {
            SET: 'test.0.Motor.speed',
            ON: 'test.0.Motor.on',
            ON_ACTUAL: 'test.0.Motor.running',
        });

        done();
    });

    it(`${name} Must still detect a plain socket`, done => {
        const objects = {
            'test.0.Plug2': { common: { name: 'Plug' }, type: 'device' },
            'test.0.Plug2.on': {
                common: { name: 'On', type: 'boolean', role: 'switch.active', read: true, write: true },
                type: 'state',
            },
            'test.0.Plug2.actual': {
                common: { name: 'Actual', type: 'boolean', role: 'sensor.switch', read: true, write: false },
                type: 'state',
            },
        };

        const controls = detect(objects, { id: 'test.0.Plug2' });

        validate(controls[0], Types.socket, {
            SET: 'test.0.Plug2.on',
            ACTUAL: 'test.0.Plug2.actual',
        });

        done();
    });

    it(`${name} Must detect a generic contact sensor`, done => {
        const objects = {
            'matter.0.Contact': { common: { name: 'Contact sensor' }, type: 'device' },
            'matter.0.Contact.state': {
                common: { name: 'Contact', type: 'boolean', role: 'sensor.contact', read: true, write: false },
                type: 'state',
            },
            'matter.0.Contact.battery': {
                common: { name: 'Battery', type: 'number', role: 'value.battery', unit: '%', read: true, write: false },
                type: 'state',
            },
        };

        const controls = detect(objects, { id: 'matter.0.Contact' });

        validate(controls[0], Types.contact, {
            ACTUAL: 'matter.0.Contact.state',
            BATTERY: 'matter.0.Contact.battery',
        });

        done();
    });

    it(`${name} Must keep window and door sensors out of the contact type`, done => {
        const sensor = role => ({
            'test.0.Sensor': { common: { name: 'Sensor' }, type: 'device' },
            'test.0.Sensor.state': {
                common: { name: 'State', type: 'boolean', role, read: true, write: false },
                type: 'state',
            },
        });

        validate(detect(sensor('sensor.window'), { id: 'test.0.Sensor' })[0], Types.window, {
            ACTUAL: 'test.0.Sensor.state',
        });
        validate(detect(sensor('sensor.door'), { id: 'test.0.Sensor' })[0], Types.door, {
            ACTUAL: 'test.0.Sensor.state',
        });

        done();
    });

    it(`${name} Must detect pressure sensor`, done => {
        const objects = {
            'matter.0.Baro': { common: { name: 'Barometer' }, type: 'device' },
            'matter.0.Baro.pressure': {
                common: {
                    name: 'Pressure',
                    type: 'number',
                    role: 'value.pressure',
                    unit: 'mbar',
                    read: true,
                    write: false,
                },
                type: 'state',
            },
            'matter.0.Baro.battery': {
                common: { name: 'Battery', type: 'number', role: 'value.battery', unit: '%', read: true, write: false },
                type: 'state',
            },
        };

        const controls = detect(objects, { id: 'matter.0.Baro' });

        validate(controls[0], Types.pressure, {
            PRESSURE: 'matter.0.Baro.pressure',
            BATTERY: 'matter.0.Baro.battery',
        });

        done();
    });

    it(`${name} Must detect flow sensor`, done => {
        const objects = {
            'matter.0.Flow': { common: { name: 'Flow sensor' }, type: 'device' },
            'matter.0.Flow.flow': {
                common: { name: 'Flow', type: 'number', role: 'value.flow', unit: 'm³/h', read: true, write: false },
                type: 'state',
            },
        };

        const controls = detect(objects, { id: 'matter.0.Flow' });

        validate(controls[0], Types.flow, {
            FLOW: 'matter.0.Flow.flow',
        });

        done();
    });

    it(`${name} Must keep the pressure of a weather station with the weather station`, done => {
        const objects = {
            'weather.0.Current': { common: { name: 'Current weather' }, type: 'device' },
            'weather.0.Current.temp': {
                common: {
                    name: 'Temperature',
                    type: 'number',
                    role: 'value.temperature',
                    unit: '°C',
                    read: true,
                    write: false,
                },
                type: 'state',
            },
            'weather.0.Current.icon': {
                common: { name: 'Icon', type: 'string', role: 'weather.icon', read: true, write: false },
                type: 'state',
            },
            'weather.0.Current.pressure': {
                common: {
                    name: 'Pressure',
                    type: 'number',
                    role: 'value.pressure',
                    unit: 'mbar',
                    read: true,
                    write: false,
                },
                type: 'state',
            },
        };

        const controls = detect(objects, { id: 'weather.0.Current' });

        expect(
            controls.some(({ type }) => type === Types.weatherCurrent),
            'A weather station must still be detected as weatherCurrent',
        );
        expect(
            !controls.some(({ type }) => type === Types.pressure),
            'The pressure of a weather station must stay with the weather station',
        );

        done();
    });

    it(`${name} Must detect pump with all optional states`, done => {
        const readOnly = (role, unit) => ({
            common: { name: role, type: 'number', role, unit, read: true, write: false },
            type: 'state',
        });
        const objects = {
            'matter.0.Pump': { common: { name: 'Pump' }, type: 'device' },
            'matter.0.Pump.onOff': {
                common: { name: 'On/Off', type: 'boolean', role: 'switch.pump', read: true, write: true },
                type: 'state',
            },
            'matter.0.Pump.level': {
                common: { name: 'Level', type: 'number', role: 'level.pump', unit: '%', read: true, write: true },
                type: 'state',
            },
            'matter.0.Pump.temperature': readOnly('value.temperature', '°C'),
            'matter.0.Pump.pressure': readOnly('value.pressure', 'mbar'),
            'matter.0.Pump.flow': readOnly('value.flow', 'm³/h'),
            'matter.0.Pump.running': {
                common: { name: 'Running', type: 'boolean', role: 'indicator.working', read: true, write: false },
                type: 'state',
            },
        };

        const controls = detect(objects, { id: 'matter.0.Pump' });

        expect(controls.length === 1, `Expected a single control but found ${controls.length}`);
        validate(controls[0], Types.pump, {
            POWER: 'matter.0.Pump.onOff',
            LEVEL: 'matter.0.Pump.level',
            TEMPERATURE: 'matter.0.Pump.temperature',
            PRESSURE: 'matter.0.Pump.pressure',
            FLOW: 'matter.0.Pump.flow',
            WORKING: 'matter.0.Pump.running',
        });

        done();
    });

    it(`${name} Must detect pump with only the on/off state`, done => {
        const objects = {
            'matter.0.SimplePump': { common: { name: 'Pump' }, type: 'device' },
            'matter.0.SimplePump.onOff': {
                common: { name: 'On/Off', type: 'boolean', role: 'switch.pump', read: true, write: true },
                type: 'state',
            },
        };

        const controls = detect(objects, { id: 'matter.0.SimplePump' });

        validate(controls[0], Types.pump, {
            POWER: 'matter.0.SimplePump.onOff',
        });

        done();
    });

    it(`${name} Must not detect a socket as a pump`, done => {
        const objects = {
            'shelly.0.Socket': { common: { name: 'Socket' }, type: 'device' },
            'shelly.0.Socket.on': {
                common: { name: 'On', type: 'boolean', role: 'switch.power', read: true, write: true },
                type: 'state',
            },
            'shelly.0.Socket.level': {
                common: { name: 'Level', type: 'number', role: 'level.dimmer', unit: '%', read: true, write: true },
                type: 'state',
            },
        };

        const controls = detect(objects, { id: 'shelly.0.Socket' });

        expect(
            !(controls || []).some(({ type }) => type === Types.pump),
            'A device without the pump role must not be a pump',
        );

        done();
    });

    it(`${name} Must detect CO alarm with the optional details`, done => {
        const bool = role => ({
            common: { name: role, type: 'boolean', role, read: true, write: false },
            type: 'state',
        });
        const objects = {
            'matter.0.CoAlarm': { common: { name: 'CO alarm' }, type: 'device' },
            'matter.0.CoAlarm.co': bool('sensor.alarm.co'),
            'matter.0.CoAlarm.severity': {
                common: {
                    name: 'Severity',
                    type: 'number',
                    role: 'value.severity',
                    states: { 0: 'NORMAL', 1: 'WARNING', 2: 'CRITICAL' },
                    read: true,
                    write: false,
                },
                type: 'state',
            },
            'matter.0.CoAlarm.muted': bool('indicator.alarm.muted'),
            'matter.0.CoAlarm.test': bool('indicator.working.test'),
            'matter.0.CoAlarm.lowbat': bool('indicator.maintenance.lowbat'),
        };

        const controls = detect(objects, { id: 'matter.0.CoAlarm' });

        validate(controls[0], Types.coAlarm, {
            ACTUAL: 'matter.0.CoAlarm.co',
            SEVERITY: 'matter.0.CoAlarm.severity',
            MUTED: 'matter.0.CoAlarm.muted',
            TEST: 'matter.0.CoAlarm.test',
            LOWBAT: 'matter.0.CoAlarm.lowbat',
        });

        done();
    });

    it(`${name} Must detect a combined smoke and CO alarm as one fireAlarm`, done => {
        const bool = role => ({
            common: { name: role, type: 'boolean', role, read: true, write: false },
            type: 'state',
        });
        const objects = {
            'matter.0.Combined': { common: { name: 'Smoke CO alarm' }, type: 'device' },
            'matter.0.Combined.smoke': bool('sensor.alarm.fire'),
            'matter.0.Combined.co': bool('sensor.alarm.co'),
            'matter.0.Combined.severity': {
                common: {
                    name: 'Severity',
                    type: 'number',
                    role: 'value.severity',
                    states: { 0: 'NORMAL', 1: 'WARNING', 2: 'CRITICAL' },
                    read: true,
                    write: false,
                },
                type: 'state',
            },
        };

        const controls = detect(objects, { id: 'matter.0.Combined' });

        // The Matter SmokeCoAlarm is one device, so it must not be split into two controls and the single
        // severity it reports stays with it
        expect(controls.length === 1, `Expected a single control but found ${controls.length}`);
        validate(controls[0], Types.fireAlarm, {
            ACTUAL: 'matter.0.Combined.smoke',
            CO: 'matter.0.Combined.co',
            SEVERITY: 'matter.0.Combined.severity',
        });

        done();
    });

    it(`${name} Must keep the test state apart from the working indicator`, done => {
        const objects = {
            'matter.0.SmokeTest': { common: { name: 'Smoke alarm' }, type: 'device' },
            'matter.0.SmokeTest.smoke': {
                common: { name: 'Smoke', type: 'boolean', role: 'sensor.alarm.fire', read: true, write: false },
                type: 'state',
            },
            'matter.0.SmokeTest.test': {
                common: { name: 'Test', type: 'boolean', role: 'indicator.working.test', read: true, write: false },
                type: 'state',
            },
        };

        const controls = detect(objects, { id: 'matter.0.SmokeTest' });

        validate(controls[0], Types.fireAlarm, {
            ACTUAL: 'matter.0.SmokeTest.smoke',
            TEST: 'matter.0.SmokeTest.test',
        });

        done();
    });

    it(`${name} Must detect the on time of a light and of a socket`, done => {
        const onTime = () => ({
            common: { name: 'On time', type: 'number', role: 'level.timer.off', unit: 's', read: true, write: true },
            type: 'state',
        });

        const lamp = {
            'hm-rpc.0.Lamp': { common: { name: 'Lamp' }, type: 'device' },
            'hm-rpc.0.Lamp.on': {
                common: { name: 'On', type: 'boolean', role: 'switch.light', read: true, write: true },
                type: 'state',
            },
            'hm-rpc.0.Lamp.onTime': onTime(),
        };
        validate(detect(lamp, { id: 'hm-rpc.0.Lamp', ignoreEnums: true })[0], Types.light, {
            SET: 'hm-rpc.0.Lamp.on',
            ON_TIME: 'hm-rpc.0.Lamp.onTime',
        });

        const plug = {
            'hm-rpc.0.Plug': { common: { name: 'Plug' }, type: 'device' },
            'hm-rpc.0.Plug.on': {
                common: { name: 'On', type: 'boolean', role: 'switch.active', read: true, write: true },
                type: 'state',
            },
            'hm-rpc.0.Plug.onTime': onTime(),
        };
        validate(detect(plug, { id: 'hm-rpc.0.Plug', ignoreEnums: true })[0], Types.socket, {
            SET: 'hm-rpc.0.Plug.on',
            ON_TIME: 'hm-rpc.0.Plug.onTime',
        });

        done();
    });

    it(`${name} Must detect the on time of a colour light`, done => {
        const objects = {
            'zigbee.0.Ct': { common: { name: 'Lamp' }, type: 'device' },
            'zigbee.0.Ct.on': {
                common: { name: 'On', type: 'boolean', role: 'switch.light', read: true, write: true },
                type: 'state',
            },
            'zigbee.0.Ct.dimmer': {
                common: { name: 'Dimmer', type: 'number', role: 'level.dimmer', unit: '%', read: true, write: true },
                type: 'state',
            },
            'zigbee.0.Ct.temperature': {
                common: {
                    name: 'Color temperature',
                    type: 'number',
                    role: 'level.color.temperature',
                    read: true,
                    write: true,
                },
                type: 'state',
            },
            'zigbee.0.Ct.onTime': {
                common: {
                    name: 'On time',
                    type: 'number',
                    role: 'level.timer.off',
                    unit: 's',
                    read: true,
                    write: true,
                },
                type: 'state',
            },
        };

        validate(detect(objects, { id: 'zigbee.0.Ct', ignoreEnums: true })[0], Types.ct, {
            ON: 'zigbee.0.Ct.on',
            DIMMER: 'zigbee.0.Ct.dimmer',
            TEMPERATURE: 'zigbee.0.Ct.temperature',
            ON_TIME: 'zigbee.0.Ct.onTime',
        });

        done();
    });

    it(`${name} Must offer the on time only on types that can be switched on`, done => {
        const expected = [
            'airPurifier',
            'cie',
            'ct',
            'dimmer',
            'fan',
            'hue',
            'light',
            'rgb',
            'rgbSingle',
            'rgbwSingle',
            'socket',
        ];
        const patterns = ChannelDetector.getPatterns();

        // Compare against every pattern, so a type cannot gain or lose the state unnoticed
        const actual = Object.keys(patterns)
            .filter(type => (patterns[type]?.states || []).some(state => state?.name === 'ON_TIME'))
            .sort();
        expect(
            actual.join(',') === expected.join(','),
            `Expected ON_TIME on ${expected.join(', ')} but found it on ${actual.join(', ')}`,
        );

        done();
    });

    it(`${name} Must detect air conditioner with fan level, airflow, filter and shared states`, done => {
        const writable = (role, states, unit) => ({
            common: { name: role, type: 'number', role, states, unit, read: true, write: true },
            type: 'state',
        });
        const readOnly = (role, type, unit) => ({
            common: { name: role, type, role, unit, read: true, write: false },
            type: 'state',
        });
        const objects = {
            'matter.0.RoomAC3': { common: { name: 'Room AC' }, type: 'device' },
            'matter.0.RoomAC3.set': writable('level.temperature', undefined, '°C'),
            'matter.0.RoomAC3.mode': writable('level.mode.airconditioner', { 0: 'AUTO', 3: 'COOL' }),
            'matter.0.RoomAC3.percent': writable('level.speed', undefined, '%'),
            'matter.0.RoomAC3.airflow': writable('level.mode.airflow', { 0: 'FORWARD', 1: 'REVERSE' }),
            'matter.0.RoomAC3.filter': readOnly('value.filter', 'number', '%'),
            'matter.0.RoomAC3.carbon': readOnly('value.filter.carbon', 'number', '%'),
            'matter.0.RoomAC3.change': readOnly('indicator.maintenance.filter', 'boolean'),
            'matter.0.RoomAC3.working': readOnly('indicator.working', 'boolean'),
            'matter.0.RoomAC3.lowbat': readOnly('indicator.maintenance.lowbat', 'boolean'),
            'matter.0.RoomAC3.battery': readOnly('value.battery', 'number', '%'),
        };

        const controls = detect(objects, { id: 'matter.0.RoomAC3' });

        // Everything belongs to the air conditioner, nothing is left over for a second control
        expect(controls.length === 1, `Expected a single control but found ${controls.length}`);
        validate(controls[0], Types.airCondition, {
            SET: 'matter.0.RoomAC3.set',
            MODE: 'matter.0.RoomAC3.mode',
            SPEED_LEVEL: 'matter.0.RoomAC3.percent',
            AIRFLOW_DIRECTION: 'matter.0.RoomAC3.airflow',
            FILTER_CONDITION: 'matter.0.RoomAC3.filter',
            FILTER_CONDITION_CARBON: 'matter.0.RoomAC3.carbon',
            FILTER_CHANGE: 'matter.0.RoomAC3.change',
            WORKING: 'matter.0.RoomAC3.working',
            LOWBAT: 'matter.0.RoomAC3.lowbat',
            BATTERY: 'matter.0.RoomAC3.battery',
        });

        done();
    });

    it(`${name} Must not detect an air conditioner as an air purifier`, done => {
        const objects = {
            'matter.0.RoomAC4': { common: { name: 'Room AC' }, type: 'device' },
            'matter.0.RoomAC4.set': {
                common: { name: 'set', type: 'number', role: 'level.temperature', unit: '°C', read: true, write: true },
                type: 'state',
            },
            'matter.0.RoomAC4.mode': {
                common: {
                    name: 'mode',
                    type: 'number',
                    role: 'level.mode.airconditioner',
                    states: { 0: 'AUTO' },
                    read: true,
                    write: true,
                },
                type: 'state',
            },
            'matter.0.RoomAC4.fanMode': {
                common: {
                    name: 'fan',
                    type: 'number',
                    role: 'level.mode.fan',
                    states: { 0: 'AUTO' },
                    read: true,
                    write: true,
                },
                type: 'state',
            },
            'matter.0.RoomAC4.filter': {
                common: { name: 'filter', type: 'number', role: 'value.filter', unit: '%', read: true, write: false },
                type: 'state',
            },
        };

        const controls = detect(objects, { id: 'matter.0.RoomAC4' });

        expect(controls.length === 1, `Expected a single control but found ${controls.length}`);
        validate(controls[0], Types.airCondition, {
            SET: 'matter.0.RoomAC4.set',
            MODE: 'matter.0.RoomAC4.mode',
            SPEED: 'matter.0.RoomAC4.fanMode',
            FILTER_CONDITION: 'matter.0.RoomAC4.filter',
        });

        done();
    });

    it(`${name} Must document how an air conditioner next to a purifier is detected`, done => {
        const objects = {
            'x.0.Combo': { common: { name: 'Combo' }, type: 'device' },
            'x.0.Combo.ac': { common: { name: 'ac' }, type: 'channel' },
            'x.0.Combo.ac.set': {
                common: { name: 'set', type: 'number', role: 'level.temperature', unit: '°C', read: true, write: true },
                type: 'state',
            },
            'x.0.Combo.ac.mode': {
                common: {
                    name: 'mode',
                    type: 'number',
                    role: 'level.mode.airconditioner',
                    states: { 0: 'AUTO' },
                    read: true,
                    write: true,
                },
                type: 'state',
            },
            'x.0.Combo.purifier': { common: { name: 'purifier' }, type: 'channel' },
            'x.0.Combo.purifier.speed': {
                common: {
                    name: 'speed',
                    type: 'number',
                    role: 'level.mode.fan',
                    states: { 0: 'AUTO' },
                    read: true,
                    write: true,
                },
                type: 'state',
            },
            'x.0.Combo.purifier.filter': {
                common: { name: 'filter', type: 'number', role: 'value.filter', unit: '%', read: true, write: false },
                type: 'state',
            },
        };

        const controls = detect(objects, { id: 'x.0.Combo' });

        expect(
            !controls.some(({ type }) => type === Types.airPurifier),
            'The purifier is already swallowed by the air conditioner before this change',
        );
        validate(
            controls[0],
            Types.airCondition,
            {
                SET: 'x.0.Combo.ac.set',
                MODE: 'x.0.Combo.ac.mode',
                SPEED: 'x.0.Combo.purifier.speed',
                FILTER_CONDITION: 'x.0.Combo.purifier.filter',
            },
            true,
        );

        done();
    });

    it(`${name} Must treat regular expression characters in an object ID as literals`, done => {
        const { getAllStatesInChannel, getAllStatesInDevice } = require('../build/roleEnumUtils');

        for (const channel of ['a.b', 'a\\b', 'a+b', 'a|b', 'a*b', 'a(b']) {
            const keys = [`${channel}.x`, `${channel}.y`, 'other.x'];
            const found = getAllStatesInChannel(keys, channel);
            expect(
                found.length === 2 && found[0] === `${channel}.x` && found[1] === `${channel}.y`,
                `Expected both states of "${channel}" but found ${JSON.stringify(found)}`,
            );
        }

        // The dot must stay escaped, so a channel must not match an ID with any character in its place
        expect(
            getAllStatesInChannel(['aXb.x'], 'a.b').length === 0,
            'A dot in the channel ID must not match an arbitrary character',
        );
        expect(
            getAllStatesInDevice(['a+b.c.d', 'a+b.c', 'zz.c.d'], 'a+b').join(',') === 'a+b.c.d',
            'The device lookup must escape the ID as well',
        );

        done();
    });

    it(`${name} Must not use a generic state role as the feedback of a socket`, done => {
        const objects = {
            'zigbee.0.Plug': { common: { name: 'Plug' }, type: 'device' },
            'zigbee.0.Plug.state': {
                common: { name: 'On', type: 'boolean', role: 'switch', read: true, write: true },
                type: 'state',
            },
            // Reachability of the device, exposed by the zigbee adapter for every device
            'zigbee.0.Plug.available': {
                common: { name: 'Available', type: 'boolean', role: 'state', read: true, write: false },
                type: 'state',
            },
        };

        const controls = detect(objects, { id: 'zigbee.0.Plug' });

        const socket = controls.find(({ type }) => type === Types.socket);
        expect(!!socket, 'The plug must still be detected as a socket');
        expect(
            !socket.states.some(({ name, id }) => name === 'ACTUAL' && id === 'zigbee.0.Plug.available'),
            'A generic state role must not become the feedback of the socket',
        );

        done();
    });

    it(`${name} Must still use a dedicated feedback role of a socket`, done => {
        const objects = {
            'shelly.0.Relay': { common: { name: 'Relay' }, type: 'device' },
            'shelly.0.Relay.set': {
                common: { name: 'On', type: 'boolean', role: 'switch', read: true, write: true },
                type: 'state',
            },
            'shelly.0.Relay.actual': {
                common: { name: 'Actual', type: 'boolean', role: 'state.active', read: true, write: false },
                type: 'state',
            },
        };

        const controls = detect(objects, { id: 'shelly.0.Relay' });

        validate(controls[0], Types.socket, {
            SET: 'shelly.0.Relay.set',
            ACTUAL: 'shelly.0.Relay.actual',
        });

        done();
    });

    it(`${name} Must not use an arbitrary role ending in switch as ON_ACTUAL`, done => {
        const objects = {
            'test.0.Lamp': { common: { name: 'Lamp' }, type: 'device' },
            'test.0.Lamp.on': {
                common: { name: 'On', type: 'boolean', role: 'switch.light', read: true, write: true },
                type: 'state',
            },
            'test.0.Lamp.someSwitch': {
                common: { name: 'Some switch', type: 'boolean', role: 'info.switch', read: true, write: false },
                type: 'state',
            },
        };

        const controls = detect(objects, { id: 'test.0.Lamp', ignoreEnums: true });

        const light = controls.find(({ type }) => type === Types.light);
        expect(!!light, 'The lamp must still be detected as a light');
        expect(
            !light.states.some(({ name, id }) => name === 'ON_ACTUAL' && id),
            'A role that merely ends in "switch" must not become ON_ACTUAL',
        );

        done();
    });

    it(`${name} Must detect a pure electricity meter`, done => {
        const value = (role, unit) => ({
            common: { name: role, type: 'number', role, unit, read: true, write: false },
            type: 'state',
        });
        const objects = {
            'shelly.0.Meter': { common: { name: 'Meter' }, type: 'device' },
            'shelly.0.Meter.power': value('value.power', 'W'),
            'shelly.0.Meter.current': value('value.current', 'mA'),
            'shelly.0.Meter.voltage': value('value.voltage', 'V'),
            'shelly.0.Meter.energy': value('value.power.consumption', 'Wh'),
            'shelly.0.Meter.frequency': value('value.frequency', 'Hz'),
        };

        const controls = detect(objects, { id: 'shelly.0.Meter' });

        validate(controls[0], Types.electricity, {
            ELECTRIC_POWER: 'shelly.0.Meter.power',
            CURRENT: 'shelly.0.Meter.current',
            VOLTAGE: 'shelly.0.Meter.voltage',
            CONSUMPTION: 'shelly.0.Meter.energy',
            FREQUENCY: 'shelly.0.Meter.frequency',
        });

        done();
    });

    it(`${name} Must detect an electricity meter that reports only one value`, done => {
        const objects = {
            'shelly.0.Energy': { common: { name: 'Energy' }, type: 'device' },
            'shelly.0.Energy.total': {
                common: {
                    name: 'Total',
                    type: 'number',
                    role: 'value.power.consumption',
                    unit: 'Wh',
                    read: true,
                    write: false,
                },
                type: 'state',
            },
        };

        validate(detect(objects, { id: 'shelly.0.Energy' })[0], Types.electricity, {
            CONSUMPTION: 'shelly.0.Energy.total',
        });

        done();
    });

    it(`${name} Must leave the electricity of a socket with the socket`, done => {
        const objects = {
            'shelly.0.Plug3': { common: { name: 'Plug' }, type: 'device' },
            'shelly.0.Plug3.on': {
                common: { name: 'On', type: 'boolean', role: 'switch.active', read: true, write: true },
                type: 'state',
            },
            'shelly.0.Plug3.power': {
                common: { name: 'Power', type: 'number', role: 'value.power', unit: 'W', read: true, write: false },
                type: 'state',
            },
        };

        const controls = detect(objects, { id: 'shelly.0.Plug3' });

        expect(controls.length === 1, `Expected a single control but found ${controls.length}`);
        validate(controls[0], Types.socket, {
            SET: 'shelly.0.Plug3.on',
            ELECTRIC_POWER: 'shelly.0.Plug3.power',
        });

        done();
    });

    it(`${name} Must detect the valve and the running mode of a thermostat`, done => {
        const objects = {
            'matter.0.Trv': { common: { name: 'Radiator thermostat' }, type: 'device' },
            'matter.0.Trv.set': {
                common: { name: 'Setpoint', type: 'number', role: 'level.temperature', unit: '°C', read: true, write: true },
                type: 'state',
            },
            'matter.0.Trv.valve': {
                common: { name: 'Valve', type: 'number', role: 'value.valve', unit: '%', read: true, write: false },
                type: 'state',
            },
            'matter.0.Trv.running': {
                common: {
                    name: 'Running mode',
                    type: 'number',
                    role: 'value.mode.thermostat',
                    states: { 0: 'OFF', 1: 'HEAT', 2: 'COOL' },
                    read: true,
                    write: false,
                },
                type: 'state',
            },
        };

        const controls = detect(objects, { id: 'matter.0.Trv' });

        validate(controls[0], Types.thermostat, {
            SET: 'matter.0.Trv.set',
            VALVE: 'matter.0.Trv.valve',
            WORKING_MODE: 'matter.0.Trv.running',
        });

        done();
    });

    it(`${name} Must accept a writable valve of a thermostat`, done => {
        const objects = {
            'matter.0.Trv2': { common: { name: 'Radiator thermostat' }, type: 'device' },
            'matter.0.Trv2.set': {
                common: { name: 'Setpoint', type: 'number', role: 'level.temperature', unit: '°C', read: true, write: true },
                type: 'state',
            },
            'matter.0.Trv2.valve': {
                common: { name: 'Valve', type: 'number', role: 'level.valve', unit: '%', read: true, write: true },
                type: 'state',
            },
        };

        const controls = detect(objects, { id: 'matter.0.Trv2' });

        validate(controls[0], Types.thermostat, {
            SET: 'matter.0.Trv2.set',
            VALVE: 'matter.0.Trv2.valve',
        });

        done();
    });

    it(`${name} Must detect the running mode of an air conditioner`, done => {
        const objects = {
            'matter.0.AC5': { common: { name: 'Room AC' }, type: 'device' },
            'matter.0.AC5.set': {
                common: { name: 'Setpoint', type: 'number', role: 'level.temperature', unit: '°C', read: true, write: true },
                type: 'state',
            },
            'matter.0.AC5.mode': {
                common: {
                    name: 'Mode',
                    type: 'number',
                    role: 'level.mode.airconditioner',
                    states: { 0: 'AUTO', 3: 'COOL' },
                    read: true,
                    write: true,
                },
                type: 'state',
            },
            'matter.0.AC5.running': {
                common: {
                    name: 'Running mode',
                    type: 'number',
                    role: 'value.mode.airconditioner',
                    states: { 0: 'IDLE', 1: 'HEAT', 2: 'COOL' },
                    read: true,
                    write: false,
                },
                type: 'state',
            },
        };

        const controls = detect(objects, { id: 'matter.0.AC5' });

        validate(controls[0], Types.airCondition, {
            SET: 'matter.0.AC5.set',
            MODE: 'matter.0.AC5.mode',
            WORKING_MODE: 'matter.0.AC5.running',
        });

        done();
    });

    it(`${name} Must detect the RSSI of a device`, done => {
        const objects = {
            'zigbee.0.Lamp': { common: { name: 'Lamp' }, type: 'device' },
            'zigbee.0.Lamp.state': {
                common: { name: 'On', type: 'boolean', role: 'switch', read: true, write: true },
                type: 'state',
            },
            'zigbee.0.Lamp.rssi': {
                common: { name: 'RSSI', type: 'number', role: 'value.rssi', unit: 'dBm', read: true, write: false },
                type: 'state',
            },
        };

        const controls = detect(objects, { id: 'zigbee.0.Lamp' });

        validate(controls[0], Types.socket, {
            SET: 'zigbee.0.Lamp.state',
            RSSI: 'zigbee.0.Lamp.rssi',
        });

        done();
    });

    it(`${name} Must offer the RSSI to every control of a device`, done => {
        const controls = detect('./hm-thermostat.json', {
            id: 'hm-rpc.1.JEQ0XXXXXX',
        });

        // The radio quality describes the device, so it is not consumed by the first control that matches
        const withRssi = controls.filter(control =>
            control.states.some(({ name, id }) => name === 'RSSI' && id === 'hm-rpc.1.JEQ0XXXXXX.0.RSSI_PEER'),
        );
        expect(withRssi.length > 1, `Expected the RSSI in more than one control but found it in ${withRssi.length}`);

        done();
    });

    it(`${name} Must not offer the RSSI on types that are not radio devices`, done => {
        const excluded = ['chart', 'image', 'location', 'locationOne', 'warning', 'weatherCurrent', 'weatherForecast'];
        const patterns = ChannelDetector.getPatterns();

        // Compare against every pattern, so a type cannot gain or lose the state unnoticed
        const actual = Object.keys(patterns)
            .filter(type => !(patterns[type]?.states || []).some(state => state?.name === 'RSSI'))
            .sort();
        expect(
            actual.join(',') === [...excluded].sort().join(','),
            `Expected no RSSI on ${excluded.join(', ')} but found none on ${actual.join(', ')}`,
        );

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
            RSSI: 'hm-rpc.1.JEQ0XXXXXX.0.RSSI_PEER',
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
            RSSI: 'hm-rpc.1.JEQ0XXXXXX.0.RSSI_PEER',
        });

        options.id = 'hm-rpc.1.JEQ0XXXXXX.2';

        const controls2 = detect('./hm-thermostat.json', options);
        expect(controls2 === null, 'No controls expected');

        options.id = 'hm-rpc.1.JEQ0XXXXXX';

        const controls3 = detect('./hm-thermostat.json', options);
        expect(controls3 === null, 'No controls expected');

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
            RSSI: 'hm-rpc.1.JEQ0XXXXXX.0.RSSI_PEER',
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
            RSSI: 'hm-rpc.1.JEQ0XXXXXX.0.RSSI_PEER',
        });

        options.id = 'hm-rpc.1.JEQ0XXXXXX.2';

        const controls2 = detect('./hm-thermostat.json', options);
        expect(controls2 === null, 'No controls expected');

        options.id = 'hm-rpc.1.JEQ0XXXXXX';

        const controls3 = detect('./hm-thermostat.json', options);
        expect(controls3 === null, 'No controls expected');

        done();
    });

    it(`${name} Must detect a robotic vacuum that has only the run mode`, done => {
        const objects = {
            'matter.0.Rvc': { common: { name: 'Robot' }, type: 'device' },
            'matter.0.Rvc.power': {
                common: { name: 'Power', type: 'boolean', role: 'switch.power', read: true, write: true },
                type: 'state',
            },
            'matter.0.Rvc.run': {
                common: {
                    name: 'Run mode',
                    type: 'number',
                    role: 'level.mode.vacuum',
                    states: { 0: 'IDLE', 1: 'CLEANING', 2: 'MAPPING' },
                    read: true,
                    write: true,
                },
                type: 'state',
            },
            'matter.0.Rvc.home': {
                common: { name: 'Home', type: 'boolean', role: 'button.home', read: true, write: true },
                type: 'state',
            },
            'matter.0.Rvc.progress': {
                common: { name: 'Progress', type: 'number', role: 'value.progress', unit: '%', read: true, write: false },
                type: 'state',
            },
            'matter.0.Rvc.phase': {
                common: { name: 'Phase', type: 'string', role: 'value.vacuum.phase', read: true, write: false },
                type: 'state',
            },
        };

        const controls = detect(objects, { id: 'matter.0.Rvc' });

        validate(controls[0], Types.vacuumCleaner, {
            POWER: 'matter.0.Rvc.power',
            RUN_MODE: 'matter.0.Rvc.run',
            HOME: 'matter.0.Rvc.home',
            PROGRESS: 'matter.0.Rvc.progress',
            PHASE: 'matter.0.Rvc.phase',
        });

        done();
    });

    it(`${name} Must still detect a vacuum that has only the cleaning mode`, done => {
        const objects = {
            'mihome.0.Vac': { common: { name: 'Vacuum' }, type: 'device' },
            'mihome.0.Vac.power': {
                common: { name: 'Power', type: 'boolean', role: 'switch.power', read: true, write: true },
                type: 'state',
            },
            'mihome.0.Vac.mode': {
                common: {
                    name: 'Mode',
                    type: 'number',
                    role: 'level.mode.cleanup',
                    states: { 0: 'AUTO', 1: 'NORMAL' },
                    read: true,
                    write: true,
                },
                type: 'state',
            },
        };

        validate(detect(objects, { id: 'mihome.0.Vac' })[0], Types.vacuumCleaner, {
            POWER: 'mihome.0.Vac.power',
            MODE: 'mihome.0.Vac.mode',
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

        expect(controls === null, 'No controls expected');

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

    it(`${name} Must detect air purifier with both filters`, done => {
        const writable = (name, role, states, unit) => ({
            common: { name, type: 'number', role, states, unit, read: true, write: true },
            type: 'state',
        });
        const readOnly = (name, role, unit) => ({
            common: { name, type: 'number', role, unit, read: true, write: false },
            type: 'state',
        });
        const objects = {
            'matter.0.Purifier': { common: { name: 'Dyson Purifier' }, type: 'device' },
            'matter.0.Purifier.fanMode': writable('Fan mode', 'level.mode.fan', { 0: 'AUTO', 1: 'HIGH' }),
            'matter.0.Purifier.percent': writable('Percent setting', 'level.speed', undefined, '%'),
            'matter.0.Purifier.rock': writable('Rocking', 'level.mode.swing', { 0: 'AUTO', 2: 'STATIONARY' }),
            'matter.0.Purifier.airflow': writable('Airflow', 'level.mode.airflow', { 0: 'FORWARD', 1: 'REVERSE' }),
            'matter.0.Purifier.onOff': {
                common: { name: 'On/Off', type: 'boolean', role: 'switch.power', read: true, write: true },
                type: 'state',
            },
            'matter.0.Purifier.hepa': readOnly('Hepa filter', 'value.filter', '%'),
            'matter.0.Purifier.carbon': readOnly('Carbon filter', 'value.filter.carbon', '%'),
            'matter.0.Purifier.change': {
                common: {
                    name: 'Change filter',
                    type: 'boolean',
                    role: 'indicator.maintenance.filter',
                    read: true,
                    write: false,
                },
                type: 'state',
            },
        };

        const controls = detect(objects, { id: 'matter.0.Purifier' });

        validate(controls[0], Types.airPurifier, {
            SPEED: 'matter.0.Purifier.fanMode',
            SPEED_LEVEL: 'matter.0.Purifier.percent',
            SWING: 'matter.0.Purifier.rock',
            AIRFLOW_DIRECTION: 'matter.0.Purifier.airflow',
            POWER: 'matter.0.Purifier.onOff',
            FILTER_CONDITION: 'matter.0.Purifier.hepa',
            FILTER_CONDITION_CARBON: 'matter.0.Purifier.carbon',
            FILTER_CHANGE: 'matter.0.Purifier.change',
        });

        done();
    });

    it(`${name} Must detect fan with all optional states`, done => {
        const writableNumber = (name, role, states, unit) => ({
            common: { name, type: 'number', role, states, unit, read: true, write: true },
            type: 'state',
        });
        const objects = {
            'matter.0.Fan': { common: { name: 'Fan' }, type: 'device' },
            'matter.0.Fan.fanMode': writableNumber('Fan mode', 'level.mode.fan', {
                0: 'AUTO',
                1: 'HIGH',
                2: 'LOW',
                3: 'MEDIUM',
            }),
            'matter.0.Fan.percent': writableNumber('Percent setting', 'level.speed', undefined, '%'),
            'matter.0.Fan.rock': writableNumber('Rocking', 'level.mode.swing', {
                0: 'AUTO',
                1: 'HORIZONTAL',
                2: 'STATIONARY',
                3: 'VERTICAL',
            }),
            'matter.0.Fan.airflow': writableNumber('Airflow direction', 'level.mode.airflow', {
                0: 'FORWARD',
                1: 'REVERSE',
            }),
            'matter.0.Fan.onOff': {
                common: { name: 'On/Off', type: 'boolean', role: 'switch.power', read: true, write: true },
                type: 'state',
            },
        };

        const controls = detect(objects, { id: 'matter.0.Fan' });

        validate(controls[0], Types.fan, {
            SPEED: 'matter.0.Fan.fanMode',
            SPEED_LEVEL: 'matter.0.Fan.percent',
            SWING: 'matter.0.Fan.rock',
            AIRFLOW_DIRECTION: 'matter.0.Fan.airflow',
            POWER: 'matter.0.Fan.onOff',
        });

        done();
    });

    it(`${name} Must detect air purifier with only a filter state`, done => {
        const objects = {
            'matter.0.SimplePurifier': { common: { name: 'Purifier' }, type: 'device' },
            'matter.0.SimplePurifier.fanMode': {
                common: {
                    name: 'Fan mode',
                    type: 'number',
                    role: 'level.mode.fan',
                    states: { 0: 'OFF', 1: 'LOW', 3: 'HIGH' },
                    read: true,
                    write: true,
                },
                type: 'state',
            },
            'matter.0.SimplePurifier.hepa': {
                common: {
                    name: 'Hepa filter',
                    type: 'number',
                    role: 'value.filter',
                    unit: '%',
                    read: true,
                    write: false,
                },
                type: 'state',
            },
        };

        const controls = detect(objects, { id: 'matter.0.SimplePurifier' });

        validate(controls[0], Types.airPurifier, {
            SPEED: 'matter.0.SimplePurifier.fanMode',
            FILTER_CONDITION: 'matter.0.SimplePurifier.hepa',
        });

        done();
    });

    it(`${name} Must not have a requiredOneOf group with a single member`, done => {
        const patterns = ChannelDetector.getPatterns();

        for (const [type, control] of Object.entries(patterns)) {
            const members = {};
            for (const state of control.states || []) {
                for (const entry of Array.isArray(state) ? state : [state]) {
                    if (entry?.requiredOneOf) {
                        members[entry.requiredOneOf] = (members[entry.requiredOneOf] || 0) + 1;
                    }
                }
            }
            for (const [group, count] of Object.entries(members)) {
                // A lone member is a plain `required` state, so it is almost certainly a typo in the group name
                expect(count > 1, `Group "${group}" of ${type} has only ${count} member`);
            }
        }

        done();
    });

    it(`${name} Must detect air purifier with only the carbon filter`, done => {
        const objects = {
            'matter.0.CarbonPurifier': { common: { name: 'Purifier' }, type: 'device' },
            'matter.0.CarbonPurifier.fanMode': {
                common: {
                    name: 'Fan mode',
                    type: 'number',
                    role: 'level.mode.fan',
                    states: { 0: 'OFF', 1: 'LOW', 3: 'HIGH' },
                    read: true,
                    write: true,
                },
                type: 'state',
            },
            'matter.0.CarbonPurifier.carbon': {
                common: {
                    name: 'Carbon filter',
                    type: 'number',
                    role: 'value.filter.carbon',
                    unit: '%',
                    read: true,
                    write: false,
                },
                type: 'state',
            },
        };

        const controls = detect(objects, { id: 'matter.0.CarbonPurifier' });

        validate(controls[0], Types.airPurifier, {
            SPEED: 'matter.0.CarbonPurifier.fanMode',
            FILTER_CONDITION_CARBON: 'matter.0.CarbonPurifier.carbon',
        });

        done();
    });

    it(`${name} Must not detect an air purifier without any filter`, done => {
        const objects = {
            'matter.0.NoFilter': { common: { name: 'Fan' }, type: 'device' },
            'matter.0.NoFilter.fanMode': {
                common: {
                    name: 'Fan mode',
                    type: 'number',
                    role: 'level.mode.fan',
                    states: { 0: 'OFF', 1: 'LOW' },
                    read: true,
                    write: true,
                },
                type: 'state',
            },
        };

        const controls = detect(objects, { id: 'matter.0.NoFilter' });

        expect(
            !(controls || []).some(({ type }) => type === Types.airPurifier),
            'A device without any filter state must not be an air purifier',
        );

        done();
    });

    it(`${name} Must not detect a lone filter state as an air purifier`, done => {
        const objects = {
            'matter.0.FilterOnly': { common: { name: 'Filter' }, type: 'device' },
            'matter.0.FilterOnly.hepa': {
                common: {
                    name: 'Hepa filter',
                    type: 'number',
                    role: 'value.filter',
                    unit: '%',
                    read: true,
                    write: false,
                },
                type: 'state',
            },
        };

        const controls = detect(objects, { id: 'matter.0.FilterOnly' });

        expect(
            !(controls || []).some(({ type }) => type === Types.airPurifier),
            'A device without any fan control must not be an air purifier',
        );

        done();
    });

    it(`${name} Must detect fan without the optional OnOff cluster`, done => {
        const objects = {
            'matter.0.SimpleFan': { common: { name: 'Fan' }, type: 'device' },
            'matter.0.SimpleFan.fanMode': {
                common: {
                    name: 'Fan mode',
                    type: 'number',
                    role: 'level.mode.fan',
                    states: { 0: 'OFF', 1: 'LOW', 2: 'MEDIUM', 3: 'HIGH' },
                    read: true,
                    write: true,
                },
                type: 'state',
            },
        };

        const controls = detect(objects, { id: 'matter.0.SimpleFan' });

        validate(controls[0], Types.fan, {
            SPEED: 'matter.0.SimpleFan.fanMode',
        });

        done();
    });

    it(`${name} Must still detect an air conditioner as airCondition`, done => {
        const objects = {
            'alias.0.AC2': { common: { name: 'AC' }, type: 'channel' },
            'alias.0.AC2.SET': {
                common: { name: 'SET', role: 'level.temperature', type: 'number', unit: '°C', read: true, write: true },
                type: 'state',
            },
            'alias.0.AC2.MODE': {
                common: {
                    name: 'MODE',
                    role: 'level.mode.airconditioner',
                    type: 'number',
                    states: { 0: 'AUTO', 3: 'COOL' },
                    read: true,
                    write: true,
                },
                type: 'state',
            },
            'alias.0.AC2.SPEED': {
                common: {
                    name: 'SPEED',
                    role: 'level.mode.fan',
                    type: 'number',
                    states: { 0: 'AUTO', 1: 'HIGH' },
                    read: true,
                    write: true,
                },
                type: 'state',
            },
        };

        const controls = detect(objects, { id: 'alias.0.AC2' });

        expect(controls.length === 1, `Expected a single control but found ${controls.length}`);
        validate(controls[0], Types.airCondition, {
            SET: 'alias.0.AC2.SET',
            MODE: 'alias.0.AC2.MODE',
            SPEED: 'alias.0.AC2.SPEED',
        });

        done();
    });

    it(`${name} Must keep the fan speed on an air conditioner`, done => {
        const objects = {
            'alias.0.AC': { common: { name: 'AC', role: 'airCondition' }, type: 'channel' },
            'alias.0.AC.SET': {
                common: { name: 'SET', role: 'level.temperature', type: 'number', unit: '°C', read: true, write: true },
                type: 'state',
            },
            'alias.0.AC.MODE': {
                common: {
                    name: 'MODE',
                    role: 'level.mode.airconditioner',
                    type: 'number',
                    states: { 0: 'AUTO', 3: 'COOL', 7: 'HEAT' },
                    read: true,
                    write: true,
                },
                type: 'state',
            },
            'alias.0.AC.SPEED': {
                common: {
                    name: 'SPEED',
                    role: 'level.mode.fan',
                    type: 'number',
                    states: { 0: 'AUTO', 1: 'HIGH', 2: 'LOW' },
                    read: true,
                    write: true,
                },
                type: 'state',
            },
        };

        const controls = detect(objects, { id: 'alias.0.AC' });

        expect(controls.length === 1, `Expected a single control but found ${controls.length}`);
        validate(controls[0], Types.airCondition, {
            SET: 'alias.0.AC.SET',
            MODE: 'alias.0.AC.MODE',
            SPEED: 'alias.0.AC.SPEED',
        });

        done();
    });

    it(`${name} Must detect a thermostat with all three setpoints`, done => {
        const setpoint = role => ({
            common: { name: role, type: 'number', role, unit: '°C', read: true, write: true },
            type: 'state',
        });
        const objects = {
            'matter.0.Th1': { common: { name: 'Thermostat' }, type: 'device' },
            'matter.0.Th1.set': setpoint('level.temperature'),
            'matter.0.Th1.heating': setpoint('level.temperature.heating'),
            'matter.0.Th1.cooling': setpoint('level.temperature.cooling'),
        };

        const controls = detect(objects, { id: 'matter.0.Th1' });

        validate(controls[0], Types.thermostat, {
            SET: 'matter.0.Th1.set',
            SET_HEATING: 'matter.0.Th1.heating',
            SET_COOLING: 'matter.0.Th1.cooling',
        });

        done();
    });

    it(`${name} Must detect a thermostat that has only the two dual setpoints`, done => {
        const setpoint = role => ({
            common: { name: role, type: 'number', role, unit: '°C', read: true, write: true },
            type: 'state',
        });

        // The mapping must not depend on the order of the object IDs
        for (const [heatingId, coolingId] of [
            ['a-heating', 'b-cooling'],
            ['b-heating', 'a-cooling'],
        ]) {
            const objects = {
                'matter.0.Th2': { common: { name: 'Thermostat' }, type: 'device' },
                [`matter.0.Th2.${heatingId}`]: setpoint('level.temperature.heating'),
                [`matter.0.Th2.${coolingId}`]: setpoint('level.temperature.cooling'),
            };

            const controls = detect(objects, { id: 'matter.0.Th2' });

            validate(controls[0], Types.thermostat, {
                SET_HEATING: `matter.0.Th2.${heatingId}`,
                SET_COOLING: `matter.0.Th2.${coolingId}`,
            });
        }

        done();
    });

    it(`${name} Must map a lone heating setpoint to SET_HEATING`, done => {
        const objects = {
            'matter.0.Th3': { common: { name: 'Thermostat' }, type: 'device' },
            'matter.0.Th3.heating': {
                common: {
                    name: 'Heating setpoint',
                    type: 'number',
                    role: 'level.temperature.heating',
                    unit: '°C',
                    read: true,
                    write: true,
                },
                type: 'state',
            },
        };

        const controls = detect(objects, { id: 'matter.0.Th3' });

        validate(controls[0], Types.thermostat, {
            SET_HEATING: 'matter.0.Th3.heating',
        });

        done();
    });

    it(`${name} Must detect an air conditioner with the dual setpoints`, done => {
        const setpoint = role => ({
            common: { name: role, type: 'number', role, unit: '°C', read: true, write: true },
            type: 'state',
        });
        const objects = {
            'matter.0.RoomAC2': { common: { name: 'Room AC' }, type: 'device' },
            'matter.0.RoomAC2.heating': setpoint('level.temperature.heating'),
            'matter.0.RoomAC2.cooling': setpoint('level.temperature.cooling'),
            'matter.0.RoomAC2.mode': {
                common: {
                    name: 'Mode',
                    type: 'number',
                    role: 'level.mode.airconditioner',
                    states: { 0: 'AUTO', 3: 'COOL', 7: 'HEAT' },
                    read: true,
                    write: true,
                },
                type: 'state',
            },
        };

        const controls = detect(objects, { id: 'matter.0.RoomAC2' });

        validate(controls[0], Types.airCondition, {
            SET_HEATING: 'matter.0.RoomAC2.heating',
            SET_COOLING: 'matter.0.RoomAC2.cooling',
            MODE: 'matter.0.RoomAC2.mode',
        });

        done();
    });

    it(`${name} Must not detect a thermostat without any setpoint`, done => {
        const objects = {
            'matter.0.NoSet': { common: { name: 'Device' }, type: 'device' },
            'matter.0.NoSet.mode': {
                common: {
                    name: 'Mode',
                    type: 'number',
                    role: 'level.mode.airconditioner',
                    states: { 0: 'AUTO' },
                    read: true,
                    write: true,
                },
                type: 'state',
            },
        };

        const controls = detect(objects, { id: 'matter.0.NoSet' });

        expect(
            !(controls || []).some(({ type }) => type === Types.thermostat || type === Types.airCondition),
            'A device without any setpoint must be neither a thermostat nor an air conditioner',
        );

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

    it('Must detect forecast from pirate-weather including sunrise', done => {
        const controls = detect('./weather_pirate-weather.json', {
            id: 'pirate-weather.0.weather.daily',
        });

        const detectionDef = {
            ICON: 'pirate-weather.0.weather.daily.00.iconUrl',
            WIND_SPEED: 'pirate-weather.0.weather.daily.00.windSpeed',
            WIND_DIRECTION: 'pirate-weather.0.weather.daily.00.windBearing',
            WIND_DIRECTION_STR: 'pirate-weather.0.weather.daily.00.windBearingText',
            HUMIDITY: 'pirate-weather.0.weather.daily.00.humidity',
            PRESSURE: 'pirate-weather.0.weather.daily.00.pressure',
            TEMP_MIN: [
                'pirate-weather.0.weather.daily.00.temperatureMin',
                'pirate-weather.0.weather.daily.00.temperatureLow',
            ],
            TEMP_MAX: [
                'pirate-weather.0.weather.daily.00.temperatureMax',
                'pirate-weather.0.weather.daily.00.temperatureHigh',
            ],
            TIME_SUNRISE: 'pirate-weather.0.weather.daily.00.sunriseTime',
            TIME_SUNSET: 'pirate-weather.0.weather.daily.00.sunsetTime',
        };
        const days = [1, 2, 3, 4];
        for (const day of days) {
            detectionDef[`ICON${day}`] = `pirate-weather.0.weather.daily.0${day}.iconUrl`;
            detectionDef[`WIND_SPEED${day}`] = `pirate-weather.0.weather.daily.0${day}.windSpeed`;
            detectionDef[`WIND_DIRECTION${day}`] = `pirate-weather.0.weather.daily.0${day}.windBearing`;
            detectionDef[`WIND_DIRECTION_STR${day}`] = `pirate-weather.0.weather.daily.0${day}.windBearingText`;
            detectionDef[`HUMIDITY${day}`] = `pirate-weather.0.weather.daily.0${day}.humidity`;
            detectionDef[`PRESSURE${day}`] = `pirate-weather.0.weather.daily.0${day}.pressure`;
            detectionDef[`TEMP_MIN${day}`] = [
                `pirate-weather.0.weather.daily.0${day}.temperatureMin`,
                `pirate-weather.0.weather.daily.0${day}.temperatureLow`,
            ];
            detectionDef[`TEMP_MAX${day}`] = [
                `pirate-weather.0.weather.daily.0${day}.temperatureMax`,
                `pirate-weather.0.weather.daily.0${day}.temperatureHigh`,
            ];
            detectionDef[`TIME_SUNRISE${day}`] = `pirate-weather.0.weather.daily.0${day}.sunriseTime`;
            detectionDef[`TIME_SUNSET${day}`] = `pirate-weather.0.weather.daily.0${day}.sunsetTime`;
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
        expect(controls[0].states.filter(({ id }) => !!id).length === 2, 'Blind should have 2 states detected');

        validate(controls[1], Types.dimmer, {
            SET: 'hm-rpc.0.001658A99FD264.2.LEVEL',
        });
        expect(controls[1].states.filter(({ id }) => !!id).length === 1, 'Dimmer should have 1 state detected');

        validate(controls[2], Types.slider, {
            SET: 'hm-rpc.0.001658A99FD264.2.LEVEL',
        });
        expect(controls[2].states.filter(({ id }) => !!id).length === 1, 'Slider should have 1 state detected');

        validate(controls[3], Types.button, {
            SET: 'hm-rpc.0.001658A99FD264.2.STOP',
        });
        expect(controls[3].states.filter(({ id }) => !!id).length === 1, 'Button should have 1 state detected');

        done();
    });

    it(`${name} Must detect percentage correctly`, done => {
        const controls = detect('./percentage.json', {
            id: 'hm-rpc.0.001658A99FD264.2.PERCENTAGE',
        });

        validate(controls[0], Types.percentage, {
            SET: 'hm-rpc.0.001658A99FD264.2.PERCENTAGE',
        });

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
            DIRECTION_ENUM: 'hm-rpc.0.LEQ090XYZ.1.DIRECTION',
            ERROR: 'hm-rpc.0.LEQ090XYZ.1.ERROR',
        });

        done();
    });

    it(`${name} Must detect boolean and enum direction as separate states`, done => {
        const objects = {
            'test.0.Blind': {
                common: { name: 'Blind' },
                type: 'channel',
            },
            'test.0.Blind.level': {
                common: { name: 'Level', type: 'number', read: true, write: true, role: 'level.blind' },
                type: 'state',
            },
            'test.0.Blind.moving': {
                common: { name: 'Moving', type: 'boolean', read: true, write: false, role: 'indicator.direction' },
                type: 'state',
            },
            'test.0.Blind.direction': {
                common: {
                    name: 'Direction',
                    type: 'number',
                    read: true,
                    write: false,
                    role: 'value.direction',
                    states: { 0: 'None', 1: 'Up', 2: 'Down', 3: 'Unknown' },
                },
                type: 'state',
            },
        };

        const controls = detect(objects, { id: 'test.0.Blind' });

        validate(controls[0], Types.blind, {
            SET: 'test.0.Blind.level',
            DIRECTION: 'test.0.Blind.moving',
            DIRECTION_ENUM: 'test.0.Blind.direction',
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
            RSSI: 'hm-rpc.1.JEQ0XXXXXX.0.RSSI_PEER',
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
            RSSI: 'hm-rpc.1.JEQ0XXXXXX.0.RSSI_PEER',
        });

        options.id = 'hm-rpc.1.JEQ0XXXXXX.2';

        const controls2 = detect('./hm-thermostat.json', options);
        expect(controls2 === null, 'No controls expected');

        options.id = 'hm-rpc.1.JEQ0XXXXXX';

        const controls3 = detect('./hm-thermostat.json', options);
        expect(controls3 === null, 'No controls expected');

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
            limitTypesToOneOf: [[Types.rgb, Types.rgbSingle, Types.rgbwSingle, Types.hue]],
        });

        validate(controls[0], Types.hue, {
            HUE: 'zigbee.0.AAAAAAA.color_hs.hue',
            SATURATION: 'zigbee.0.AAAAAAA.color_hs.saturation',
            DIMMER: 'zigbee.0.AAAAAAA.brightness',
            TEMPERATURE: 'zigbee.0.AAAAAAA.colortemp',
            ON: 'zigbee.0.AAAAAAA.state',
        });

        expect(controls[1].type !== Types.rgb, 'type rgb should not be detected');
        expect(controls[2].type !== Types.rgbSingle, 'type rgbSingle should not be detected');

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
            ignoreEnums: true,
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
            ignoreEnums: true,
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
            ignoreEnums: true,
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
            ignoreEnums: true,
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
            ignoreEnums: true,
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
            ignoreEnums: true,
        });

        validate(controls[0], Types.window, {
            ACTUAL: 'test.0.window.a-opened',
        });

        done();
    });

    it('Must map a state that lost a slot to a later state of the same pattern', done => {
        const button = (name, role) => ({
            common: { name, type: 'boolean', role, read: true, write: false },
            type: 'state',
        });
        const objects = {
            'hm-rpc.0.Button': { common: { name: 'Button' }, type: 'channel' },
            'hm-rpc.0.Button.press': button('Press', 'button.press'),
            'hm-rpc.0.Button.long': button('Long press', 'button.long'),
        };

        const controls = detect(objects, { id: 'hm-rpc.0.Button' });

        validate(controls[0], Types.buttonSensor, {
            PRESS: 'hm-rpc.0.Button.press',
            PRESS_LONG: 'hm-rpc.0.Button.long',
        });

        done();
    });

    it('Must map a state that was rejected from an already filled slot', done => {
        const button = (name, role) => ({
            common: { name, type: 'boolean', role, read: true, write: false },
            type: 'state',
        });
        const objects = {
            'hm-rpc.0.Button2': { common: { name: 'Button' }, type: 'channel' },
            'hm-rpc.0.Button2.a-press': button('Press', 'button.press'),
            'hm-rpc.0.Button2.b-long': button('Long press', 'button.long'),
        };

        const controls = detect(objects, { id: 'hm-rpc.0.Button2' });

        validate(controls[0], Types.buttonSensor, {
            PRESS: 'hm-rpc.0.Button2.a-press',
            PRESS_LONG: 'hm-rpc.0.Button2.b-long',
        });

        done();
    });

    it('Must keep a state that no slot of the pattern could take', done => {
        const objects = {
            'ac.0.AC': { common: { name: 'AC' }, type: 'device' },
            'ac.0.AC.SET': {
                common: { name: 'SET', role: 'level.temperature', type: 'number', unit: '°C', read: true, write: true },
                type: 'state',
            },
            'ac.0.AC.MODE': {
                common: {
                    name: 'MODE',
                    role: 'level.mode.airconditioner',
                    type: 'number',
                    states: { 0: 'AUTO' },
                    read: true,
                    write: true,
                },
                type: 'state',
            },
            'ac.0.AC.swingNum': {
                common: {
                    name: 'swingNum',
                    role: 'level.mode.swing',
                    type: 'number',
                    states: { 0: 'AUTO' },
                    read: true,
                    write: true,
                },
                type: 'state',
            },
            'ac.0.AC.swingBool': {
                common: { name: 'swingBool', role: 'switch.mode.swing', type: 'boolean', read: true, write: true },
                type: 'state',
            },
        };

        const controls = detect(objects, { id: 'ac.0.AC' });

        validate(controls[0], Types.airCondition, {
            SET: 'ac.0.AC.SET',
            MODE: 'ac.0.AC.MODE',
            SWING: 'ac.0.AC.swingNum',
        });

        // The boolean SWING definition can never fill the slot the numeric one already took, so the state
        // must stay available to other device types instead of vanishing
        expect(
            controls.some(control => control.states.some(({ id }) => id === 'ac.0.AC.swingBool')),
            'Expected ac.0.AC.swingBool to still be detected',
        );

        done();
    });

    it('Must not offer a state that lost a slot to another device type', done => {
        const objects = {
            'test.0.window2': { common: { name: 'window' }, type: 'device' },
            'test.0.window2.x-contact': {
                common: { name: 'contact', type: 'boolean', role: 'state', read: true, write: false },
                type: 'state',
            },
            'test.0.window2.a-opened': {
                common: { name: 'opened', type: 'boolean', role: 'sensor.window', read: true, write: false },
                type: 'state',
            },
        };

        const controls = detect(objects, {
            id: 'test.0.window2',
            ignoreEnums: true,
        });

        expect(controls.length === 1, `Expected a single control but found ${controls.length}`);
        validate(controls[0], Types.window, {
            ACTUAL: 'test.0.window2.a-opened',
        });

        done();
    });

    it('Must detect dimmer with power switch', done => {
        const objects = require('./dimmer.json');

        const controls = detect(objects, {
            id: 'alias.0.Test-Devices.Dimmer.SET',
            ignoreEnums: true,
            detectParent: true,
        });
        const states = controls[0].states.filter(s => !!s.id);
        expect(states.length === 8, 'Should detect 8 states for dimmer with power switch');

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
            detectParent: true,
        });
        const states = controls[0].states.filter(s => !!s.id);
        expect(states.length === 5, 'Should detect 5 states for dimmer with power switch');

        validate(controls[0], Types.rgbSingle, {
            RGB: 'nanoleaf-lightpanels.3.Shapes.colorRGB',
            DIMMER: 'nanoleaf-lightpanels.3.Shapes.brightness',
            TEMPERATURE: 'nanoleaf-lightpanels.3.Shapes.colorTemp',
            ON: 'nanoleaf-lightpanels.3.Shapes.state',
            EFFECT: 'nanoleaf-lightpanels.3.Shapes.effect',
        });

        done();
    });

    it('Must detect Blinds from just one state', done => {
        const objects = require('./simpleBlind.json');

        const controls = detect(objects, {
            id: 'mqtt.0.vantage.obergeschoss.buro.blind.rollos.percent',
            ignoreEnums: true,
            detectParent: true,
        });
        const states = controls[0].states.filter(s => !!s.id);
        expect(states.length === 1, 'Should detect 1 state for dimmer with power switch');

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
        expect(states.length === 2, 'Should detect 2 states for dimmer with voltage and unreach');

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
        expect(states.length === 5, 'Should detect 5 states: hue, dimmer, saturation, temperature, on');

        validate(controls[0], Types.hue, {
            HUE: 'hue.0.Hue_Küche_Küchezeile.hue',
            DIMMER: 'hue.0.Hue_Küche_Küchezeile.level',
            SATURATION: 'hue.0.Hue_Küche_Küchezeile.sat',
            TEMPERATURE: 'hue.0.Hue_Küche_Küchezeile.ct',
            ON: 'hue.0.Hue_Küche_Küchezeile.on',
            EFFECT: undefined, //since state does not have common.states defined
        });

        done();
    });

    it('Must detect Shelly Dimmer as dimmer', done => {
        const objects = require('./shelly-dimmer.json');

        const controls = detect(objects, {
            id: 'shelly.0.SHDM-2#081234567896#1.lights.brightness',
            ignoreEnums: true,
            detectOnlyChannel: true,
            detectAllPossibleDevices: true,
        });
        const states = controls[0].states.filter(s => !!s.id);
        expect(states.length === 4, 'Should detect 5 states: hue, dimmer, saturation, temperature, on');

        validate(controls[0], Types.dimmer, {
            SET: 'shelly.0.SHDM-2#081234567896#1.lights.brightness',
            ON_SET: 'shelly.0.SHDM-2#081234567896#1.lights.Switch',
            ELECTRIC_POWER: 'shelly.0.SHDM-2#081234567896#1.lights.Power',
            CONSUMPTION: 'shelly.0.SHDM-2#081234567896#1.lights.Energy',
        });

        done();
    });
});
