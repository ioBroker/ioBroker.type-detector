# ioBroker.type-detector

This is not the adapter.
This is help function to detect devices from ioBroker states and channels.

You can find the description of devices in [DEVICES.md](DEVICES.md).

## How to use

You can use this module in Browser and in Node.js projects.

Just now this module used in material adapter to detect devices and to visualize them.

The following code detects devices in some state's tree:

```typescript
import ChannelDetector, { type DetectOptions, type Types } from '@iobroker/type-detector';
const detector: ChannelDetector = new ChannelDetector();

const keys = Object.keys(objects); // For optimization
const usedIds: string[] = []; // To not allow using of same ID in more than one device
const ignoreIndicators: string[] = ['UNREACH_STICKY']; // Ignore indicators by name
const allowedTypes: Types[] = ['button', 'rgb', 'dimmer', 'light']; // Supported types. Leave it null if you want to get ALL devices.

const options: DetectOptions = {
    objects: this.props.objects,
    id: 'hm-rpc.0.LEQ1214232.1', // Channel, device or state, that must be detected
    _keysOptional: keys,
    _usedIdsOptional: usedIds,
    ignoreIndicators,
    // allowedTypes,
};

let controls: PatternControl[] = detector.detect(options);
if (controls) {
    controls = controls.map((control: PatternControl) => {
        const id = control.states.find((state: DetectorState) => state.id).id;
        if (id) {
            console.log(`In ${options.id} was detected "${control.type}" with following states:`);
            control.states
                .filter((state: DetectorState) => state.id)
                .forEach((state: DetectorState) => {
                    console.log(`    ${state.name} => ${state.id}`);
                });

            return { control, id };
        }
    });
} else {
    console.log(`Nothing found for ${options.id}`);
}
```

```javascript
// Legacy
const { ChannelDetector } = require('iobroker.type-detector');
const detector = new ChannelDetector();

const keys = Object.keys(objects); // For optimization
const usedIds = []; // To not allow using of same ID in more than one device
const ignoreIndicators = ['UNREACH_STICKY']; // Ignore indicators by name
const allowedTypes = ['button', 'rgb', 'dimmer', 'light']; // Supported types. Leave it null if you want to get ALL devices.

const options = {
    objects: this.props.objects,
    id: 'hm-rpc.0.LEQ1214232.1', // Channel, device or state, that must be detected
    _keysOptional: keys,
    _usedIdsOptional: usedIds,
    ignoreIndicators,
    //    allowedTypes,
};

let controls = detector.detect(options);
if (controls) {
    controls = controls.map(control => {
        const id = control.states.find(state => state.id).id;
        if (id) {
            console.log(`In ${options.id} was detected "${control.type}" with following states:`);
            control.states
                .filter(state => state.id)
                .forEach(state => {
                    console.log(`    ${state.name} => ${state.id}`);
                });

            return { control, id };
        }
    });
} else {
    console.log(`Nothing found for ${options.id}`);
}
```

<!--
	Placeholder for the next version (at the beginning of the line):
	### **WORK IN PROGRESS**
-->

## Changelog
### 4.6.4 (2025-11-28)
-   (@GermanBluefox) Added GUI to test the objects
-   (@GermanBluefox) windowTilt and window requires now to have "write"=false explicitly to be detected

### 4.6.2 (2025-10-23)
-   (@GermanBluefox) Improved detection of devices if the structure has more than one control inside

### 4.6.1 (2025-10-21)
-   (@GermanBluefox) Added new flag to detect only in the current channel (one level)

### 4.6.0 (2025-10-19)
-   (@GermanBluefox) Correcting detection of states consists only of one state

### 4.5.1 (2025-07-21)
-   (@Apollon77) ignore "setting" roles in some cases to ensure correct detection
-   (@GermanBluefox) added potential error handling for detection

### 4.5.0 (2025-04-29)
-   (@Apollon77) Enhance detection logic when multiple states are detected in the same pattern-state to favor ID, default-role and number-of-role-levels and not "state" roles

### 4.4.0 (2025-04-27)
-   (@Apollon77) Added detection option `limitTypesToOneOf` to define limiting sets of detected types

### 4.3.1 (2025-04-22)
-   (@GermanBluefox) Rename type `location_one` to `locationOne`

### 4.3.0 (2025-04-21)
-   (@GermanBluefox) Added default role for `image`
-   (@GermanBluefox) Added exported type `ExternalDetectorState`
-   (@Apollon77) Removed "Saturation" states from non-Hue light device types to not block that state for detection
-   (@Apollon77) Added default unit "%" to volume definitions
-   (@Apollon77) Combined some duplicate state definitions
-   (@Apollon77) Adjusted Airconditioner Mode definition
-   (@Apollon77) Optimized Detection logic in several places
-   (@Apollon77) Consider allowed/excluded types when returning cached results
-   (@Apollon77) Added "detectParent" mode to always search up in the objects to a device or channel when detecting
-   (@Apollon77) Added "prioritizedTypes" property for options to allow type detection prioritization
-   (@GermanBluefox) Improved documentation

### 4.2.1 (2025-04-19)
-   (@GermanBluefox) Added exported type `ExternalPatternControl` 
-   (@GermanBluefox) Updated packages

### 4.2.0 (2025-01-31)
-   (@GermanBluefox) Added detection of `level.direction`
-   (@Apollon77) Added door state for device type "lock"
-   (@Apollon77) Added default unit for volume states
-   (@Apollon77) Added new option ignoreEnums to execute the detection without enums-matching logic
-   (@Apollon77) Added new option detectAllPossibleDevices to detect multiple devices in one run without checking for already used IDs
-   (@Garfonso) Added missing default roles and units for saturation

### 4.1.1 (2024-12-15)
-   (@Apollon77) Fixed default unit for Illuminance to "lux"
-   (@Apollon77) Added Low-Battery state for switch to be consistent with other devices

### 4.1.0 (2024-12-06)

-   (@Garfonso) Added new device type - illuminance (brightness sensor)
-   (@Garfonso) Added battery state
-   (@Garfonso) Added the transition time state
-   (@Garfonso) Allowed the mixed `device->state` and `device->channel->state` structures
-   (@GermanBluefox) Used a new eslint config library
-   (@GermanBluefox) Types were slightly changed
-   (Apollon77) Removed File state type
-   (Apollon77) Adjusted Camera states to remove Binary state and replace by link
-   (Apollon77) Fixed role for ACTUAL state for socket

### 4.0.1 (2024-07-26)

-   (Apollon77) Fix Electricity states for light type
-   (Apollon77) Add Electricity states for more types
-   (Apollon77) Internal Refactoring

### 3.0.5 (2023-10-24)

-   (bluefox) Implemented `@iobroker/type-detector` as npm module

### 2.0.6 (2023-10-18)

-   (bluefox) Removed `valve` and `url` as types (they just a `slider` and `image`)

### 2.0.4 (2023-10-13)

-   (bluefox) Removed multiple for weather location

### 2.0.3 (2023-10-09)

-   (Garfonso) Changed detection of fire and flood sensors
-   (Garfonso) Changed the role of TIME_SUNRISE and TIME_SUNSET

### 2.0.2 (2023-09-04)

-   (Garfonso) Added `rgbwSingle` device to types

### 2.0.1 (2023-08-21)

-   (bluefox) Added `rgbwSingle` device

### 2.0.0 (2023-08-21)

-   (bluefox) Removed `rgbOld` type from 2018

### 1.1.2 (2023-06-06)

-   (bluefox) Fixed creation of the `DEVICES.md`
-   (bluefox) Fixed the main attribute in package.json
-   (bluefox) Better detection of the door devices

### 1.1.1 (2022-11-09)

-   (Garfonso) corrected the double states in light devices
-   (Garfonso) added CIE color type as equivalent to `rgbSingle` type

### 1.1.0 (2022-05-22)

-   (Garfonso) blinds: corrected error in the default role for tilt

### 1.0.17 (2022-01-20)

-   (bluefox) Fixed the main attribute in package.json

### 1.0.15 (2021-07-09)

-   (algar42) extend the weather forecast device with `TIME_SUNRISE` and `TIME_SUNSET`
-   (Garfonso) added weatherForecast tests

### 1.0.14 (2021-06-30)

-   (bluefox) Added chart device

### 1.0.13 (2021-06-27)

-   (bluefox) Changed the air conditioner detection
-   (Garfonso) Corrected blind with buttons

### 1.0.12 (2021-06-16)

-   (bluefox) Changed the air conditioner detection
-   (Garfonso) Corrected blind with buttons

### 1.0.11 (2021-06-11)

-   (Garfonso) Added buttons to blinds and added THE new type: blinds with only buttons
-   (agross) refactoring
-   (bluefox) Extend socket and light with electricity parameters

### 1.0.10 (2021-06-07)

-   (bluefox) Added some states to thermostat

### 1.0.9 (2021-06-06)

-   (bluefox) Added new types: gate, camera, flood alarm, current weather.

### 1.0.8 (2021-03-11)

-   (bluefox) Escape chars in IDs.

### 1.0.7 (2020-08-12)

-   (bluefox) Added the vacuum cleaner.

### 1.0.4 (2020-08-12)

-   (bluefox) Added the air conditioner.

### 1.0.0 (2020-08-10)

-   (Garfonso) The switch could have the boolean type
-   (Garfonso) Fixed `level.dimspeed` issue

### 0.1.10 (2020-06-23)

-   (bluefox) Ignore `level.dimspeed` for dimmer
-   (bluefox) Added new type `button.press`

### 0.1.9 (2020-01-12)

-   (Garfonso) Added "white" to rgb

### 0.1.7 (2019-08-14)

-   (bluefox) Add default roles

### 0.1.5 (2019-07-23)

-   (bluefox) Fixed search for multiple items.

### 0.1.4 (2019-07-19)

-   (bluefox) Added function "getPatterns".

### 0.1.3 (2019-07-16)

-   (bluefox) Add description to function "detect".

### 0.1.1 (2019-06-29)

-   (kirovilya) In some cases, devices may not have channels, but immediately have a states. For example, in the zigbee-adapter.

### 0.1.1 (2019-05-24)

-   (bluefox) added PRECIPITATION to weather
-   (bluefox) added location detection

### 0.1.0 (2018-08-14)

-   (bluefox) initial commit

## License

Copyright (c) 2018-2025 Denis Haev <dogafox@gmail.com>

MIT License
