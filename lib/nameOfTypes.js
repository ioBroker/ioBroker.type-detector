const NameOfTypes = {
    unknown: { label: 'unknown', description: 'Unknown type' },

    airCondition: { label: 'Air conditioner', description: 'Air conditioner with warming and cooling functions.' },
    blind: { label: 'Blinds or Shutter', description: 'Blinds, Shutter, Jalousie controlled by state with percent.' },
    blindButtons: { label: 'Blinds controlled only by buttons', description: 'Blinds, Shutter, Jalousie controlled by stop, up, down buttons. Position is unknown.' },
    button: { label: 'Button', description: 'Button that could be only pressed (command). It has no feedback, you can write only `true`.' },
    buttonSensor: { label: 'Contact or button with feedback', description: 'Button with feedback. It is known if the button pressed or not.' },
    camera: { label: 'IP Camera', description: 'IP/Web Camera.' },
    chart: { label: 'Chart', description: 'Chart with e-charts template.' },
    cie: { label: 'CIE Color space', description: 'Light with CIE (International Commission on Illumination) color space (XY).' },
    ct: { label: 'Light with color temperature', description: 'Light, where the color is set by color temperature (normally from 2700°K (warm-white) to 6000°K (cold-white)).' },
    dimmer: { label: 'Light dimmer', description: 'Dimmer, that is controlled by state (normally from 0 to 100 %, but it could be any limits).' },
    door: { label: 'Door sensor', description: 'Sensor if the door opened (true) or closed (false).' },
    fireAlarm: { label: 'Fire alarm sensor', description: 'If smoke/fire sensor is alarmed (true) or not (false).' },
    floodAlarm: { label: 'Flood alarm sensor', description: 'If water sensor senses water (true) or not (false).' },
    gate: { label: 'Gate', description: 'Control of the gates. You can open (true) or close (false) the gate. Optionally, the exact position could exist.' },
    hue: { label: 'Light with HUE color', description: 'HUE light from 0° to 360°.' },
    humidity: { label: 'Humidity', description: 'Air humidity in %.' },
    illuminance: { label: 'Illuminance sensor', description: 'Illuminance sensor (normally in lux).' },
    info: { label: 'Information device (very simple)', description: 'Many information states could be combined under this device, e.g., current, amperage, power in one device.' },
    image: { label: 'Image', description: 'URL for image.' },
    instance: { label: 'Instance', description: 'Instance information (for internal use).' },
    light: { label: 'Light switch', description: 'Light with only ON/OFF options. Could have information about current, amperage, energy and power.' },
    location: { label: 'GPS Location (longitude, latitude)', description: 'GPS location, where longitude and latitude are stored in two different states.' },
    locationOne: { label: 'GPS Location in single state', description: 'GPS location, where longitude and latitude are stored in one state, like `longitude;latitude` - `8.40435;49.013506`.' },
    lock: { label: 'Lock', description: 'Lock. Could be opened (true), closed (false) or opened completely by `OPEN` state.' },
    media: { label: 'Media player', description: '' },
    motion: { label: 'Motion sensor', description: '' },
    rgb: { label: 'RGB Light', description: 'RGB(W) light with one state of color. Could be HEX #RRGGBB, or rgb(0-255,0-255,0-255).' },
    rgbSingle: { label: 'R,G,B Light with different states', description: 'RGB light with different states for every color. The value is from 0 to 255.' },
    rgbwSingle: { label: 'R,G,B,W Light  with different states', description: 'RGBW light with different states for every color. The value is from 0 to 255 for red, green, blue and white.' },
    slider: { label: 'Slider', description: 'Slider with position set by number. Could be used for any device that is controlled by numeric value. Limits could be defined by `min`, `max` attributes. Normally from 0 (off) to 100 (full power).' },
    socket: { label: 'Socket', description: 'Socket with an ON/OFF option. Could have information about current, amperage, energy and power.' },
    temperature: { label: 'Temperature', description: 'Combined temperature and humidity sensor. Humidity is optional.' },
    thermostat: { label: 'Thermostat', description: 'Thermostat to be controlled by the desired temperature. Could have mode.' },
    vacuumCleaner: { label: 'Vacuum cleaner (robot)', description: '' },
    volume: { label: 'Volume', description: 'Sound volume.' },
    volumeGroup: { label: 'Volume group', description: 'Group of volumes.' },
    warning: { label: 'Warning', description: 'Just sensor if alarm should be shown.' },
    weatherCurrent: { label: 'Current weather', description: '' },
    weatherForecast: { label: 'Weather forecast', description: '' },
    window: { label: 'Window sensor', description: 'Window sensor: opened - true, closed - false.' },
    windowTilt: { label: 'Window that could be in tilted state', description: 'Window tilt sensor: closed - 0, opened - 1, tiled - 2.' },
};

module.exports = NameOfTypes;
