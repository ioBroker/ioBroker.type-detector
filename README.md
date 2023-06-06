# ioBroker.type-detector
This is not the adapter. 
This is help function to detect devices from ioBroker states and channels.

You can find the description of devices in [DEVICES.md](DEVICES.md).

## How to use
You can use this module in Browser and in Node.js projects. 

Just now this module used in material adapter to detect devices and to visualize them.

The following code detects devices in some state's tree:

```javascript
// 
const ChannelDetector = require('iobroker.type-detector');
const detector = new ChannelDetector();

const keys = Object.keys(objects);				// For optimization
const usedIds = [];                 			// To not allow using of same ID in more than one device
const ignoreIndicators = ['UNREACH_STICKY'];    // Ignore indicators by name
const allowedTypes = ['button', 'rgb', 'dimmer', 'light'];	// Supported types. Leave it null if you want to get ALL devices.

const options = {
	objects:            this.props.objects,
	id:                 'hm-rpc.0.LEQ1214232.1', // Channel, device or state, that must be detected
	_keysOptional:      keys,
	_usedIdsOptional:   usedIds,
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

			return {control, id};
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
### 1.1.2 (2023-06-06)    
* (bluefox) Fixed creation of the `DEVICES.md`
* (bluefox) Fixed the main attribute in package.json
* (bluefox) Better detection of the door devices

### 1.1.1 (2022-11-09)
* (Garfonso) corrected the double states in light devices
* (Garfonso) added CIE color type as equivalent to `rgbSingle` type

### 1.1.0 (2022-05-22)
* (Garfonso) blinds: corrected error in the default role for tilt

### 1.0.17 (2022-01-20)
* (bluefox) Fixed the main attribute in package.json

### 1.0.15 (2021-07-09)
* (algar42) extend the weather forecast device with `TIME_SUNRISE` and `TIME_SUNSET`
* (Garfonso) added weatherForecast tests

### 1.0.14 (2021-06-30)
* (bluefox) Added chart device

### 1.0.13 (2021-06-27)
* (bluefox) Changed the air conditioner detection
* (Garfonso) Corrected blind with buttons

### 1.0.12 (2021-06-16)
* (bluefox) Changed the air conditioner detection
* (Garfonso) Corrected blind with buttons

### 1.0.11 (2021-06-11)
* (Garfonso) Added buttons to blinds and added THE new type: blinds with only buttons
* (agross) refactoring
* (bluefox) Extend socket and light with electricity parameters

### 1.0.10 (2021-06-07)
* (bluefox) Added some states to thermostat

### 1.0.9 (2021-06-06)
* (bluefox) Added new types: gate, camera, flood alarm, current weather.

### 1.0.8 (2021-03-11)
* (bluefox) Escape chars in IDs.

### 1.0.7 (2020-08-12)
* (bluefox) Added the vacuum cleaner.

### 1.0.4 (2020-08-12)
* (bluefox) Added the air conditioner.

### 1.0.0 (2020-08-10)
* (Garfonso) The switch could have the boolean type 
* (Garfonso) Fixed `level.dimspeed` issue

### 0.1.10 (2020-06-23)
* (bluefox) Ignore `level.dimspeed` for dimmer
* (bluefox) Added new type `button.press`

### 0.1.9 (2020-01-12)
* (Garfonso) Added "white" to rgb

### 0.1.7 (2019-08-14)
* (bluefox) Add default roles

### 0.1.5 (2019-07-23)
* (bluefox) Fixed search for multiple items.

### 0.1.4 (2019-07-19)
* (bluefox) Added function "getPatterns".

### 0.1.3 (2019-07-16)
* (bluefox) Add description to function "detect".

### 0.1.1 (2019-06-29)
* (kirovilya) In some cases, devices may not have channels, but immediately have a states. For example, in the zigbee-adapter.

### 0.1.1 (2019-05-24)
* (bluefox) added PRECIPITATION to weather
* (bluefox) added location detection

### 0.1.0 (2018-08-14)
* (bluefox) initial commit

## License
Copyright (c) 2018-2023 Bluefox <dogafox@gmail.com>

MIT License
