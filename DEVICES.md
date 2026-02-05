# ioBroker device types

**Note:** Do not copy regex with '|' from tables. It contains Unicode replacement of '|', because of Markdown's table rendering. 

Fields:
- **R** - (required) If the state is mandatory and must be in the channel/device.
- **Name** - Name describes the function of a state in a channel or in a device and is not 
  connected to the name of the ioBroker state. 
  Important is that role, enum, type, and write attribute are the same as in the table.
- **Role** - Optimal role of the state. But it could vary. Check the regex to be sure if the role is suitable.
- **Unit** - Desired unit. After the slash is a *required unit*.
- **Type** - Required type
- **Wr** - (writable) Is the state must be writable or not. 'W' - must be writable, '-' - must be not writeable.
- **Min** - State must have min attribute.
- **Max** - State must have max attribute.
- **Enum** - State must belong to a specific category
- **Ind** - Is the state is an indicator. Indicators will be shown as a small icon in material.
- **Multi** - (multiple) the state with given parameters can appear more than one time in a device. E.g., weather day 1, weather day 1, and so on.
- **Regex** - Role regex

Restrictions:
- Blinds are always opened with 100% and closed with 0%.
- Switch is always boolean and so can have only `true` and `false` values. Not `0 / 1` or `ON / OFF`.

What is not important for detection:
- Name - name of functionality in the device 
- noSubscribe - says to `material` adapter, that there is no need to monitor its value. E.g., it is button. 
- inverted - says to material, that indicator must be shown only if the value is `false`.
- defaultStates - Used for `devices` to set the default `common.states`.
- defaultRole - Used for `devices` to set the `common.role` by creation.
- defaultUnit - Used for `devices` to set the `common.unit` by creation.
- defaultType - Used for `devices` to set the `common.type` by creation.

## Devices
In [brackets] is given the class name of a device.

### Content
* [Air conditioner [airCondition]](#air-conditioner-aircondition)
* [Blinds controlled only by buttons [blindButtons]](#blinds-controlled-only-by-buttons-blindbuttons)
* [Blinds or Shutter [blinds]](#blinds-or-shutter-blinds)
* [Button [button]](#button-button)
* [Contact or button with feedback [buttonSensor]](#contact-or-button-with-feedback-buttonsensor)
* [IP Camera [camera]](#ip-camera-camera)
* [Chart [chart]](#chart-chart)
* [CIE Color space [cie]](#cie-color-space-cie)
* [Light with color temperature [ct]](#light-with-color-temperature-ct)
* [Light dimmer [dimmer]](#light-dimmer-dimmer)
* [Door sensor [door]](#door-sensor-door)
* [Fire alarm sensor [fireAlarm]](#fire-alarm-sensor-firealarm)
* [Flood alarm sensor [floodAlarm]](#flood-alarm-sensor-floodalarm)
* [Gate [gate]](#gate-gate)
* [Light with HUE color [hue]](#light-with-hue-color-hue)
* [Humidity [humidity]](#humidity-humidity)
* [Illuminance sensor [illuminance]](#illuminance-sensor-illuminance)
* [Image [image]](#image-image)
* [Information device (very simple) [info]](#information-device--very-simple--info)
* [Slider [levelSlider]](#slider-levelslider)
* [Light switch [light]](#light-switch-light)
* [GPS Location (longitude, latitude) [location]](#gps-location--longitude--latitude--location)
* [GPS Location in single state [locationOne]](#gps-location-in-single-state-locationone)
* [Lock [lock]](#lock-lock)
* [Media player [mediaPlayer]](#media-player-mediaplayer)
* [Motion sensor [motion]](#motion-sensor-motion)
* [Percentage slider [percentage]](#percentage-slider-percentage)
* [RGB(W) Light with different states for every color [rgb]](#rgb-w--light-with-different-states-for-every-color-rgb)
* [RGB Light Single [rgbSingle]](#rgb-light-single-rgbsingle)
* [RGBW Light Single [rgbwSingle]](#rgbw-light-single-rgbwsingle)
* [Socket [socket]](#socket-socket)
* [Temperature [temperature]](#temperature-temperature)
* [Thermostat [thermostat]](#thermostat-thermostat)
* [Vacuum cleaner (robot) [vacuumCleaner]](#vacuum-cleaner--robot--vacuumcleaner)
* [Volume [volume]](#volume-volume)
* [Volume group [volumeGroup]](#volume-group-volumegroup)
* [Warning [warning]](#warning-warning)
* [Current weather [weatherCurrent]](#current-weather-weathercurrent)
* [Weather forecast [weatherForecast]](#weather-forecast-weatherforecast)
* [Window sensor [window]](#window-sensor-window)
* [Window that could be in tilted state [windowTilt]](#window-that-could-be-in-tilted-state-windowtilt)

### Air conditioner [airCondition]

Air conditioner with warming and cooling functions.

| R | Name           | Role                          | Unit | Type           | Wr | Ind | Multi | Regex                                    |
|---|----------------|-------------------------------|------|----------------|----|-----|-------|------------------------------------------|
| * | SET            | level.temperature             | °C   | number         | W  |     |       | `/temperature(\..*)?$/`                  |
| * | MODE           | level.mode.airconditioner     |      | number         | W  |     |       | `/(level\.mode\.)?airconditioner$/`      |
|   | SPEED          | level.mode.fan                |      | number         | W  |     |       | `/(speed｜mode)\.fan$/`                   |
|   | POWER          | switch.power                  |      | boolean/number | W  |     |       | `/^switch(\.power)?$/`                   |
|   | ACTUAL         | value.temperature             | °C   | number         | -  |     |       | `/temperature(\..*)?$/`                  |
|   | HUMIDITY       | value.humidity                | %    | number         | -  |     |       | `/humidity(\..*)?$/`                     |
|   | BOOST          | switch.boost                  |      | boolean/number | W  |     |       | `/^switch\.boost(\..*)?$/`               |
|   | SWING          | level.mode.swing              |      | number         | W  |     |       | `/swing$/`                               |
|   | SWING          | switch.mode.swing             |      | boolean        | W  |     |       | `/swing$/`                               |
|   | ELECTRIC_POWER | value.power                   | W    | number         | -  |     |       | `/^value\.power$/`                       |
|   | CURRENT        | value.current                 | mA   | number         | -  |     |       | `/^value\.current$/`                     |
|   | VOLTAGE        | value.voltage                 | V    | number         | -  |     |       | `/^value\.voltage$/`                     |
|   | CONSUMPTION    | value.power.consumption       | Wh   | number         | -  |     |       | `/^value\.power\.consumption$/`          |
|   | FREQUENCY      | value.frequency               | Hz   | number         | -  |     |       | `/^value\.frequency$/`                   |
|   | UNREACH        | indicator.maintenance.unreach |      | boolean        |    | X   |       | `/^indicator(\.maintenance)?\.unreach$/` |
|   | MAINTAIN       | indicator.maintenance         |      | boolean        |    | X   |       | `/^indicator\.maintenance$/`             |
|   | ERROR          | indicator.error               |      |                |    | X   |       | `/^indicator\.error$/`                   |


### Blinds controlled only by buttons [blindButtons]

Blinds, Shutter, Jalousie controlled by stop, up, down buttons. Position is unknown.

| R | Name        | Role                          | Unit | Type    | Wr | Enum | Ind | Multi | Regex                                             |
|---|-------------|-------------------------------|------|---------|----|------|-----|-------|---------------------------------------------------|
| * | STOP        | button.stop.blind             |      | boolean | W  | E    |     |       | `/^(button｜action)\.stop(\.blind)?$/`             |
| * | OPEN        | button.open.blind             |      | boolean | W  | E    |     |       | `/^(button｜action)\.open(\.blind)?$/`             |
| * | CLOSE       | button.close.blind            |      | boolean | W  | E    |     |       | `/^(button｜action)\.close(\.blind)?$/`            |
|   | TILT_SET    | level.tilt                    |      | number  | W  | E    |     |       | `/^level\.tilt$/`                                 |
|   | TILT_ACTUAL | value.tilt                    |      | number  |    | E    |     |       | `/^value\.tilt$/`                                 |
|   | TILT_STOP   | button.stop.tilt              |      | boolean | W  | E    |     |       | `/^(button｜action)\.stop\.tilt$/`                 |
|   | TILT_OPEN   | button.open.tilt              |      | boolean | W  | E    |     |       | `/^(button｜action)\.open\.tilt$/`                 |
|   | TILT_CLOSE  | button.close.tilt             |      | boolean | W  | E    |     |       | `/^(button｜action)\.close\.tilt$/`                |
|   | DIRECTION   | indicator.direction           |      | boolean |    |      | X   |       | `/^indicator\.direction$/`                        |
|   | DIRECTION   | value.direction               |      | number  |    |      |     |       | `/^(indicator｜value)\.direction$/`                |
|   | WORKING     | indicator.working             |      |         |    |      | X   |       | `/^indicator\.working$/`                          |
|   | UNREACH     | indicator.maintenance.unreach |      | boolean |    |      | X   |       | `/^indicator(\.maintenance)?\.unreach$/`          |
|   | LOWBAT      | indicator.maintenance.lowbat  |      | boolean |    |      | X   |       | `/^indicator(\.maintenance)?\.(lowbat｜battery)$/` |
|   | MAINTAIN    | indicator.maintenance         |      | boolean |    |      | X   |       | `/^indicator\.maintenance$/`                      |
|   | ERROR       | indicator.error               |      |         |    |      | X   |       | `/^indicator\.error$/`                            |
|   | BATTERY     | value.battery                 | %    | number  | -  |      |     |       | `/^value\.battery$/`                              |


### Blinds or Shutter [blinds]

Blinds, Shutter, Jalousie controlled by state with percent.

| R | Name        | Role                          | Unit | Type    | Wr | Enum | Ind | Multi | Regex                                             |
|---|-------------|-------------------------------|------|---------|----|------|-----|-------|---------------------------------------------------|
| * | SET         | level.blind                   | %    | number  | W  | E    |     |       | `/^level(\.blind)?$/`                             |
|   | ACTUAL      | value.blind                   | %    | number  |    | E    |     |       | `/^value(\.blind)?$/`                             |
|   | STOP        | button.stop.blind             |      | boolean | W  | E    |     |       | `/^(button｜action)\.stop(\.blind)?$/`             |
|   | OPEN        | button.open.blind             |      | boolean | W  | E    |     |       | `/^(button｜action)\.open(\.blind)?$/`             |
|   | CLOSE       | button.close.blind            |      | boolean | W  | E    |     |       | `/^(button｜action)\.close(\.blind)?$/`            |
|   | TILT_SET    | level.tilt                    |      | number  | W  | E    |     |       | `/^level(\.open)?\.tilt$/`                        |
|   | TILT_ACTUAL | value.tilt                    |      | number  |    | E    |     |       | `/^value(\.open)?\.tilt$/`                        |
|   | TILT_STOP   | button.stop.tilt              |      | boolean | W  | E    |     |       | `/^(button｜action)\.stop\.tilt$/`                 |
|   | TILT_OPEN   | button.open.tilt              |      | boolean | W  | E    |     |       | `/^(button｜action)\.open\.tilt$/`                 |
|   | TILT_CLOSE  | button.close.tilt             |      | boolean | W  | E    |     |       | `/^(button｜action)\.close\.tilt$/`                |
|   | DIRECTION   | indicator.direction           |      | boolean |    |      | X   |       | `/^indicator\.direction$/`                        |
|   | DIRECTION   | value.direction               |      | number  |    |      |     |       | `/^(indicator｜value)\.direction$/`                |
|   | WORKING     | indicator.working             |      |         |    |      | X   |       | `/^indicator\.working$/`                          |
|   | UNREACH     | indicator.maintenance.unreach |      | boolean |    |      | X   |       | `/^indicator(\.maintenance)?\.unreach$/`          |
|   | LOWBAT      | indicator.maintenance.lowbat  |      | boolean |    |      | X   |       | `/^indicator(\.maintenance)?\.(lowbat｜battery)$/` |
|   | MAINTAIN    | indicator.maintenance         |      | boolean |    |      | X   |       | `/^indicator\.maintenance$/`                      |
|   | ERROR       | indicator.error               |      |         |    |      | X   |       | `/^indicator\.error$/`                            |
|   | BATTERY     | value.battery                 | %    | number  | -  |      |     |       | `/^value\.battery$/`                              |


### Button [button]

Button that could be only pressed (command). It has no feedback, you can write only `true`.

| R | Name     | Role                          | Unit | Type    | Wr | Ind | Multi | Regex                                             |
|---|----------|-------------------------------|------|---------|----|-----|-------|---------------------------------------------------|
| * | SET      | button                        |      | boolean | W  |     |       | `/^(button｜action)(\.[.\w]+)?$/`                  |
|   | UNREACH  | indicator.maintenance.unreach |      | boolean |    | X   |       | `/^indicator(\.maintenance)?\.unreach$/`          |
|   | LOWBAT   | indicator.maintenance.lowbat  |      | boolean |    | X   |       | `/^indicator(\.maintenance)?\.(lowbat｜battery)$/` |
|   | MAINTAIN | indicator.maintenance         |      | boolean |    | X   |       | `/^indicator\.maintenance$/`                      |
|   | ERROR    | indicator.error               |      |         |    | X   |       | `/^indicator\.error$/`                            |
|   | BATTERY  | value.battery                 | %    | number  | -  |     |       | `/^value\.battery$/`                              |


### Contact or button with feedback [buttonSensor]

Button with feedback. It is known if the button pressed or not.

| R | Name       | Role                          | Unit | Type    | Wr | Ind | Multi | Regex                                             |
|---|------------|-------------------------------|------|---------|----|-----|-------|---------------------------------------------------|
| * | PRESS      | button.press                  |      | boolean | -  |     |       | `/^button(\.[.\w]+)?$/`                           |
|   | PRESS_LONG | button.long                   |      | boolean | -  |     |       | `/^button\.long/`                                 |
|   | UNREACH    | indicator.maintenance.unreach |      | boolean |    | X   |       | `/^indicator(\.maintenance)?\.unreach$/`          |
|   | LOWBAT     | indicator.maintenance.lowbat  |      | boolean |    | X   |       | `/^indicator(\.maintenance)?\.(lowbat｜battery)$/` |
|   | MAINTAIN   | indicator.maintenance         |      | boolean |    | X   |       | `/^indicator\.maintenance$/`                      |
|   | ERROR      | indicator.error               |      |         |    | X   |       | `/^indicator\.error$/`                            |
|   | BATTERY    | value.battery                 | %    | number  | -  |     |       | `/^value\.battery$/`                              |


### IP Camera [camera]

IP/Web Camera.

| R | Name             | Role                           | Unit | Type    | Wr | Ind | Multi | Regex                                                      |
|---|------------------|--------------------------------|------|---------|----|-----|-------|------------------------------------------------------------|
| * | URL              | link.camera                    |      | string  |    |     |       | `/^link\.camera(\.\w+)?$/`                                 |
|   | AUTOFOCUS        | switch.camera.autofocus        |      | boolean | W  |     |       | `/^switch(\.camera)?\.autofocus$/`                         |
|   | AUTOWHITEBALANCE | switch.camera.autowhitebalance |      | boolean | W  |     |       | `/^switch(\.camera)?\.autowhitebalance$/`                  |
|   | BRIGHTNESS       | switch.camera.brightness       |      | boolean | W  |     |       | `/^switch(\.camera)?\.brightness$/`                        |
|   | NIGHTMODE        | switch.camera.nightmode        |      | boolean | W  |     |       | `/^switch(\.camera)?\.nightmode$/`                         |
|   | PTZ              | level.camera.position          |      | number  | W  |     |       | `/^level(\.camera)?\.position$｜^level(\.camera)?(\.ptz)$/` |
|   | UNREACH          | indicator.maintenance.unreach  |      | boolean |    | X   |       | `/^indicator(\.maintenance)?\.unreach$/`                   |
|   | LOWBAT           | indicator.maintenance.lowbat   |      | boolean |    | X   |       | `/^indicator(\.maintenance)?\.(lowbat｜battery)$/`          |
|   | MAINTAIN         | indicator.maintenance          |      | boolean |    | X   |       | `/^indicator\.maintenance$/`                               |
|   | ERROR            | indicator.error                |      |         |    | X   |       | `/^indicator\.error$/`                                     |
|   | BATTERY          | value.battery                  | %    | number  | -  |     |       | `/^value\.battery$/`                                       |


### Chart [chart]

Chart with e-charts template.

| R | Name  | Ind | Multi |
|---|-------|-----|-------|
|   | CHART |     |       |


### CIE Color space [cie]

Light with CIE (International Commission on Illumination) color space (XY).

| R | Name            | Role                          | Unit | Type    | Wr | Ind | Multi | Regex                                             |
|---|-----------------|-------------------------------|------|---------|----|-----|-------|---------------------------------------------------|
| * | CIE             | level.color.cie               |      | string  | W  |     |       | `/^level\.color\.cie$/`                           |
|   | DIMMER          | level.dimmer                  | %    | number  | W  |     |       | `/^level\.dimmer$/`                               |
|   | BRIGHTNESS      |                               | %    | number  | W  |     |       | `/^level\.brightness$/`                           |
|   | TEMPERATURE     | level.color.temperature       | °K   | number  | W  |     |       | `/^level\.color\.temperature$/`                   |
|   | ON              | switch.light                  |      | boolean | W  |     |       | `/^switch(\.light)?$/`                            |
|   | ON_ACTUAL       | sensor.light                  |      | boolean | -  |     |       | `/^(state｜switch｜sensor)\.light｜switch$/`         |
|   | TRANSITION_TIME | time.span                     | ms   | number  | W  |     |       | `/^time\.(span｜interval)$/`                       |
|   | ELECTRIC_POWER  | value.power                   | W    | number  | -  |     |       | `/^value\.power$/`                                |
|   | CURRENT         | value.current                 | mA   | number  | -  |     |       | `/^value\.current$/`                              |
|   | VOLTAGE         | value.voltage                 | V    | number  | -  |     |       | `/^value\.voltage$/`                              |
|   | CONSUMPTION     | value.power.consumption       | Wh   | number  | -  |     |       | `/^value\.power\.consumption$/`                   |
|   | FREQUENCY       | value.frequency               | Hz   | number  | -  |     |       | `/^value\.frequency$/`                            |
|   | WORKING         | indicator.working             |      |         |    | X   |       | `/^indicator\.working$/`                          |
|   | UNREACH         | indicator.maintenance.unreach |      | boolean |    | X   |       | `/^indicator(\.maintenance)?\.unreach$/`          |
|   | LOWBAT          | indicator.maintenance.lowbat  |      | boolean |    | X   |       | `/^indicator(\.maintenance)?\.(lowbat｜battery)$/` |
|   | MAINTAIN        | indicator.maintenance         |      | boolean |    | X   |       | `/^indicator\.maintenance$/`                      |
|   | ERROR           | indicator.error               |      |         |    | X   |       | `/^indicator\.error$/`                            |
|   | BATTERY         | value.battery                 | %    | number  | -  |     |       | `/^value\.battery$/`                              |


### Light with color temperature [ct]

Light, where the color is set by color temperature (normally from 2700°K (warm-white) to 6000°K (cold-white)).

| R | Name            | Role                          | Unit | Type    | Wr | Ind | Multi | Regex                                             |
|---|-----------------|-------------------------------|------|---------|----|-----|-------|---------------------------------------------------|
| * | TEMPERATURE     | level.color.temperature       | °K   | number  | W  |     |       | `/^level\.color\.temperature$/`                   |
|   | DIMMER          | level.dimmer                  | %    | number  | W  |     |       | `/^level\.dimmer$/`                               |
|   | BRIGHTNESS      |                               |      | number  | W  |     |       | `/^level\.brightness$/`                           |
|   | ON              | switch.light                  |      | boolean | W  |     |       | `/^switch(\.light)?$/`                            |
|   | ON_ACTUAL       | sensor.light                  |      | boolean | -  |     |       | `/^(state｜switch｜sensor)\.light｜switch$/`         |
|   | TRANSITION_TIME | time.span                     | ms   | number  | W  |     |       | `/^time\.(span｜interval)$/`                       |
|   | ELECTRIC_POWER  | value.power                   | W    | number  | -  |     |       | `/^value\.power$/`                                |
|   | CURRENT         | value.current                 | mA   | number  | -  |     |       | `/^value\.current$/`                              |
|   | VOLTAGE         | value.voltage                 | V    | number  | -  |     |       | `/^value\.voltage$/`                              |
|   | CONSUMPTION     | value.power.consumption       | Wh   | number  | -  |     |       | `/^value\.power\.consumption$/`                   |
|   | FREQUENCY       | value.frequency               | Hz   | number  | -  |     |       | `/^value\.frequency$/`                            |
|   | WORKING         | indicator.working             |      |         |    | X   |       | `/^indicator\.working$/`                          |
|   | UNREACH         | indicator.maintenance.unreach |      | boolean |    | X   |       | `/^indicator(\.maintenance)?\.unreach$/`          |
|   | LOWBAT          | indicator.maintenance.lowbat  |      | boolean |    | X   |       | `/^indicator(\.maintenance)?\.(lowbat｜battery)$/` |
|   | MAINTAIN        | indicator.maintenance         |      | boolean |    | X   |       | `/^indicator\.maintenance$/`                      |
|   | ERROR           | indicator.error               |      |         |    | X   |       | `/^indicator\.error$/`                            |
|   | BATTERY         | value.battery                 | %    | number  | -  |     |       | `/^value\.battery$/`                              |


### Light dimmer [dimmer]

Dimmer, that is controlled by state (normally from 0 to 100 %, but it could be any limits).

| R | Name            | Role                          | Unit | Type    | Wr | Enum | Ind | Multi | Regex                                             |
|---|-----------------|-------------------------------|------|---------|----|------|-----|-------|---------------------------------------------------|
| * | SET             | level.dimmer                  | %    | number  | W  | E    |     |       | `/^level(\.dimmer)?$｜^level\.brightness$/`        |
|   | ACTUAL          | value.dimmer                  | %    | number  | -  | E    |     |       | `/^value(\.dimmer)?$/`                            |
|   | ON_SET          | switch.light                  |      | boolean | W  | E    |     |       | `/^switch(\.light)?$｜^state$/`                    |
|   | ON_ACTUAL       | sensor.light                  |      | boolean | -  | E    |     |       | `/^(state｜switch｜sensor)\.light｜switch$/`         |
|   | TRANSITION_TIME | time.span                     | ms   | number  | W  | E    |     |       | `/^time\.(span｜interval)$/`                       |
|   | ELECTRIC_POWER  | value.power                   | W    | number  | -  |      |     |       | `/^value\.power$/`                                |
|   | CURRENT         | value.current                 | mA   | number  | -  |      |     |       | `/^value\.current$/`                              |
|   | VOLTAGE         | value.voltage                 | V    | number  | -  |      |     |       | `/^value\.voltage$/`                              |
|   | CONSUMPTION     | value.power.consumption       | Wh   | number  | -  |      |     |       | `/^value\.power\.consumption$/`                   |
|   | FREQUENCY       | value.frequency               | Hz   | number  | -  |      |     |       | `/^value\.frequency$/`                            |
|   | WORKING         | indicator.working             |      |         |    |      | X   |       | `/^indicator\.working$/`                          |
|   | UNREACH         | indicator.maintenance.unreach |      | boolean |    |      | X   |       | `/^indicator(\.maintenance)?\.unreach$/`          |
|   | LOWBAT          | indicator.maintenance.lowbat  |      | boolean |    |      | X   |       | `/^indicator(\.maintenance)?\.(lowbat｜battery)$/` |
|   | MAINTAIN        | indicator.maintenance         |      | boolean |    |      | X   |       | `/^indicator\.maintenance$/`                      |
|   | ERROR           | indicator.error               |      |         |    |      | X   |       | `/^indicator\.error$/`                            |
|   | BATTERY         | value.battery                 | %    | number  | -  |      |     |       | `/^value\.battery$/`                              |


### Door sensor [door]

Sensor if the door opened (true) or closed (false).

| R | Name     | Role                          | Unit | Type    | Wr | Enum | Ind | Multi | Regex                                             |
|---|----------|-------------------------------|------|---------|----|------|-----|-------|---------------------------------------------------|
| * | ACTUAL   | sensor.door                   |      | boolean | -  | E    |     |       | `/^(state｜sensor)(\.door)?/`                      |
|   | UNREACH  | indicator.maintenance.unreach |      | boolean |    |      | X   |       | `/^indicator(\.maintenance)?\.unreach$/`          |
|   | LOWBAT   | indicator.maintenance.lowbat  |      | boolean |    |      | X   |       | `/^indicator(\.maintenance)?\.(lowbat｜battery)$/` |
|   | MAINTAIN | indicator.maintenance         |      | boolean |    |      | X   |       | `/^indicator\.maintenance$/`                      |
|   | ERROR    | indicator.error               |      |         |    |      | X   |       | `/^indicator\.error$/`                            |
|   | BATTERY  | value.battery                 | %    | number  | -  |      |     |       | `/^value\.battery$/`                              |


### Fire alarm sensor [fireAlarm]

If smoke/fire sensor is alarmed (true) or not (false).

| R | Name     | Role                          | Unit | Type    | Wr | Ind | Multi | Regex                                             |
|---|----------|-------------------------------|------|---------|----|-----|-------|---------------------------------------------------|
| * | ACTUAL   | sensor.alarm.fire             |      | boolean |    |     |       | `/^(state｜sensor｜indicator)(\.alarm)?\.fire$/`    |
|   | UNREACH  | indicator.maintenance.unreach |      | boolean |    | X   |       | `/^indicator(\.maintenance)?\.unreach$/`          |
|   | LOWBAT   | indicator.maintenance.lowbat  |      | boolean |    | X   |       | `/^indicator(\.maintenance)?\.(lowbat｜battery)$/` |
|   | MAINTAIN | indicator.maintenance         |      | boolean |    | X   |       | `/^indicator\.maintenance$/`                      |
|   | ERROR    | indicator.error               |      |         |    | X   |       | `/^indicator\.error$/`                            |
|   | BATTERY  | value.battery                 | %    | number  | -  |     |       | `/^value\.battery$/`                              |


### Flood alarm sensor [floodAlarm]

If water sensor senses water (true) or not (false).

| R | Name     | Role                          | Unit | Type    | Wr | Ind | Multi | Regex                                             |
|---|----------|-------------------------------|------|---------|----|-----|-------|---------------------------------------------------|
| * | ACTUAL   | sensor.alarm.flood            |      | boolean |    |     |       | `/^(state｜sensor｜indicator)(\.alarm)?\.flood$/`   |
|   | UNREACH  | indicator.maintenance.unreach |      | boolean |    | X   |       | `/^indicator(\.maintenance)?\.unreach$/`          |
|   | LOWBAT   | indicator.maintenance.lowbat  |      | boolean |    | X   |       | `/^indicator(\.maintenance)?\.(lowbat｜battery)$/` |
|   | MAINTAIN | indicator.maintenance         |      | boolean |    | X   |       | `/^indicator\.maintenance$/`                      |
|   | ERROR    | indicator.error               |      |         |    | X   |       | `/^indicator\.error$/`                            |
|   | BATTERY  | value.battery                 | %    | number  | -  |     |       | `/^value\.battery$/`                              |


### Gate [gate]

Control of the gates. You can open (true) or close (false) the gate. Optionally, the exact position could exist.

| R | Name      | Role                          | Unit | Type    | Wr | Enum | Ind | Multi | Regex                                    |
|---|-----------|-------------------------------|------|---------|----|------|-----|-------|------------------------------------------|
| * | SET       | switch.gate                   |      | boolean | W  | E    |     |       | `/^switch(\.gate)?$/`                    |
|   | ACTUAL    | value.blind                   | %    | number  |    | E    |     |       | `/^value(\.(position｜gate))?$/`          |
|   | STOP      | button.stop                   |      | boolean | W  | E    |     |       | `/^(button｜action)\.stop$/`              |
|   | DIRECTION | indicator.direction           |      | boolean |    |      | X   |       | `/^indicator\.direction$/`               |
|   | DIRECTION | value.direction               |      | number  |    |      |     |       | `/^(indicator｜value)\.direction$/`       |
|   | WORKING   | indicator.working             |      |         |    |      | X   |       | `/^indicator\.working$/`                 |
|   | UNREACH   | indicator.maintenance.unreach |      | boolean |    |      | X   |       | `/^indicator(\.maintenance)?\.unreach$/` |
|   | MAINTAIN  | indicator.maintenance         |      | boolean |    |      | X   |       | `/^indicator\.maintenance$/`             |
|   | ERROR     | indicator.error               |      |         |    |      | X   |       | `/^indicator\.error$/`                   |


### Light with HUE color [hue]

HUE light from 0° to 360°.

| R | Name            | Role                          | Unit | Type    | Wr | Ind | Multi | Regex                                             |
|---|-----------------|-------------------------------|------|---------|----|-----|-------|---------------------------------------------------|
| * | HUE             | level.color.hue               | °    | number  | W  |     |       | `/^level\.color\.hue$/`                           |
|   | DIMMER          | level.dimmer                  | %    | number  | W  |     |       | `/^level\.dimmer$/`                               |
|   | BRIGHTNESS      |                               |      | number  | W  |     |       | `/^level\.brightness$/`                           |
|   | SATURATION      | level.color.saturation        | %    | number  | W  |     |       | `/^level\.color\.saturation$/`                    |
|   | TEMPERATURE     | level.color.temperature       | °K   | number  | W  |     |       | `/^level\.color\.temperature$/`                   |
|   | ON              | switch.light                  |      | boolean | W  |     |       | `/^switch(\.light)?$/`                            |
|   | ON_ACTUAL       | sensor.light                  |      | boolean | -  |     |       | `/^(state｜switch｜sensor)\.light｜switch$/`         |
|   | TRANSITION_TIME | time.span                     | ms   | number  | W  |     |       | `/^time\.(span｜interval)$/`                       |
|   | ELECTRIC_POWER  | value.power                   | W    | number  | -  |     |       | `/^value\.power$/`                                |
|   | CURRENT         | value.current                 | mA   | number  | -  |     |       | `/^value\.current$/`                              |
|   | VOLTAGE         | value.voltage                 | V    | number  | -  |     |       | `/^value\.voltage$/`                              |
|   | CONSUMPTION     | value.power.consumption       | Wh   | number  | -  |     |       | `/^value\.power\.consumption$/`                   |
|   | FREQUENCY       | value.frequency               | Hz   | number  | -  |     |       | `/^value\.frequency$/`                            |
|   | WORKING         | indicator.working             |      |         |    | X   |       | `/^indicator\.working$/`                          |
|   | UNREACH         | indicator.maintenance.unreach |      | boolean |    | X   |       | `/^indicator(\.maintenance)?\.unreach$/`          |
|   | LOWBAT          | indicator.maintenance.lowbat  |      | boolean |    | X   |       | `/^indicator(\.maintenance)?\.(lowbat｜battery)$/` |
|   | MAINTAIN        | indicator.maintenance         |      | boolean |    | X   |       | `/^indicator\.maintenance$/`                      |
|   | ERROR           | indicator.error               |      |         |    | X   |       | `/^indicator\.error$/`                            |
|   | BATTERY         | value.battery                 | %    | number  | -  |     |       | `/^value\.battery$/`                              |


### Humidity [humidity]

Air humidity in %.

| R | Name     | Role                          | Unit | Type    | Wr | Ind | Multi | Regex                                             |
|---|----------|-------------------------------|------|---------|----|-----|-------|---------------------------------------------------|
| * | ACTUAL   | value.humidity                | %    | number  | -  |     |       | `/\.humidity$/`                                   |
|   | UNREACH  | indicator.maintenance.unreach |      | boolean |    | X   |       | `/^indicator(\.maintenance)?\.unreach$/`          |
|   | LOWBAT   | indicator.maintenance.lowbat  |      | boolean |    | X   |       | `/^indicator(\.maintenance)?\.(lowbat｜battery)$/` |
|   | MAINTAIN | indicator.maintenance         |      | boolean |    | X   |       | `/^indicator\.maintenance$/`                      |
|   | ERROR    | indicator.error               |      |         |    | X   |       | `/^indicator\.error$/`                            |
|   | BATTERY  | value.battery                 | %    | number  | -  |     |       | `/^value\.battery$/`                              |


### Illuminance sensor [illuminance]

Illuminance sensor (normally in lux).

| R | Name     | Role                          | Unit | Type    | Wr | Ind | Multi | Regex                                             |
|---|----------|-------------------------------|------|---------|----|-----|-------|---------------------------------------------------|
| * | ACTUAL   | value.brightness              | lux  | number  | -  |     |       | `/\.brightness$/`                                 |
|   | UNREACH  | indicator.maintenance.unreach |      | boolean |    | X   |       | `/^indicator(\.maintenance)?\.unreach$/`          |
|   | LOWBAT   | indicator.maintenance.lowbat  |      | boolean |    | X   |       | `/^indicator(\.maintenance)?\.(lowbat｜battery)$/` |
|   | MAINTAIN | indicator.maintenance         |      | boolean |    | X   |       | `/^indicator\.maintenance$/`                      |
|   | ERROR    | indicator.error               |      |         |    | X   |       | `/^indicator\.error$/`                            |
|   | BATTERY  | value.battery                 | %    | number  | -  |     |       | `/^value\.battery$/`                              |


### Image [image]

URL for image.

| R | Name     | Role                          | Unit | Type    | Wr | Ind | Multi | Regex                                                                       |
|---|----------|-------------------------------|------|---------|----|-----|-------|-----------------------------------------------------------------------------|
| * | URL      | icon                          |      | string  | -  |     |       | `/\.icon$｜^icon$｜^icon\.｜\.icon\.｜\.chart\.url\.｜\.chart\.url$｜^url.icon$/` |
|   | UNREACH  | indicator.maintenance.unreach |      | boolean |    | X   |       | `/^indicator(\.maintenance)?\.unreach$/`                                    |
|   | LOWBAT   | indicator.maintenance.lowbat  |      | boolean |    | X   |       | `/^indicator(\.maintenance)?\.(lowbat｜battery)$/`                           |
|   | MAINTAIN | indicator.maintenance         |      | boolean |    | X   |       | `/^indicator\.maintenance$/`                                                |
|   | ERROR    | indicator.error               |      |         |    | X   |       | `/^indicator\.error$/`                                                      |
|   | BATTERY  | value.battery                 | %    | number  | -  |     |       | `/^value\.battery$/`                                                        |


### Information device (very simple) [info]

Many information states could be combined under this device, e.g., current, amperage, power in one device.

| R | Name     | Role                          | Unit | Type    | Wr | Ind | Multi | Regex                                             |
|---|----------|-------------------------------|------|---------|----|-----|-------|---------------------------------------------------|
| * | ACTUAL   | state                         |      |         |    |     | x     |                                                   |
|   | WORKING  | indicator.working             |      |         |    | X   |       | `/^indicator\.working$/`                          |
|   | UNREACH  | indicator.maintenance.unreach |      | boolean |    | X   |       | `/^indicator(\.maintenance)?\.unreach$/`          |
|   | LOWBAT   | indicator.maintenance.lowbat  |      | boolean |    | X   |       | `/^indicator(\.maintenance)?\.(lowbat｜battery)$/` |
|   | MAINTAIN | indicator.maintenance         |      | boolean |    | X   |       | `/^indicator\.maintenance$/`                      |
|   | ERROR    | indicator.error               |      |         |    | X   |       | `/^indicator\.error$/`                            |
|   | BATTERY  | value.battery                 | %    | number  | -  |     |       | `/^value\.battery$/`                              |


### Slider [levelSlider]

Slider with position set by number. Could be used for any device that is controlled by numeric value. Limits could be defined by `min`, `max` attributes. Normally from 0 (off) to 100 (full power).

| R | Name     | Role                          | Unit | Type    | Wr | Min | Max | Ind | Multi | Regex                                             |
|---|----------|-------------------------------|------|---------|----|-----|-----|-----|-------|---------------------------------------------------|
| * | SET      | level                         | %    | number  | W  | m   | M   |     |       | `/^level(\..*)?$/`                                |
|   | ACTUAL   | value                         | %    | number  | -  | m   | M   |     |       | `/^value(\..*)?$/`                                |
|   | WORKING  | indicator.working             |      |         |    |     |     | X   |       | `/^indicator\.working$/`                          |
|   | UNREACH  | indicator.maintenance.unreach |      | boolean |    |     |     | X   |       | `/^indicator(\.maintenance)?\.unreach$/`          |
|   | LOWBAT   | indicator.maintenance.lowbat  |      | boolean |    |     |     | X   |       | `/^indicator(\.maintenance)?\.(lowbat｜battery)$/` |
|   | MAINTAIN | indicator.maintenance         |      | boolean |    |     |     | X   |       | `/^indicator\.maintenance$/`                      |
|   | ERROR    | indicator.error               |      |         |    |     |     | X   |       | `/^indicator\.error$/`                            |
|   | BATTERY  | value.battery                 | %    | number  | -  |     |     |     |       | `/^value\.battery$/`                              |


### Light switch [light]

Light with only ON/OFF options. Could have information about current, amperage, energy and power.

| R | Name           | Role                          | Unit | Type    | Wr | Enum | Ind | Multi | Regex                                             |
|---|----------------|-------------------------------|------|---------|----|------|-----|-------|---------------------------------------------------|
| * | SET            | switch.light                  |      | boolean | W  | E    |     |       | `/^switch(\.light)?$｜^state$/`                    |
|   | ON_ACTUAL      | sensor.light                  |      | boolean | -  | E    |     |       | `/^(state｜switch｜sensor)\.light｜switch$/`         |
|   | ELECTRIC_POWER | value.power                   | W    | number  | -  |      |     |       | `/^value\.power$/`                                |
|   | CURRENT        | value.current                 | mA   | number  | -  |      |     |       | `/^value\.current$/`                              |
|   | VOLTAGE        | value.voltage                 | V    | number  | -  |      |     |       | `/^value\.voltage$/`                              |
|   | CONSUMPTION    | value.power.consumption       | Wh   | number  | -  |      |     |       | `/^value\.power\.consumption$/`                   |
|   | FREQUENCY      | value.frequency               | Hz   | number  | -  |      |     |       | `/^value\.frequency$/`                            |
|   | WORKING        | indicator.working             |      |         |    |      | X   |       | `/^indicator\.working$/`                          |
|   | UNREACH        | indicator.maintenance.unreach |      | boolean |    |      | X   |       | `/^indicator(\.maintenance)?\.unreach$/`          |
|   | LOWBAT         | indicator.maintenance.lowbat  |      | boolean |    |      | X   |       | `/^indicator(\.maintenance)?\.(lowbat｜battery)$/` |
|   | MAINTAIN       | indicator.maintenance         |      | boolean |    |      | X   |       | `/^indicator\.maintenance$/`                      |
|   | ERROR          | indicator.error               |      |         |    |      | X   |       | `/^indicator\.error$/`                            |
|   | BATTERY        | value.battery                 | %    | number  | -  |      |     |       | `/^value\.battery$/`                              |


### GPS Location (longitude, latitude) [location]

GPS location, where longitude and latitude are stored in two different states.

| R | Name      | Role                          | Unit | Type    | Wr | Ind | Multi | Regex                                             |
|---|-----------|-------------------------------|------|---------|----|-----|-------|---------------------------------------------------|
| * | LONGITUDE | value.gps.longitude           | °    | number  | -  |     |       | `/^value(\.gps)?\.longitude$/`                    |
| * | LATITUDE  | value.gps.latitude            | °    | number  | -  |     |       | `/^value(\.gps)?\.latitude$/`                     |
|   | ELEVATION | value.gps.elevation           |      | number  | -  |     |       | `/^value(\.gps)?\.elevation$/`                    |
|   | RADIUS    | value.gps.radius              |      | number  | -  |     |       | `/^value(\.gps)?\.radius$/`                       |
|   | ACCURACY  | value.gps.accuracy            |      | number  | -  |     |       | `/^value(\.gps)?\.accuracy$/`                     |
|   | UNREACH   | indicator.maintenance.unreach |      | boolean |    | X   |       | `/^indicator(\.maintenance)?\.unreach$/`          |
|   | LOWBAT    | indicator.maintenance.lowbat  |      | boolean |    | X   |       | `/^indicator(\.maintenance)?\.(lowbat｜battery)$/` |
|   | MAINTAIN  | indicator.maintenance         |      | boolean |    | X   |       | `/^indicator\.maintenance$/`                      |
|   | ERROR     | indicator.error               |      |         |    | X   |       | `/^indicator\.error$/`                            |
|   | BATTERY   | value.battery                 | %    | number  | -  |     |       | `/^value\.battery$/`                              |


### GPS Location in single state [locationOne]

GPS location, where longitude and latitude are stored in one state, like `longitude;latitude` - `8.40435;49.013506`.

| R | Name      | Role                          | Unit | Type    | Wr | Ind | Multi | Regex                                             |
|---|-----------|-------------------------------|------|---------|----|-----|-------|---------------------------------------------------|
| * | GPS       | value.gps                     |      | string  | -  |     |       | `/^value\.gps$/`                                  |
|   | ELEVATION | value.gps.elevation           |      | number  | -  |     |       | `/^value\.gps\.elevation$/`                       |
|   | RADIUS    | value.gps.radius              |      | number  | -  |     |       | `/^value(\.gps)?\.radius$/`                       |
|   | ACCURACY  | value.gps.accuracy            |      | number  | -  |     |       | `/^value(\.gps)?\.accuracy$/`                     |
|   | UNREACH   | indicator.maintenance.unreach |      | boolean |    | X   |       | `/^indicator(\.maintenance)?\.unreach$/`          |
|   | LOWBAT    | indicator.maintenance.lowbat  |      | boolean |    | X   |       | `/^indicator(\.maintenance)?\.(lowbat｜battery)$/` |
|   | MAINTAIN  | indicator.maintenance         |      | boolean |    | X   |       | `/^indicator\.maintenance$/`                      |
|   | ERROR     | indicator.error               |      |         |    | X   |       | `/^indicator\.error$/`                            |
|   | BATTERY   | value.battery                 | %    | number  | -  |     |       | `/^value\.battery$/`                              |


### Lock [lock]

Lock. Could be opened (true), closed (false) or opened completely by `OPEN` state.

| R | Name       | Role                          | Unit | Type    | Wr | Ind | Multi | Regex                                             |
|---|------------|-------------------------------|------|---------|----|-----|-------|---------------------------------------------------|
| * | SET        | switch.lock                   |      | boolean | W  |     |       | `/^switch\.lock$/`                                |
|   | ACTUAL     | state                         |      | boolean | -  |     |       | `/^state$/`                                       |
|   | OPEN       | button                        |      | boolean | W  |     |       |                                                   |
|   | DOOR_STATE | sensor.door                   |      | boolean | -  |     |       | `/^(state｜sensor)(\.door)?$/`                     |
|   | DIRECTION  | indicator.direction           |      | boolean |    | X   |       | `/^indicator\.direction$/`                        |
|   | DIRECTION  | value.direction               |      | number  |    |     |       | `/^(indicator｜value)\.direction$/`                |
|   | WORKING    | indicator.working             |      |         |    | X   |       | `/^indicator\.working$/`                          |
|   | UNREACH    | indicator.maintenance.unreach |      | boolean |    | X   |       | `/^indicator(\.maintenance)?\.unreach$/`          |
|   | LOWBAT     | indicator.maintenance.lowbat  |      | boolean |    | X   |       | `/^indicator(\.maintenance)?\.(lowbat｜battery)$/` |
|   | MAINTAIN   | indicator.maintenance         |      | boolean |    | X   |       | `/^indicator\.maintenance$/`                      |
|   | ERROR      | indicator.error               |      |         |    | X   |       | `/^indicator\.error$/`                            |
|   | BATTERY    | value.battery                 | %    | number  | -  |     |       | `/^value\.battery$/`                              |


### Media player [mediaPlayer]

| R | Name          | Role                         | Unit | Type           | Wr | Min | Max | Ind | Multi | Regex                                             |
|---|---------------|------------------------------|------|----------------|----|-----|-----|-----|-------|---------------------------------------------------|
| * | STATE         | media.state                  |      | boolean/number |    |     |     |     |       | `/^media\.state(\..*)?$/`                         |
|   | PLAY          | button.play                  |      | boolean        | W  |     |     |     |       | `/^(button｜action)\.play(\..*)?$/`                |
|   | PAUSE         | button.pause                 |      | boolean        | W  |     |     |     |       | `/^(button｜action)\.pause(\..*)?$/`               |
|   | STOP          | button.stop                  |      | boolean        | W  |     |     |     |       | `/^(button｜action)\.stop(\..*)?$/`                |
|   | NEXT          | button.next                  |      | boolean        | W  |     |     |     |       | `/^(button｜action)\.next(\..*)?$/`                |
|   | PREV          | button.prev                  |      | boolean        | W  |     |     |     |       | `/^(button｜action)\.prev(\..*)?$/`                |
|   | SHUFFLE       | media.mode.shuffle           |      | boolean        | W  |     |     |     |       | `/^media\.mode\.shuffle(\..*)?$/`                 |
|   | REPEAT        | media.mode.repeat            |      | number         | W  |     |     |     |       | `/^media\.mode\.repeat(\..*)?$/`                  |
|   | ARTIST        | media.artist                 |      | string         | -  |     |     |     |       | `/^media\.artist(\..*)?$/`                        |
|   | ALBUM         | media.album                  |      | string         | -  |     |     |     |       | `/^media\.album(\..*)?$/`                         |
|   | TITLE         | media.title                  |      | string         | -  |     |     |     |       | `/^media\.title(\..*)?$/`                         |
|   | COVER         | media.cover                  |      | string         | -  |     |     |     |       | `/^media\.cover(\.big)?$/`                        |
|   | COVER         |                              |      | string         | -  |     |     |     |       | `/^media\.cover(\..*)$/`                          |
|   | DURATION      | media.duration               | sec  | number         | -  |     |     |     |       | `/^media\.duration(\..*)?$/`                      |
|   | ELAPSED       | media.elapsed                | sec  | number         |    |     |     |     |       | `/^media\.elapsed(\..*)?$/`                       |
|   | SEEK          | media.seek                   |      | number         | W  |     |     |     |       | `/^media\.seek(\..*)?$/`                          |
|   | TRACK         | media.track                  |      | string         |    |     |     |     |       | `/^media\.track(\..*)?$/`                         |
|   | EPISODE       | media.episode                |      | string         |    |     |     |     |       | `/^media\.episode(\..*)?$/`                       |
|   | SEASON        | media.season                 |      | string         |    |     |     |     |       | `/^media\.season(\..*)?$/`                        |
|   | VOLUME        | level.volume                 | %    | number         | W  | m   | M   |     |       | `/^level(\.volume)?$/`                            |
|   | VOLUME_ACTUAL | value.volume                 | %    | number         | -  | m   | M   |     |       | `/^value(\.volume)?$/`                            |
|   | MUTE          | media.mute                   |      | boolean        | W  |     |     |     |       | `/^media(\.mute)?$/`                              |
|   | IGNORE        |                              |      |                |    |     |     |     | x     |                                                   |
|   | CONNECTED     | indicator.reachable          |      | boolean        |    |     |     | X   |       | `/^indicator\.reachable$/`                        |
|   | LOWBAT        | indicator.maintenance.lowbat |      | boolean        |    |     |     | X   |       | `/^indicator(\.maintenance)?\.(lowbat｜battery)$/` |
|   | MAINTAIN      | indicator.maintenance        |      | boolean        |    |     |     | X   |       | `/^indicator\.maintenance$/`                      |
|   | ERROR         | indicator.error              |      |                |    |     |     | X   |       | `/^indicator\.error$/`                            |
|   | BATTERY       | value.battery                | %    | number         | -  |     |     |     |       | `/^value\.battery$/`                              |


### Motion sensor [motion]

| R | Name     | Role                          | Unit | Type    | Wr | Ind | Multi | Regex                                             |
|---|----------|-------------------------------|------|---------|----|-----|-------|---------------------------------------------------|
| * | ACTUAL   | sensor.motion                 |      | boolean |    |     |       | `/^(state\.)?motion$｜^sensor\.motion$/`           |
|   | SECOND   | value.brightness              | lux  | number  |    |     |       | `/brightness$/`                                   |
|   | UNREACH  | indicator.maintenance.unreach |      | boolean |    | X   |       | `/^indicator(\.maintenance)?\.unreach$/`          |
|   | LOWBAT   | indicator.maintenance.lowbat  |      | boolean |    | X   |       | `/^indicator(\.maintenance)?\.(lowbat｜battery)$/` |
|   | MAINTAIN | indicator.maintenance         |      | boolean |    | X   |       | `/^indicator\.maintenance$/`                      |
|   | ERROR    | indicator.error               |      |         |    | X   |       | `/^indicator\.error$/`                            |
|   | BATTERY  | value.battery                 | %    | number  | -  |     |       | `/^value\.battery$/`                              |


### Percentage slider [percentage]

Same as slider, but from 0 to 100%

| R | Name     | Role                          | Unit | Type    | Wr | Ind | Multi | Regex                                             |
|---|----------|-------------------------------|------|---------|----|-----|-------|---------------------------------------------------|
| * | SET      | level                         | %    | number  | W  |     |       | `/^level(\..*)?$/`                                |
|   | ACTUAL   | value                         | %    | number  | -  |     |       | `/^value(\..*)?$/`                                |
|   | WORKING  | indicator.working             |      |         |    | X   |       | `/^indicator\.working$/`                          |
|   | UNREACH  | indicator.maintenance.unreach |      | boolean |    | X   |       | `/^indicator(\.maintenance)?\.unreach$/`          |
|   | LOWBAT   | indicator.maintenance.lowbat  |      | boolean |    | X   |       | `/^indicator(\.maintenance)?\.(lowbat｜battery)$/` |
|   | MAINTAIN | indicator.maintenance         |      | boolean |    | X   |       | `/^indicator\.maintenance$/`                      |
|   | ERROR    | indicator.error               |      |         |    | X   |       | `/^indicator\.error$/`                            |
|   | BATTERY  | value.battery                 | %    | number  | -  |     |       | `/^value\.battery$/`                              |


### RGB(W) Light with different states for every color [rgb]

R,G,B(,W) Light with different states for every color. The value is from 0 to 255.

| R | Name            | Role                          | Unit | Type    | Wr | Ind | Multi | Regex                                             |
|---|-----------------|-------------------------------|------|---------|----|-----|-------|---------------------------------------------------|
| * | RED             | level.color.red               |      | number  | W  |     |       | `/^level\.color\.red$/`                           |
| * | GREEN           | level.color.green             |      | number  | W  |     |       | `/^level\.color\.green$/`                         |
| * | BLUE            | level.color.blue              |      | number  | W  |     |       | `/^level\.color\.blue$/`                          |
|   | WHITE           | level.color.white             |      | number  | W  |     |       | `/^level\.color\.white$/`                         |
|   | DIMMER          | level.dimmer                  | %    | number  | W  |     |       | `/^level\.dimmer$/`                               |
|   | BRIGHTNESS      |                               |      | number  | W  |     |       | `/^level\.brightness$/`                           |
|   | TEMPERATURE     | level.color.temperature       | °K   | number  | W  |     |       | `/^level\.color\.temperature$/`                   |
|   | ON              | switch.light                  |      | boolean | W  |     |       | `/^switch(\.light)?$｜^state$/`                    |
|   | ON_ACTUAL       | sensor.light                  |      | boolean | -  |     |       | `/^(state｜switch｜sensor)\.light｜switch$/`         |
|   | TRANSITION_TIME | time.span                     | ms   | number  | W  |     |       | `/^time\.(span｜interval)$/`                       |
|   | ELECTRIC_POWER  | value.power                   | W    | number  | -  |     |       | `/^value\.power$/`                                |
|   | CURRENT         | value.current                 | mA   | number  | -  |     |       | `/^value\.current$/`                              |
|   | VOLTAGE         | value.voltage                 | V    | number  | -  |     |       | `/^value\.voltage$/`                              |
|   | CONSUMPTION     | value.power.consumption       | Wh   | number  | -  |     |       | `/^value\.power\.consumption$/`                   |
|   | FREQUENCY       | value.frequency               | Hz   | number  | -  |     |       | `/^value\.frequency$/`                            |
|   | WORKING         | indicator.working             |      |         |    | X   |       | `/^indicator\.working$/`                          |
|   | UNREACH         | indicator.maintenance.unreach |      | boolean |    | X   |       | `/^indicator(\.maintenance)?\.unreach$/`          |
|   | LOWBAT          | indicator.maintenance.lowbat  |      | boolean |    | X   |       | `/^indicator(\.maintenance)?\.(lowbat｜battery)$/` |
|   | MAINTAIN        | indicator.maintenance         |      | boolean |    | X   |       | `/^indicator\.maintenance$/`                      |
|   | ERROR           | indicator.error               |      |         |    | X   |       | `/^indicator\.error$/`                            |
|   | BATTERY         | value.battery                 | %    | number  | -  |     |       | `/^value\.battery$/`                              |


### RGB Light Single [rgbSingle]

RGB light with one state of color. Could be HEX #RRGGBB, or rgb(0-255,0-255,0-255).

| R | Name            | Role                          | Unit | Type    | Wr | Ind | Multi | Regex                                             |
|---|-----------------|-------------------------------|------|---------|----|-----|-------|---------------------------------------------------|
| * | RGB             | level.color.rgb               |      | string  | W  |     |       | `/^level\.color\.rgb$/`                           |
|   | DIMMER          | level.dimmer                  | %    | number  | W  |     |       | `/^level\.dimmer$/`                               |
|   | BRIGHTNESS      |                               | %    | number  | W  |     |       | `/^level\.brightness$/`                           |
|   | TEMPERATURE     | level.color.temperature       | °K   | number  | W  |     |       | `/^level\.color\.temperature$/`                   |
|   | ON              | switch.light                  |      | boolean | W  |     |       | `/^switch(\.light)?$/`                            |
|   | ON_ACTUAL       | sensor.light                  |      | boolean | -  |     |       | `/^(state｜switch｜sensor)\.light｜switch$/`         |
|   | TRANSITION_TIME | time.span                     | ms   | number  | W  |     |       | `/^time\.(span｜interval)$/`                       |
|   | ELECTRIC_POWER  | value.power                   | W    | number  | -  |     |       | `/^value\.power$/`                                |
|   | CURRENT         | value.current                 | mA   | number  | -  |     |       | `/^value\.current$/`                              |
|   | VOLTAGE         | value.voltage                 | V    | number  | -  |     |       | `/^value\.voltage$/`                              |
|   | CONSUMPTION     | value.power.consumption       | Wh   | number  | -  |     |       | `/^value\.power\.consumption$/`                   |
|   | FREQUENCY       | value.frequency               | Hz   | number  | -  |     |       | `/^value\.frequency$/`                            |
|   | WORKING         | indicator.working             |      |         |    | X   |       | `/^indicator\.working$/`                          |
|   | UNREACH         | indicator.maintenance.unreach |      | boolean |    | X   |       | `/^indicator(\.maintenance)?\.unreach$/`          |
|   | LOWBAT          | indicator.maintenance.lowbat  |      | boolean |    | X   |       | `/^indicator(\.maintenance)?\.(lowbat｜battery)$/` |
|   | MAINTAIN        | indicator.maintenance         |      | boolean |    | X   |       | `/^indicator\.maintenance$/`                      |
|   | ERROR           | indicator.error               |      |         |    | X   |       | `/^indicator\.error$/`                            |
|   | BATTERY         | value.battery                 | %    | number  | -  |     |       | `/^value\.battery$/`                              |


### RGBW Light Single [rgbwSingle]

RGBW light with one state of color. Could be HEX #RRGGBBWW, or rgba(0-255,0-255,0-255,0-1).

| R | Name            | Role                          | Unit | Type    | Wr | Ind | Multi | Regex                                             |
|---|-----------------|-------------------------------|------|---------|----|-----|-------|---------------------------------------------------|
| * | RGBW            | level.color.rgbw              |      | string  | W  |     |       | `/^level\.color\.rgbw$/`                          |
|   | DIMMER          | level.dimmer                  | %    | number  | W  |     |       | `/^level\.dimmer$/`                               |
|   | BRIGHTNESS      |                               | %    | number  | W  |     |       | `/^level\.brightness$/`                           |
|   | TEMPERATURE     | level.color.temperature       | °K   | number  | W  |     |       | `/^level\.color\.temperature$/`                   |
|   | ON              | switch.light                  |      | boolean | W  |     |       | `/^switch(\.light)?$/`                            |
|   | ON_ACTUAL       | sensor.light                  |      | boolean | -  |     |       | `/^(state｜switch｜sensor)\.light｜switch$/`         |
|   | TRANSITION_TIME | time.span                     | ms   | number  | W  |     |       | `/^time\.(span｜interval)$/`                       |
|   | ELECTRIC_POWER  | value.power                   | W    | number  | -  |     |       | `/^value\.power$/`                                |
|   | CURRENT         | value.current                 | mA   | number  | -  |     |       | `/^value\.current$/`                              |
|   | VOLTAGE         | value.voltage                 | V    | number  | -  |     |       | `/^value\.voltage$/`                              |
|   | CONSUMPTION     | value.power.consumption       | Wh   | number  | -  |     |       | `/^value\.power\.consumption$/`                   |
|   | FREQUENCY       | value.frequency               | Hz   | number  | -  |     |       | `/^value\.frequency$/`                            |
|   | WORKING         | indicator.working             |      |         |    | X   |       | `/^indicator\.working$/`                          |
|   | UNREACH         | indicator.maintenance.unreach |      | boolean |    | X   |       | `/^indicator(\.maintenance)?\.unreach$/`          |
|   | LOWBAT          | indicator.maintenance.lowbat  |      | boolean |    | X   |       | `/^indicator(\.maintenance)?\.(lowbat｜battery)$/` |
|   | MAINTAIN        | indicator.maintenance         |      | boolean |    | X   |       | `/^indicator\.maintenance$/`                      |
|   | ERROR           | indicator.error               |      |         |    | X   |       | `/^indicator\.error$/`                            |
|   | BATTERY         | value.battery                 | %    | number  | -  |     |       | `/^value\.battery$/`                              |


### Socket [socket]

Socket with an ON/OFF option. Could have information about current, amperage, energy and power.

| R | Name           | Role                          | Unit | Type    | Wr | Ind | Multi | Regex                                             |
|---|----------------|-------------------------------|------|---------|----|-----|-------|---------------------------------------------------|
| * | SET            | switch                        |      | boolean | W  |     |       | `/^switch(\.active)?$｜^state$/`                   |
|   | ACTUAL         | sensor.switch                 |      | boolean | -  |     |       | `/^state(\.active)?$｜^sensor.switch$/`            |
|   | ELECTRIC_POWER | value.power                   | W    | number  | -  |     |       | `/^value\.power$/`                                |
|   | CURRENT        | value.current                 | mA   | number  | -  |     |       | `/^value\.current$/`                              |
|   | VOLTAGE        | value.voltage                 | V    | number  | -  |     |       | `/^value\.voltage$/`                              |
|   | CONSUMPTION    | value.power.consumption       | Wh   | number  | -  |     |       | `/^value\.power\.consumption$/`                   |
|   | FREQUENCY      | value.frequency               | Hz   | number  | -  |     |       | `/^value\.frequency$/`                            |
|   | WORKING        | indicator.working             |      |         |    | X   |       | `/^indicator\.working$/`                          |
|   | UNREACH        | indicator.maintenance.unreach |      | boolean |    | X   |       | `/^indicator(\.maintenance)?\.unreach$/`          |
|   | LOWBAT         | indicator.maintenance.lowbat  |      | boolean |    | X   |       | `/^indicator(\.maintenance)?\.(lowbat｜battery)$/` |
|   | MAINTAIN       | indicator.maintenance         |      | boolean |    | X   |       | `/^indicator\.maintenance$/`                      |
|   | ERROR          | indicator.error               |      |         |    | X   |       | `/^indicator\.error$/`                            |


### Temperature [temperature]

Combined temperature and humidity sensor. Humidity is optional.

| R | Name     | Role                          | Unit | Type    | Wr | Ind | Multi | Regex                                             |
|---|----------|-------------------------------|------|---------|----|-----|-------|---------------------------------------------------|
| * | ACTUAL   | value.temperature             | °C   | number  | -  |     |       | `/\.temperature$/`                                |
|   | SECOND   | value.humidity                | %    | number  | -  |     |       | `/\.humidity$/`                                   |
|   | UNREACH  | indicator.maintenance.unreach |      | boolean |    | X   |       | `/^indicator(\.maintenance)?\.unreach$/`          |
|   | LOWBAT   | indicator.maintenance.lowbat  |      | boolean |    | X   |       | `/^indicator(\.maintenance)?\.(lowbat｜battery)$/` |
|   | MAINTAIN | indicator.maintenance         |      | boolean |    | X   |       | `/^indicator\.maintenance$/`                      |
|   | ERROR    | indicator.error               |      |         |    | X   |       | `/^indicator\.error$/`                            |
|   | BATTERY  | value.battery                 | %    | number  | -  |     |       | `/^value\.battery$/`                              |


### Thermostat [thermostat]

Thermostat to be controlled by the desired temperature. Could have mode.

| R | Name     | Role                          | Unit | Type           | Wr | Ind | Multi | Regex                                             |
|---|----------|-------------------------------|------|----------------|----|-----|-------|---------------------------------------------------|
| * | SET      | level.temperature             | °C   | number         | W  |     |       | `/temperature(\..*)?$/`                           |
|   | ACTUAL   | value.temperature             | °C   | number         | -  |     |       | `/temperature(\..*)?$/`                           |
|   | HUMIDITY | value.humidity                | %    | number         | -  |     |       | `/humidity(\..*)?$/`                              |
|   | BOOST    | switch.mode.boost             |      | boolean/number | W  |     |       | `/^switch(\.mode)?\.boost(\..*)?$/`               |
|   | POWER    | switch.power                  |      | boolean/number | W  |     |       | `/^switch(\.power)?$/`                            |
|   | PARTY    | switch.mode.party             |      | boolean/number | W  |     |       | `/^switch(\.mode)?\.party$/`                      |
|   | MODE     | level.mode.thermostat         |      | number         | W  |     |       | `/^level(\.mode)?\.thermostat$/`                  |
|   | WORKING  | indicator.working             |      |                |    | X   |       | `/^indicator\.working$/`                          |
|   | UNREACH  | indicator.maintenance.unreach |      | boolean        |    | X   |       | `/^indicator(\.maintenance)?\.unreach$/`          |
|   | LOWBAT   | indicator.maintenance.lowbat  |      | boolean        |    | X   |       | `/^indicator(\.maintenance)?\.(lowbat｜battery)$/` |
|   | MAINTAIN | indicator.maintenance         |      | boolean        |    | X   |       | `/^indicator\.maintenance$/`                      |
|   | ERROR    | indicator.error               |      |                |    | X   |       | `/^indicator\.error$/`                            |
|   | BATTERY  | value.battery                 | %    | number         | -  |     |       | `/^value\.battery$/`                              |


### Vacuum cleaner (robot) [vacuumCleaner]

| R | Name        | Role                          | Unit | Type           | Wr | Ind | Multi | Regex                                                              |
|---|-------------|-------------------------------|------|----------------|----|-----|-------|--------------------------------------------------------------------|
| * | POWER       | switch.power                  |      | boolean/number | W  |     |       | `/^switch\.power$/`                                                |
| * | MODE        | level.mode.cleanup            |      | number         | W  |     |       | `/mode\.cleanup$/`                                                 |
|   | MAP_BASE64  | vacuum.map.base64             |      | string         | -  |     |       | `/vacuum\.map\.base64$/`                                           |
|   | MAP_URL     |                               |      | string         | -  |     |       | `/vacuum\.map\.url$/`                                              |
|   | WORK_MODE   | level.mode.work               |      | number         | W  |     |       | `/mode\.work$/`                                                    |
|   | WATER       | value.water                   | %    | number         | -  |     |       | `/^value\.water$/`                                                 |
|   | WASTE       | value.waste                   | %    | number         | -  |     |       | `/^value\.waste$/`                                                 |
|   | BATTERY     | value.battery                 | %    | number         | -  |     |       | `/^value\.battery$/`                                               |
|   | STATE       | value.state                   |      | number/string  | -  |     |       | `/^value\.state$/`                                                 |
|   | PAUSE       | switch.pause                  |      | boolean        | W  |     |       | `/^switch\.pause$/`                                                |
|   | WASTE_ALARM | indicator.maintenance.waste   |      | boolean        |    | X   |       | `/^indicator(\.maintenance)?\.waste$｜^indicator(\.alarm)?\.waste/` |
|   | WATER_ALARM | indicator.maintenance.water   |      | boolean        |    | X   |       | `/^indicator(\.maintenance)?\.water$｜^indicator(\.alarm)?\.water/` |
|   | FILTER      | value.usage.filter            | %    | number         |    | X   |       | `/^value(\.usage)?\.filter/`                                       |
|   | BRUSH       | value.usage.brush             | %    | number         |    | X   |       | `/^value(\.usage)?\.brush/`                                        |
|   | SENSORS     | value.usage.sensors           | %    | number         |    | X   |       | `/^value(\.usage)?\.sensors/`                                      |
|   | SIDE_BRUSH  | value.usage.brush.side        | %    | number         |    | X   |       | `/^value(\.usage)?\.brush\.side/`                                  |
|   | UNREACH     | indicator.maintenance.unreach |      | boolean        |    | X   |       | `/^indicator(\.maintenance)?\.unreach$/`                           |
|   | LOWBAT      | indicator.maintenance.lowbat  |      | boolean        |    | X   |       | `/^indicator(\.maintenance)?\.(lowbat｜battery)$/`                  |
|   | MAINTAIN    | indicator.maintenance         |      | boolean        |    | X   |       | `/^indicator\.maintenance$/`                                       |
|   | ERROR       | indicator.error               |      |                |    | X   |       | `/^indicator\.error$/`                                             |
|   | BATTERY     | value.battery                 | %    | number         | -  |     |       | `/^value\.battery$/`                                               |


### Volume [volume]

Sound volume.

| R | Name     | Role                          | Unit | Type    | Wr | Min | Max | Ind | Multi | Regex                                             |
|---|----------|-------------------------------|------|---------|----|-----|-----|-----|-------|---------------------------------------------------|
| * | SET      | level.volume                  | %    | number  | W  | m   | M   |     |       | `/^level\.volume$/`                               |
|   | ACTUAL   | value.volume                  | %    | number  | -  | m   | M   |     |       | `/^value\.volume$/`                               |
|   | MUTE     | media.mute                    |      | boolean | W  |     |     |     |       | `/^media\.mute$/`                                 |
|   | WORKING  | indicator.working             |      |         |    |     |     | X   |       | `/^indicator\.working$/`                          |
|   | UNREACH  | indicator.maintenance.unreach |      | boolean |    |     |     | X   |       | `/^indicator(\.maintenance)?\.unreach$/`          |
|   | LOWBAT   | indicator.maintenance.lowbat  |      | boolean |    |     |     | X   |       | `/^indicator(\.maintenance)?\.(lowbat｜battery)$/` |
|   | MAINTAIN | indicator.maintenance         |      | boolean |    |     |     | X   |       | `/^indicator\.maintenance$/`                      |
|   | ERROR    | indicator.error               |      |         |    |     |     | X   |       | `/^indicator\.error$/`                            |
|   | BATTERY  | value.battery                 | %    | number  | -  |     |     |     |       | `/^value\.battery$/`                              |


### Volume group [volumeGroup]

Group of volumes.

| R | Name     | Role                          | Unit | Type    | Wr | Min | Max | Ind | Multi | Regex                                             |
|---|----------|-------------------------------|------|---------|----|-----|-----|-----|-------|---------------------------------------------------|
| * | SET      | level.volume.group            | %    | number  | W  | m   | M   |     |       | `/^level\.volume\.group?$/`                       |
|   | ACTUAL   | value.volume.group            | %    | number  | -  | m   | M   |     |       | `/^value\.volume\.group$/`                        |
|   | MUTE     | media.mute.group              |      | boolean | W  |     |     |     |       | `/^media\.mute\.group$/`                          |
|   | WORKING  | indicator.working             |      |         |    |     |     | X   |       | `/^indicator\.working$/`                          |
|   | UNREACH  | indicator.maintenance.unreach |      | boolean |    |     |     | X   |       | `/^indicator(\.maintenance)?\.unreach$/`          |
|   | LOWBAT   | indicator.maintenance.lowbat  |      | boolean |    |     |     | X   |       | `/^indicator(\.maintenance)?\.(lowbat｜battery)$/` |
|   | MAINTAIN | indicator.maintenance         |      | boolean |    |     |     | X   |       | `/^indicator\.maintenance$/`                      |
|   | ERROR    | indicator.error               |      |         |    |     |     | X   |       | `/^indicator\.error$/`                            |
|   | BATTERY  | value.battery                 | %    | number  | -  |     |     |     |       | `/^value\.battery$/`                              |


### Warning [warning]

Just sensor if alarm should be shown.

| R | Name  | Role                | Type   | Ind | Multi | Regex                       |
|---|-------|---------------------|--------|-----|-------|-----------------------------|
| * | LEVEL | value.warning       |        |     |       | `/^value\.warning$/`        |
|   | TITLE | weather.title.short | string |     |       | `/^weather\.title\.short$/` |
|   | INFO  | weather.title       | string |     |       | `/^weather\.title$/`        |
|   | START | date.start          | string |     |       | `/^date\.start$/`           |
|   | END   | date.end            | string |     |       | `/^date\.end$/`             |
|   | START |                     | string |     |       | `/^date$/`                  |
|   | ICON  | weather.chart.url   | string |     |       | `/^weather\.chart\.url/`    |
|   | DESC  | weather.state       | string |     |       | `/^weather\.state$/`        |


### Current weather [weatherCurrent]

| R | Name                  | Role                          | Unit | Type    | Wr | Ind | Multi | Regex                                             |
|---|-----------------------|-------------------------------|------|---------|----|-----|-------|---------------------------------------------------|
| * | ACTUAL                | value.temperature             | °C   | number  |    |     |       | `/^value(\.temperature)?$/`                       |
| * | ICON                  | weather.icon                  |      |         |    |     |       | `/^weather\.icon$/`                               |
|   | PRECIPITATION_CHANCE  | value.precipitation.chance    | %    | number  |    |     |       | `/^value\.precipitation\.chance$/`                |
|   | PRECIPITATION_TYPE    | value.precipitation.type      |      | number  |    |     |       | `/^value\.precipitation\.type$/`                  |
|   | PRESSURE              | value.pressure                | mbar | number  |    |     |       | `/^value\.pressure$/`                             |
|   | PRESSURE_TENDENCY     | value.pressure.tendency       |      | string  |    |     |       | `/^value\.pressure\.tendency$/`                   |
|   | REAL_FEEL_TEMPERATURE | value.temperature.windchill   | °C   | number  |    |     |       | `/^value\.temperature\.windchill$/`               |
|   | HUMIDITY              | value.humidity                | %    | number  |    |     |       | `/^value\.humidity$/`                             |
|   | UV                    | value.uv                      |      | number  |    |     |       | `/^value\.uv$/`                                   |
|   | WEATHER               | weather.state                 |      | string  |    |     |       | `/^weather\.state$/`                              |
|   | WIND_DIRECTION        | value.direction.wind          | °    | string  |    |     |       | `/^value\.direction\.wind$/`                      |
|   | WIND_GUST             | value.speed.wind.gust         | km/h | number  |    |     |       | `/^value\.speed\.wind\.gust$/`                    |
|   | WIND_SPEED            | value.speed.wind$             | km/h | number  |    |     |       | `/^value\.speed\.wind$/`                          |
|   | LOWBAT                | indicator.maintenance.lowbat  |      | boolean |    | X   |       | `/^indicator(\.maintenance)?\.(lowbat｜battery)$/` |
|   | UNREACH               | indicator.maintenance.unreach |      | boolean |    | X   |       | `/^indicator(\.maintenance)?\.unreach$/`          |
|   | MAINTAIN              | indicator.maintenance         |      | boolean |    | X   |       | `/^indicator\.maintenance$/`                      |
|   | ERROR                 | indicator.error               |      |         |    | X   |       | `/^indicator\.error$/`                            |
|   | BATTERY               | value.battery                 | %    | number  | -  |     |       | `/^value\.battery$/`                              |


### Weather forecast [weatherForecast]

| R | Name                   | Role                                   | Unit  | Type          | Ind | Multi | Regex                                               |
|---|------------------------|----------------------------------------|-------|---------------|-----|-------|-----------------------------------------------------|
| * | ICON                   | weather.icon.forecast.0                |       | string        |     |       | `/^weather\.icon(\.forecast\.0)?$/`                 |
| * | TEMP_MIN               | value.temperature.min.forecast.0       |       | number        |     |       | `/^value\.temperature\.min\.forecast\.0$/`          |
| * | TEMP_MAX               | value.temperature.max.forecast.0       |       | number        |     |       | `/^value\.temperature\.max\.forecast\.0$/`          |
|   | PRECIPITATION_CHANCE   | value.precipitation.forecast.0         |  / %  | number        |     |       | `/^value\.precipitation(\.forecast\.0)?$/`          |
|   | PRECIPITATION          | value.precipitation.forecast.0         |  / mm | number        |     |       | `/^value\.precipitation(\.forecast\.0)?$/`          |
|   | DATE                   | date.forecast.0                        |       | string        |     |       | `/^date(\.forecast\.0)?$/`                          |
|   | DOW                    | dayofweek.forecast.0                   |       | string        |     |       | `/^dayofweek(\.forecast\.0)?$/`                     |
|   | STATE                  | weather.state.forecast.0               |       | string        |     |       | `/^weather\.state(\.forecast\.0)?$/`                |
|   | TEMP                   | value.temperature.forecast.0           |       | number        |     |       | `/^value\.temperature(\.forecast\.0)?$/`            |
|   | PRESSURE               | value.pressure.forecast.0              |       | number        |     |       | `/^value\.pressure(\.forecast\.0)?$/`               |
|   | HUMIDITY               | value.humidity.forecast.0              |       | number        |     |       | `/^value\.humidity(\.forecast\.0)?$/`               |
|   | TIME_SUNRISE           | date.sunrise                           |       | string/number |     |       | `/^(?:date｜time)\.sunrise(?:\.forecast\.0)?$/`      |
|   | TIME_SUNSET            | date.sunset                            |       | string/number |     |       | `/^(?:date｜time)\.sunset(?:\.forecast\.0)?$/`       |
|   | WIND_CHILL             | value.temperature.windchill.forecast.0 |       | number        |     |       | `/^value\.temperature\.windchill(\.forecast\.0)?$/` |
|   | FEELS_LIKE             | value.temperature.feelslike.forecast.0 |       | number        |     |       | `/^value\.temperature\.feelslike(\.forecast\.0)?$/` |
|   | WIND_SPEED             | value.speed.wind.forecast.0            |       | number        |     |       | `/^value\.speed\.wind(\.forecast\.0)?$/`            |
|   | WIND_DIRECTION         | value.direction.wind.forecast.0        |       | number        |     |       | `/^value\.direction\.wind(\.forecast\.0)?$/`        |
|   | WIND_DIRECTION_STR     | weather.direction.wind.forecast.0      |       | string        |     |       | `/^weather\.direction\.wind(\.forecast\.0)?$/`      |
|   | WIND_ICON              | weather.icon.wind.forecast.0           |       | string        |     |       | `/^weather\.icon\.wind(\.forecast\.0)?$/`           |
|   | HISTORY_CHART          | weather.chart.url                      |       | string        |     |       | `/^weather\.chart\.url$/`                           |
|   | FORECAST_CHART         | weather.chart.url.forecast             |       | string        |     |       | `/^weather\.chart\.url\.forecast$/`                 |
|   | LOCATION               | location                               |       | string        |     |       | `/^location$/`                                      |
|   | ICON%d                 |                                        |       | string        |     | x     | `/^weather\.icon\.forecast.(\d+)$/`                 |
|   | TEMP_MIN%d             |                                        |       | number        |     | x     | `/^value\.temperature\.min\.forecast\.(\d+)$/`      |
|   | TEMP_MAX%d             |                                        |       | number        |     | x     | `/^value\.temperature\.max\.forecast\.(\d+)$/`      |
|   | DATE%d                 |                                        |       | string        |     | x     | `/^date\.forecast\.(\d+)$/`                         |
|   | DOW%d                  |                                        |       | string        |     | x     | `/^dayofweek\.forecast\.(\d+)$/`                    |
|   | STATE%d                |                                        |       | string        |     | x     | `/^weather\.state\.forecast\.(\d+)$/`               |
|   | TEMP%d                 |                                        |       | number        |     | x     | `/^value\.temperature\.forecast\.(\d+)$/`           |
|   | PRESSURE%d             |                                        |       | number        |     | x     | `/^value\.pressure\.forecast\.(\d+)?$/`             |
|   | HUMIDITY%d             |                                        |       | number        |     | x     | `/^value\.humidity\.forecast\.(\d+)$/`              |
|   | HUMIDITY_MAX%d         |                                        |       | number        |     | x     | `/^value\.humidity\.max\.forecast\.(\d+)$/`         |
|   | PRECIPITATION_CHANCE%d |                                        |  / %  | number        |     | x     | `/^value\.precipitation\.forecast\.(\d+)$/`         |
|   | PRECIPITATION%d        |                                        |  / mm | number        |     | x     | `/^value\.precipitation\.forecast\.(\d+)$/`         |
|   | WIND_SPEED%d           |                                        |       | number        |     | x     | `/^value\.speed\.wind\.forecast\.(\d+)$/`           |
|   | WIND_DIRECTION%d       |                                        |       | number        |     | x     | `/^value\.direction\.wind\.forecast\.(\d+)$/`       |
|   | WIND_DIRECTION_STR%d   |                                        |       | string        |     | x     | `/^weather\.direction\.wind\.forecast\.(\d+)$/`     |
|   | WIND_ICON%d            |                                        |       | string        |     | x     | `/^weather\.icon\.wind\.forecast\.(\d+)$/`          |
|   | TIME_SUNRISE%d         |                                        |       | string/number |     | x     | `/^(?:date｜time)\.sunrise(?:\.forecast\.(\d+))?$/`  |
|   | TIME_SUNSET%d          |                                        |       | string/number |     | x     | `/^(?:date｜time)\.sunset(?:\.forecast\.(\d+))?$/`   |


### Window sensor [window]

Window sensor: opened - true, closed - false.

| R | Name     | Role                          | Unit | Type    | Wr | Enum | Ind | Multi | Regex                                             |
|---|----------|-------------------------------|------|---------|----|------|-----|-------|---------------------------------------------------|
| * | ACTUAL   | sensor.window                 |      | boolean | -  | E    |     |       | `/^(state｜sensor)(\.window)?/`                    |
|   | UNREACH  | indicator.maintenance.unreach |      | boolean |    |      | X   |       | `/^indicator(\.maintenance)?\.unreach$/`          |
|   | LOWBAT   | indicator.maintenance.lowbat  |      | boolean |    |      | X   |       | `/^indicator(\.maintenance)?\.(lowbat｜battery)$/` |
|   | MAINTAIN | indicator.maintenance         |      | boolean |    |      | X   |       | `/^indicator\.maintenance$/`                      |
|   | ERROR    | indicator.error               |      |         |    |      | X   |       | `/^indicator\.error$/`                            |
|   | BATTERY  | value.battery                 | %    | number  | -  |      |     |       | `/^value\.battery$/`                              |


### Window that could be in tilted state [windowTilt]

Window tilt sensor: closed - 0, opened - 1, tiled - 2.

| R | Name     | Role                          | Unit | Type    | Wr | Enum | Ind | Multi | Regex                                             |
|---|----------|-------------------------------|------|---------|----|------|-----|-------|---------------------------------------------------|
| * | ACTUAL   | value.window                  |      | number  | -  | E    |     |       | `/^state$｜^value(\.window)?$/`                    |
|   | UNREACH  | indicator.maintenance.unreach |      | boolean |    |      | X   |       | `/^indicator(\.maintenance)?\.unreach$/`          |
|   | LOWBAT   | indicator.maintenance.lowbat  |      | boolean |    |      | X   |       | `/^indicator(\.maintenance)?\.(lowbat｜battery)$/` |
|   | MAINTAIN | indicator.maintenance         |      | boolean |    |      | X   |       | `/^indicator\.maintenance$/`                      |
|   | ERROR    | indicator.error               |      |         |    |      | X   |       | `/^indicator\.error$/`                            |
|   | BATTERY  | value.battery                 | %    | number  | -  |      |     |       | `/^value\.battery$/`                              |



## Categories

While many devices have similar states (e.g., only one boolean state like by a door and window sensors), the following categories (enumerations) and roles are used to distinguish one type from another.
E.g., if state has role `"door"` and type `boolean`, it is a door sensor. If it has role `"window"` and type `boolean`, it is a window sensor.
If the role is not provided, the type detector tries to use categories to detect the type. The state or the parent channel/device could belong to one of the categories, so the type detector can decide what the device is that.
First, the role will be used for detection and then the categories.

### Door sensor [door]
To detect these devices, it must belong to one of the following categories (any regex in any language):
- **en**: `/doors?/i`, `/gates?/i`, `/wickets?/i`, `/entry|entries/i`
- **de**: `/^türe?/i`, `/^tuere?/i`, `/^tore?$/i`, `/einfahrt(en)?/i`, `/pforten?/i`
- **ru**: `/двери|дверь/i`, `/ворота/i`, `/калитка|калитки/`, `/въезды?/i`, `/входы?/i`

Or has one of the roles: 
`door`, `state.door`, `sensor.door`

### Window sensor [window]
To detect these devices, it must belong to one of the following categories (any regex in any language):
- **en**: `/blinds?/i`, `/windows?/i`, `/shutters?/i`
- **de**: `/rollladen?/i`, `/fenstern?/i`, `/beschattung(en)?/i`, `/jalousien?/i`
- **ru**: `/ставни/i`, `/рольставни/i`, `/окна|окно/`, `/жалюзи/i`

Or has one of the roles: 
`window`, `state.window`, `sensor.window`, `value.window`

### Blinds or Shutter [blind]
To detect these devices, it must belong to one of the following categories (any regex in any language):
- **en**: `/blinds?/i`, `/windows?/i`, `/shutters?/i`
- **de**: `/rollladen?/i`, `/fenstern?/i`, `/beschattung(en)?/i`, `/jalousien?/i`
- **ru**: `/ставни/i`, `/рольставни/i`, `/окна|окно/`, `/жалюзи/i`

Or has one of the roles: 
`blind`, `level.blind`, `value.blind`, `action.stop`, `button.stop`, `button.stop.blind`, `button.open.blind`, `button.close.blind`, `level.tilt`, `value.tilt`, `button.tilt.open`, `button.tilt.close`, `button.tilt.stop`

### Gate [gate]
To detect these devices, it must belong to one of the following categories (any regex in any language):
- **en**: `/gates?/i`
- **de**: `/^toren$/i`, `/^tor$/i`
- **ru**: `/ворота/i`

Or has one of the roles: 
`gate`, `value.gate`, `switch.gate`, `action.stop`, `button.stop`

### Light switch [light]
To detect these devices, it must belong to one of the following categories (any regex in any language):
- **en**: `/lights?/i`, `/lamps?/i`, `/ceilings?/i`
- **de**: `/licht(er)?/i`, `/lampen?/i`, `/beleuchtung(en)?/i`
- **ru**: `/свет/i`, `/ламп[аы]/i`, `/торшеры?/`, `/подсветк[аи]/i`, `/лампочк[аи]/i`, `/светильники?/i`

Or has one of the roles: 
`switch.light`, `dimmer`, `value.dimmer`, `level.dimmer`, `sensor.light`, `state.light`
