# ioBroker.type-detector

This is not the adapter. This is help function to detect devices from ioBroker states and channels.

## How to use
You can use this module in Browser and in Node.js projects. 

Just now this module used in material adapter to detect devices and to visualize them.

Following code detect devices in some state's tree.

```javascript
// 
const ChannelDetector = require('iobroker.type-detector');
const detector = new ChannelDetector();

const keys = Object.keys(objects);				// For optimization
const usedIds = [];                 			// To not allow using of same ID in more than one device
const ignoreIndicators = ['UNREACH_STICKY'];    // Ignore indicators by name
const supportedTypes = ['button', 'rgb', 'dimmer', 'light'];	// Supported types. Leave it null if you want to get ALL devices.

const options = {
	objects:            this.props.objects,
	id:                 'hm-rpc.0.LEQ1214232.1',
	_keysOptional:      keys,
	_usedIdsOptional:   usedIds,
	ignoreIndicators
};

let controls = detector.detect(options);
if (controls) {
	controls = controls.map(control => {
		const id = control.states.find(state => state.id).id;
		if (id) {
			console.log(`In ${options.id} was detected "${control.type}" with following states:`);
			control.states.forEach(state => {
				if (state.id) {
					console.log(`    ${state.name} => ${state.id}`);
				}
			});

			return {control, id};
		}
	});
} else {
	console.log(`Nothing found for ${options.id}`);
}
```


## Description
Following devices can be detected:


### Media player

### Weather forecast

### RGB color

### Warnings

### Thermostat

### Blinds

### Motion detector

### Window

### Window with tilted position

### Fire alarm

### Door

### Dimmer

### Light

### Volume

### Group volume

### Level slider

### Socket

### Button

### Temperature

### Info

<!--
	Placeholder for the next version (at the beginning of the line):
	### __WORK IN PROGRESS__
-->

## Changelog
### __WORK IN PROGRESS__
* (bluefox) Added new types: gate, camera, flood alarm, current weather.

### 1.0.8 (2021-03-11)
* (bluefox) Escape chars in IDs.

### 1.0.7 (2020-08-12)
* (bluefox) Added the vacuum cleaner.

### 1.0.4 (2020-08-12)
* (bluefox) Added the air conditioner.

### 1.0.0 (2020-08-10)
* (Garfonso) The switch could have the boolean type 
* (Garfonso) Fixed level.dimspeed issue

### 0.1.10 (2020-06-23)
* (bluefox) Ignore level.dimspeed for dimmer
* (bluefox) Add new type button.press

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
* (kirovilya) In some cases, devices may not have channels, but immediately have a states. For example in the zigbee-adapter.

### 0.1.1 (2019-05-24)
* (bluefox) add PRECIPITATION to weather
* (bluefox) add location detection

### 0.1.0 (2018-08-14)
* (bluefox) initial commit



## License

Copyright (c) 2018-2020 Bluefox <dogafox@gmail.com>

MIT License
