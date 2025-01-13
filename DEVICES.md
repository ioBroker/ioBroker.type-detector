# ioBroker device types

**Note:** Do not copy regex with '|' from tables. It contains unicode replacement of '|', because of markdown's table rendering. 

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
- **Enum** - State must belong to specific category
- **Ind** - Is the state is an indicator. Indicators will be shown as a small icon in material.
- **Mult** - (multiple) the state with given parameters can appear more than one time in device. E.g. weather day 1, weather day 1, and so on.
- **Regex** - Role regex

Restrictions:
- Blinds are always opened with 100% and closed with 0%.
- Switch is always boolean and so can have only `true` and `false` values. Not `0 / 1` or `ON / OFF`.

What is not important for detection:
- Name - name of functionality in the device 
- noSubscribe - says to material, that there is no need to monitor its value. E.g. it is button. 
- inverted - says to material, that indicator must be shown only if the value is `false`.
- defaultStates - Used for `devices` to set the default `common.states`.
- defaultRole - Used for `devices` to set the `common.role` by creation.
- defaultUnit - Used for `devices` to set the `common.unit` by creation.
- defaultType - Used for `devices` to set the `common.type` by creation.

## Devices
In [brackets] is given the class name of device.
### Content
* [Air conditioner [airCondition]](#air-conditioner-aircondition)
* [Blinds controlled only by buttons [blindButtons]](#blinds-controlled-only-by-buttons-blindbuttons)
* [Blinds or Shutter [blinds]](#blinds-or-shutter-blinds)
* [Button [button]](#button-button)
* [buttonSensor [buttonSensor]](#buttonsensor-buttonsensor)
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
* [image [image]](#image-image)
* [Information device (very simple) [info]](#information-device--very-simple--info)
* [Slider [levelSlider]](#slider-levelslider)
* [Light switch [light]](#light-switch-light)
* [GPS Location [location]](#gps-location-location)
* [GPS Location [location_one]](#gps-location-location_one)
* [Lock [lock]](#lock-lock)
* [Media [mediaPlayer]](#media-mediaplayer)
* [Motion sensor [motion]](#motion-sensor-motion)
* [RGB Light (R,G,B have different states) [rgb]](#rgb-light--r-g-b-have-different-states--rgb)
* [RGB Light with hex color [rgbSingle]](#rgb-light-with-hex-color-rgbsingle)
* [RGBW Light with hex color [rgbwSingle]](#rgbw-light-with-hex-color-rgbwsingle)
* [Socket [socket]](#socket-socket)
* [Temperature [temperature]](#temperature-temperature)
* [Thermostat [thermostat]](#thermostat-thermostat)
* [Vacuum cleaner (robot) [vacuumCleaner]](#vacuum-cleaner--robot--vacuumcleaner)
* [Volume [volume]](#volume-volume)
* [Volume group [volumeGroup]](#volume-group-volumegroup)
* [Warning [warning]](#warning-warning)
* [Current weather [weatherCurrent]](#current-weather-weathercurrent)
* [Weather forecast [weatherForecast]](#weather-forecast-weatherforecast)
* [Window [window]](#window-window)
* [Window that could be in tilted state [windowTilt]](#window-that-could-be-in-tilted-state-windowtilt)
### Air conditioner [airCondition]
| R | Name           | Role                          | Unit | Type           | Wr | Ind | Mult | Regex                                    |
|---|----------------|-------------------------------|------|----------------|----|-----|------|------------------------------------------|
| * | SET            | level.temperature             | °C   | number         | W  |     |      | `/temperature(\..*)?$/`                  |
| * | MODE           | level.mode.airconditioner     |      | number         | W  |     |      | `/airconditioner$/`                      |
|   | SPEED          | level.mode.fan                |      | number         | W  |     |      | `/(speed｜mode)\.fan$/`                   |
|   | POWER          | switch.power                  |      | boolean/number | W  |     |      | `/^switch\.power$/`                      |
|   | POWER          |                               |      | boolean        | W  |     |      | `/^switch$/`                             |
|   | ACTUAL         | value.temperature             | °C   | number         | -  |     |      | `/temperature(\..*)?$/`                  |
|   | HUMIDITY       | value.humidity                | %    | number         | -  |     |      | `/humidity(\..*)?$/`                     |
|   | BOOST          | switch.boost                  |      | boolean/number | W  |     |      | `/^switch\.boost(\..*)?$/`               |
|   | SWING          | level.mode.swing              |      | number         | W  |     |      | `/swing$/`                               |
|   | SWING          | switch.mode.swing             |      | boolean        | W  |     |      | `/swing$/`                               |
|   | ELECTRIC_POWER | value.power                   | W    | number         | -  |     |      | `/^value\.power$/`                       |
|   | CURRENT        | value.current                 | mA   | number         | -  |     |      | `/^value\.current$/`                     |
|   | VOLTAGE        | value.voltage                 | V    | number         | -  |     |      | `/^value\.voltage$/`                     |
|   | CONSUMPTION    | value.power.consumption       | Wh   | number         | -  |     |      | `/^value\.power\.consumption$/`          |
|   | FREQUENCY      | value.frequency               | Hz   | number         | -  |     |      | `/^value\.frequency$/`                   |
|   | UNREACH        | indicator.maintenance.unreach |      | boolean        |    | X   |      | `/^indicator(\.maintenance)?\.unreach$/` |
|   | MAINTAIN       | indicator.maintenance         |      | boolean        |    | X   |      | `/^indicator\.maintenance$/`             |
|   | ERROR          | indicator.error               |      |                |    | X   |      | `/^indicator\.error$/`                   |


### Blinds controlled only by buttons [blindButtons]
| R | Name        | Role                          | Unit | Type    | Wr | Enum | Ind | Mult | Regex                                                                        |
|---|-------------|-------------------------------|------|---------|----|------|-----|------|------------------------------------------------------------------------------|
| * | STOP        | button.stop.blind             |      | boolean | W  | E    |     |      | `/^button\.stop(\.blind)?$｜^action\.stop$/`                                  |
| * | OPEN        | button.open.blind             |      | boolean | W  | E    |     |      | `/^button\.open(\.blind)?$/`                                                 |
| * | CLOSE       | button.close.blind            |      | boolean | W  | E    |     |      | `/^button\.close(\.blind)?$/`                                                |
|   | TILT_SET    | level.tilt                    |      | number  | W  | E    |     |      | `/^level\.tilt$/`                                                            |
|   | TILT_ACTUAL | value.tilt                    |      | number  |    | E    |     |      | `/^value\.tilt$/`                                                            |
|   | TILT_STOP   | button.stop.tilt              |      | boolean | W  | E    |     |      | `/^button\.stop\.tilt$/`                                                     |
|   | TILT_OPEN   | button.open.tilt              |      | boolean | W  | E    |     |      | `/^button\.open\.tilt$/`                                                     |
|   | TILT_CLOSE  | button.close.tilt             |      | boolean | W  | E    |     |      | `/^button\.close\.tilt$/`                                                    |
|   | DIRECTION   | indicator.direction           |      | boolean |    |      | X   |      | `/^indicator\.direction$/`                                                   |
|   | DIRECTION   | level.direction               |      | number  |    |      |     |      | `/^(indicator｜level)\.direction$/`                                           |
|   | WORKING     | indicator.working             |      |         |    |      | X   |      | `/^indicator\.working$/`                                                     |
|   | UNREACH     | indicator.maintenance.unreach |      | boolean |    |      | X   |      | `/^indicator(\.maintenance)?\.unreach$/`                                     |
|   | LOWBAT      | indicator.maintenance.lowbat  |      | boolean |    |      | X   |      | `/^indicator(\.maintenance)?\.lowbat$｜^indicator(\.maintenance)?\.battery$/` |
|   | MAINTAIN    | indicator.maintenance         |      | boolean |    |      | X   |      | `/^indicator\.maintenance$/`                                                 |
|   | ERROR       | indicator.error               |      |         |    |      | X   |      | `/^indicator\.error$/`                                                       |
|   | BATTERY     | value.battery                 | %    | number  | -  |      |     |      | `/^value\.battery$/`                                                         |


### Blinds or Shutter [blinds]
| R | Name        | Role                          | Unit | Type    | Wr | Enum | Ind | Mult | Regex                                                                        |
|---|-------------|-------------------------------|------|---------|----|------|-----|------|------------------------------------------------------------------------------|
| * | SET         | level.blind                   | %    | number  | W  | E    |     |      | `/^level(\.blind)?$/`                                                        |
|   | ACTUAL      | value.blind                   | %    | number  |    | E    |     |      | `/^value(\.blind)?$/`                                                        |
|   | STOP        | button.stop.blind             |      | boolean | W  | E    |     |      | `/^button\.stop(\.blind)?$｜^action\.stop$/`                                  |
|   | OPEN        | button.open.blind             |      | boolean | W  | E    |     |      | `/^button\.open(\.blind)?$/`                                                 |
|   | CLOSE       | button.close.blind            |      | boolean | W  | E    |     |      | `/^button\.close(\.blind)?$/`                                                |
|   | TILT_SET    | level.tilt                    |      | number  | W  | E    |     |      | `/^level(\.open)?\.tilt$/`                                                   |
|   | TILT_ACTUAL | value.tilt                    |      | number  |    | E    |     |      | `/^value(\.open)?\.tilt$/`                                                   |
|   | TILT_STOP   | button.stop.tilt              |      | boolean | W  | E    |     |      | `/^button\.stop\.tilt$/`                                                     |
|   | TILT_OPEN   | button.open.tilt              |      | boolean | W  | E    |     |      | `/^button\.open\.tilt$/`                                                     |
|   | TILT_CLOSE  | button.close.tilt             |      | boolean | W  | E    |     |      | `/^button\.close\.tilt$/`                                                    |
|   | DIRECTION   | indicator.direction           |      | boolean |    |      | X   |      | `/^indicator\.direction$/`                                                   |
|   | DIRECTION   | level.direction               |      | number  |    |      |     |      | `/^(indicator｜level)\.direction$/`                                           |
|   | WORKING     | indicator.working             |      |         |    |      | X   |      | `/^indicator\.working$/`                                                     |
|   | UNREACH     | indicator.maintenance.unreach |      | boolean |    |      | X   |      | `/^indicator(\.maintenance)?\.unreach$/`                                     |
|   | LOWBAT      | indicator.maintenance.lowbat  |      | boolean |    |      | X   |      | `/^indicator(\.maintenance)?\.lowbat$｜^indicator(\.maintenance)?\.battery$/` |
|   | MAINTAIN    | indicator.maintenance         |      | boolean |    |      | X   |      | `/^indicator\.maintenance$/`                                                 |
|   | ERROR       | indicator.error               |      |         |    |      | X   |      | `/^indicator\.error$/`                                                       |
|   | BATTERY     | value.battery                 | %    | number  | -  |      |     |      | `/^value\.battery$/`                                                         |


### Button [button]
| R | Name     | Role                          | Unit | Type    | Wr | Ind | Mult | Regex                                                                        |
|---|----------|-------------------------------|------|---------|----|-----|------|------------------------------------------------------------------------------|
| * | SET      | button                        |      | boolean | W  |     |      | `/^button(\.[.\w]+)?$｜^action(\.[.\w]+)?$/`                                  |
|   | UNREACH  | indicator.maintenance.unreach |      | boolean |    | X   |      | `/^indicator(\.maintenance)?\.unreach$/`                                     |
|   | LOWBAT   | indicator.maintenance.lowbat  |      | boolean |    | X   |      | `/^indicator(\.maintenance)?\.lowbat$｜^indicator(\.maintenance)?\.battery$/` |
|   | MAINTAIN | indicator.maintenance         |      | boolean |    | X   |      | `/^indicator\.maintenance$/`                                                 |
|   | ERROR    | indicator.error               |      |         |    | X   |      | `/^indicator\.error$/`                                                       |
|   | BATTERY  | value.battery                 | %    | number  | -  |     |      | `/^value\.battery$/`                                                         |


### buttonSensor [buttonSensor]
| R | Name       | Role                          | Unit | Type    | Wr | Ind | Mult | Regex                                                                        |
|---|------------|-------------------------------|------|---------|----|-----|------|------------------------------------------------------------------------------|
| * | PRESS      | button.press                  |      | boolean | -  |     |      | `/^button(\.[.\w]+)?$/`                                                      |
|   | PRESS_LONG | button.long                   |      | boolean | -  |     |      | `/^button\.long/`                                                            |
|   | UNREACH    | indicator.maintenance.unreach |      | boolean |    | X   |      | `/^indicator(\.maintenance)?\.unreach$/`                                     |
|   | LOWBAT     | indicator.maintenance.lowbat  |      | boolean |    | X   |      | `/^indicator(\.maintenance)?\.lowbat$｜^indicator(\.maintenance)?\.battery$/` |
|   | MAINTAIN   | indicator.maintenance         |      | boolean |    | X   |      | `/^indicator\.maintenance$/`                                                 |
|   | ERROR      | indicator.error               |      |         |    | X   |      | `/^indicator\.error$/`                                                       |
|   | BATTERY    | value.battery                 | %    | number  | -  |     |      | `/^value\.battery$/`                                                         |


### IP Camera [camera]
| R | Name             | Role                           | Unit | Type    | Wr | Ind | Mult | Regex                                                                        |
|---|------------------|--------------------------------|------|---------|----|-----|------|------------------------------------------------------------------------------|
| * | URL              | link.camera                    |      | string  |    |     |      | `/^link\.camera(\.\w+)?$/`                                                   |
|   | AUTOFOCUS        | switch.camera.autofocus        |      | boolean | W  |     |      | `/^switch(\.camera)?\.autofocus$/`                                           |
|   | AUTOWHITEBALANCE | switch.camera.autowhitebalance |      | boolean | W  |     |      | `/^switch(\.camera)?\.autowhitebalance$/`                                    |
|   | BRIGHTNESS       | switch.camera.brightness       |      | boolean | W  |     |      | `/^switch(\.camera)?\.brightness$/`                                          |
|   | NIGHTMODE        | switch.camera.nightmode        |      | boolean | W  |     |      | `/^switch(\.camera)?\.nightmode$/`                                           |
|   | PTZ              | level.camera.position          |      | number  | W  |     |      | `/^level(\.camera)?\.position$｜^level(\.camera)?(\.ptz)$/`                   |
|   | UNREACH          | indicator.maintenance.unreach  |      | boolean |    | X   |      | `/^indicator(\.maintenance)?\.unreach$/`                                     |
|   | LOWBAT           | indicator.maintenance.lowbat   |      | boolean |    | X   |      | `/^indicator(\.maintenance)?\.lowbat$｜^indicator(\.maintenance)?\.battery$/` |
|   | MAINTAIN         | indicator.maintenance          |      | boolean |    | X   |      | `/^indicator\.maintenance$/`                                                 |
|   | ERROR            | indicator.error                |      |         |    | X   |      | `/^indicator\.error$/`                                                       |
|   | BATTERY          | value.battery                  | %    | number  | -  |     |      | `/^value\.battery$/`                                                         |


### Chart [chart]
| R | Name  | Ind | Mult |
|---|-------|-----|------|
|   | CHART |     |      |


### CIE Color space [cie]
| R | Name            | Role                          | Unit | Type    | Wr | Ind | Mult | Regex                                                                        |
|---|-----------------|-------------------------------|------|---------|----|-----|------|------------------------------------------------------------------------------|
| * | CIE             | level.color.cie               |      | string  | W  |     |      | `/^level\.color\.cie$/`                                                      |
|   | DIMMER          | level.dimmer                  | %    | number  | W  |     |      | `/^level\.dimmer$/`                                                          |
|   | BRIGHTNESS      |                               | %    | number  | W  |     |      | `/^level\.brightness$/`                                                      |
|   | SATURATION      |                               |      | number  | W  |     |      | `/^level\.color\.saturation$/`                                               |
|   | TEMPERATURE     | level.color.temperature       | °K   | number  | W  |     |      | `/^level\.color\.temperature$/`                                              |
|   | ON              | switch.light                  |      | boolean | W  |     |      | `/^switch(\.light)?$/`                                                       |
|   | ON_ACTUAL       | sensor.light                  |      | boolean | -  |     |      | `/^(state｜switch｜sensor)\.light｜switch$/`                                    |
|   | TRANSITION_TIME | time.span                     | ms   | number  | W  |     |      | `/^time(\.span｜\.interval)$/`                                                |
|   | ELECTRIC_POWER  | value.power                   | W    | number  | -  |     |      | `/^value\.power$/`                                                           |
|   | CURRENT         | value.current                 | mA   | number  | -  |     |      | `/^value\.current$/`                                                         |
|   | VOLTAGE         | value.voltage                 | V    | number  | -  |     |      | `/^value\.voltage$/`                                                         |
|   | CONSUMPTION     | value.power.consumption       | Wh   | number  | -  |     |      | `/^value\.power\.consumption$/`                                              |
|   | FREQUENCY       | value.frequency               | Hz   | number  | -  |     |      | `/^value\.frequency$/`                                                       |
|   | WORKING         | indicator.working             |      |         |    | X   |      | `/^indicator\.working$/`                                                     |
|   | UNREACH         | indicator.maintenance.unreach |      | boolean |    | X   |      | `/^indicator(\.maintenance)?\.unreach$/`                                     |
|   | LOWBAT          | indicator.maintenance.lowbat  |      | boolean |    | X   |      | `/^indicator(\.maintenance)?\.lowbat$｜^indicator(\.maintenance)?\.battery$/` |
|   | MAINTAIN        | indicator.maintenance         |      | boolean |    | X   |      | `/^indicator\.maintenance$/`                                                 |
|   | ERROR           | indicator.error               |      |         |    | X   |      | `/^indicator\.error$/`                                                       |
|   | BATTERY         | value.battery                 | %    | number  | -  |     |      | `/^value\.battery$/`                                                         |


### Light with color temperature [ct]
| R | Name            | Role                          | Unit | Type    | Wr | Ind | Mult | Regex                                                                        |
|---|-----------------|-------------------------------|------|---------|----|-----|------|------------------------------------------------------------------------------|
| * | TEMPERATURE     | level.color.temperature       | °K   | number  | W  |     |      | `/^level\.color\.temperature$/`                                              |
|   | DIMMER          | level.dimmer                  | %    | number  | W  |     |      | `/^level\.dimmer$/`                                                          |
|   | BRIGHTNESS      |                               |      | number  | W  |     |      | `/^level\.brightness$/`                                                      |
|   | SATURATION      |                               |      | number  | W  |     |      | `/^level\.color\.saturation$/`                                               |
|   | ON              | switch.light                  |      | boolean | W  |     |      | `/^switch\.light$/`                                                          |
|   | ON              |                               |      | boolean | W  |     |      | `/^switch$/`                                                                 |
|   | ON_ACTUAL       | sensor.light                  |      | boolean | -  |     |      | `/^(state｜switch｜sensor)\.light｜switch$/`                                    |
|   | TRANSITION_TIME | time.span                     | ms   | number  | W  |     |      | `/^time(\.span｜\.interval)$/`                                                |
|   | ELECTRIC_POWER  | value.power                   | W    | number  | -  |     |      | `/^value\.power$/`                                                           |
|   | CURRENT         | value.current                 | mA   | number  | -  |     |      | `/^value\.current$/`                                                         |
|   | VOLTAGE         | value.voltage                 | V    | number  | -  |     |      | `/^value\.voltage$/`                                                         |
|   | CONSUMPTION     | value.power.consumption       | Wh   | number  | -  |     |      | `/^value\.power\.consumption$/`                                              |
|   | FREQUENCY       | value.frequency               | Hz   | number  | -  |     |      | `/^value\.frequency$/`                                                       |
|   | WORKING         | indicator.working             |      |         |    | X   |      | `/^indicator\.working$/`                                                     |
|   | UNREACH         | indicator.maintenance.unreach |      | boolean |    | X   |      | `/^indicator(\.maintenance)?\.unreach$/`                                     |
|   | LOWBAT          | indicator.maintenance.lowbat  |      | boolean |    | X   |      | `/^indicator(\.maintenance)?\.lowbat$｜^indicator(\.maintenance)?\.battery$/` |
|   | MAINTAIN        | indicator.maintenance         |      | boolean |    | X   |      | `/^indicator\.maintenance$/`                                                 |
|   | ERROR           | indicator.error               |      |         |    | X   |      | `/^indicator\.error$/`                                                       |
|   | BATTERY         | value.battery                 | %    | number  | -  |     |      | `/^value\.battery$/`                                                         |


### Light dimmer [dimmer]
| R | Name            | Role                          | Unit | Type    | Wr | Enum | Ind | Mult | Regex                                                                        |
|---|-----------------|-------------------------------|------|---------|----|------|-----|------|------------------------------------------------------------------------------|
| * | SET             | level.dimmer                  | %    | number  | W  | E    |     |      | `/^level(\.dimmer)?$｜^level\.brightness$/`                                   |
|   | ACTUAL          | value.dimmer                  | %    | number  | -  | E    |     |      | `/^value(\.dimmer)?$/`                                                       |
|   | ON_SET          | switch.light                  |      | boolean | W  | E    |     |      | `/^switch(\.light)?$｜^state$/`                                               |
|   | ON_ACTUAL       | sensor.light                  |      | boolean | -  | E    |     |      | `/^(state｜switch｜sensor)\.light｜switch$/`                                    |
|   | TRANSITION_TIME | time.span                     | ms   | number  | W  | E    |     |      | `/^time(\.span｜\.interval)$/`                                                |
|   | ELECTRIC_POWER  | value.power                   | W    | number  | -  |      |     |      | `/^value\.power$/`                                                           |
|   | CURRENT         | value.current                 | mA   | number  | -  |      |     |      | `/^value\.current$/`                                                         |
|   | VOLTAGE         | value.voltage                 | V    | number  | -  |      |     |      | `/^value\.voltage$/`                                                         |
|   | CONSUMPTION     | value.power.consumption       | Wh   | number  | -  |      |     |      | `/^value\.power\.consumption$/`                                              |
|   | FREQUENCY       | value.frequency               | Hz   | number  | -  |      |     |      | `/^value\.frequency$/`                                                       |
|   | WORKING         | indicator.working             |      |         |    |      | X   |      | `/^indicator\.working$/`                                                     |
|   | UNREACH         | indicator.maintenance.unreach |      | boolean |    |      | X   |      | `/^indicator(\.maintenance)?\.unreach$/`                                     |
|   | LOWBAT          | indicator.maintenance.lowbat  |      | boolean |    |      | X   |      | `/^indicator(\.maintenance)?\.lowbat$｜^indicator(\.maintenance)?\.battery$/` |
|   | MAINTAIN        | indicator.maintenance         |      | boolean |    |      | X   |      | `/^indicator\.maintenance$/`                                                 |
|   | ERROR           | indicator.error               |      |         |    |      | X   |      | `/^indicator\.error$/`                                                       |
|   | BATTERY         | value.battery                 | %    | number  | -  |      |     |      | `/^value\.battery$/`                                                         |


### Door sensor [door]
| R | Name     | Role                          | Unit | Type    | Wr | Enum | Ind | Mult | Regex                                                                        |
|---|----------|-------------------------------|------|---------|----|------|-----|------|------------------------------------------------------------------------------|
| * | ACTUAL   | sensor.door                   |      | boolean | -  | E    |     |      | `/^state?$｜^state(\.door)?$｜^sensor(\.door)?/`                               |
|   | UNREACH  | indicator.maintenance.unreach |      | boolean |    |      | X   |      | `/^indicator(\.maintenance)?\.unreach$/`                                     |
|   | LOWBAT   | indicator.maintenance.lowbat  |      | boolean |    |      | X   |      | `/^indicator(\.maintenance)?\.lowbat$｜^indicator(\.maintenance)?\.battery$/` |
|   | MAINTAIN | indicator.maintenance         |      | boolean |    |      | X   |      | `/^indicator\.maintenance$/`                                                 |
|   | ERROR    | indicator.error               |      |         |    |      | X   |      | `/^indicator\.error$/`                                                       |
|   | BATTERY  | value.battery                 | %    | number  | -  |      |     |      | `/^value\.battery$/`                                                         |


### Fire alarm sensor [fireAlarm]
| R | Name     | Role                          | Unit | Type    | Wr | Ind | Mult | Regex                                                                        |
|---|----------|-------------------------------|------|---------|----|-----|------|------------------------------------------------------------------------------|
| * | ACTUAL   | sensor.alarm.fire             |      | boolean |    |     |      | `/^(state｜sensor｜indicator)(\.alarm)?\.fire$/`                               |
|   | UNREACH  | indicator.maintenance.unreach |      | boolean |    | X   |      | `/^indicator(\.maintenance)?\.unreach$/`                                     |
|   | LOWBAT   | indicator.maintenance.lowbat  |      | boolean |    | X   |      | `/^indicator(\.maintenance)?\.lowbat$｜^indicator(\.maintenance)?\.battery$/` |
|   | MAINTAIN | indicator.maintenance         |      | boolean |    | X   |      | `/^indicator\.maintenance$/`                                                 |
|   | ERROR    | indicator.error               |      |         |    | X   |      | `/^indicator\.error$/`                                                       |
|   | BATTERY  | value.battery                 | %    | number  | -  |     |      | `/^value\.battery$/`                                                         |


### Flood alarm sensor [floodAlarm]
| R | Name     | Role                          | Unit | Type    | Wr | Ind | Mult | Regex                                                                        |
|---|----------|-------------------------------|------|---------|----|-----|------|------------------------------------------------------------------------------|
| * | ACTUAL   | sensor.alarm.flood            |      | boolean |    |     |      | `/^(state｜sensor｜indicator)(\.alarm)?\.flood$/`                              |
|   | UNREACH  | indicator.maintenance.unreach |      | boolean |    | X   |      | `/^indicator(\.maintenance)?\.unreach$/`                                     |
|   | LOWBAT   | indicator.maintenance.lowbat  |      | boolean |    | X   |      | `/^indicator(\.maintenance)?\.lowbat$｜^indicator(\.maintenance)?\.battery$/` |
|   | MAINTAIN | indicator.maintenance         |      | boolean |    | X   |      | `/^indicator\.maintenance$/`                                                 |
|   | ERROR    | indicator.error               |      |         |    | X   |      | `/^indicator\.error$/`                                                       |
|   | BATTERY  | value.battery                 | %    | number  | -  |     |      | `/^value\.battery$/`                                                         |


### Gate [gate]
| R | Name      | Role                          | Unit | Type    | Wr | Enum | Ind | Mult | Regex                                    |
|---|-----------|-------------------------------|------|---------|----|------|-----|------|------------------------------------------|
| * | SET       | switch.gate                   |      | boolean | W  | E    |     |      | `/^switch(\.gate)?$/`                    |
|   | ACTUAL    | value.blind                   | %    | number  |    | E    |     |      | `/^value(\.position)?｜^value(\.gate)?$/` |
|   | STOP      | button.stop                   |      | boolean | W  | E    |     |      | `/^button\.stop$｜^action\.stop$/`        |
|   | DIRECTION | indicator.direction           |      | boolean |    |      | X   |      | `/^indicator\.direction$/`               |
|   | DIRECTION | level.direction               |      | number  |    |      |     |      | `/^(indicator｜level)\.direction$/`       |
|   | WORKING   | indicator.working             |      |         |    |      | X   |      | `/^indicator\.working$/`                 |
|   | UNREACH   | indicator.maintenance.unreach |      | boolean |    |      | X   |      | `/^indicator(\.maintenance)?\.unreach$/` |
|   | MAINTAIN  | indicator.maintenance         |      | boolean |    |      | X   |      | `/^indicator\.maintenance$/`             |
|   | ERROR     | indicator.error               |      |         |    |      | X   |      | `/^indicator\.error$/`                   |


### Light with HUE color [hue]
| R | Name            | Role                          | Unit | Type    | Wr | Ind | Mult | Regex                                                                        |
|---|-----------------|-------------------------------|------|---------|----|-----|------|------------------------------------------------------------------------------|
| * | HUE             | level.color.hue               | °    | number  | W  |     |      | `/^level\.color\.hue$/`                                                      |
|   | DIMMER          | level.dimmer                  | %    | number  | W  |     |      | `/^level\.dimmer$/`                                                          |
|   | BRIGHTNESS      |                               |      | number  | W  |     |      | `/^level\.brightness$/`                                                      |
|   | SATURATION      |                               |      | number  | W  |     |      | `/^level\.color\.saturation$/`                                               |
|   | TEMPERATURE     | level.color.temperature       | °K   | number  | W  |     |      | `/^level\.color\.temperature$/`                                              |
|   | ON              | switch.light                  |      | boolean | W  |     |      | `/^switch\.light$/`                                                          |
|   | ON              |                               |      | boolean | W  |     |      | `/^switch$/`                                                                 |
|   | ON_ACTUAL       | sensor.light                  |      | boolean | -  |     |      | `/^(state｜switch｜sensor)\.light｜switch$/`                                    |
|   | TRANSITION_TIME | time.span                     | ms   | number  | W  |     |      | `/^time(\.span｜\.interval)$/`                                                |
|   | ELECTRIC_POWER  | value.power                   | W    | number  | -  |     |      | `/^value\.power$/`                                                           |
|   | CURRENT         | value.current                 | mA   | number  | -  |     |      | `/^value\.current$/`                                                         |
|   | VOLTAGE         | value.voltage                 | V    | number  | -  |     |      | `/^value\.voltage$/`                                                         |
|   | CONSUMPTION     | value.power.consumption       | Wh   | number  | -  |     |      | `/^value\.power\.consumption$/`                                              |
|   | FREQUENCY       | value.frequency               | Hz   | number  | -  |     |      | `/^value\.frequency$/`                                                       |
|   | WORKING         | indicator.working             |      |         |    | X   |      | `/^indicator\.working$/`                                                     |
|   | UNREACH         | indicator.maintenance.unreach |      | boolean |    | X   |      | `/^indicator(\.maintenance)?\.unreach$/`                                     |
|   | LOWBAT          | indicator.maintenance.lowbat  |      | boolean |    | X   |      | `/^indicator(\.maintenance)?\.lowbat$｜^indicator(\.maintenance)?\.battery$/` |
|   | MAINTAIN        | indicator.maintenance         |      | boolean |    | X   |      | `/^indicator\.maintenance$/`                                                 |
|   | ERROR           | indicator.error               |      |         |    | X   |      | `/^indicator\.error$/`                                                       |
|   | BATTERY         | value.battery                 | %    | number  | -  |     |      | `/^value\.battery$/`                                                         |


### Humidity [humidity]
| R | Name     | Role                          | Unit | Type    | Wr | Ind | Mult | Regex                                                                        |
|---|----------|-------------------------------|------|---------|----|-----|------|------------------------------------------------------------------------------|
| * | ACTUAL   | value.humidity                | %    | number  | -  |     |      | `/humidity$/`                                                                |
|   | UNREACH  | indicator.maintenance.unreach |      | boolean |    | X   |      | `/^indicator(\.maintenance)?\.unreach$/`                                     |
|   | LOWBAT   | indicator.maintenance.lowbat  |      | boolean |    | X   |      | `/^indicator(\.maintenance)?\.lowbat$｜^indicator(\.maintenance)?\.battery$/` |
|   | MAINTAIN | indicator.maintenance         |      | boolean |    | X   |      | `/^indicator\.maintenance$/`                                                 |
|   | ERROR    | indicator.error               |      |         |    | X   |      | `/^indicator\.error$/`                                                       |
|   | BATTERY  | value.battery                 | %    | number  | -  |     |      | `/^value\.battery$/`                                                         |


### Illuminance sensor [illuminance]
| R | Name     | Role                          | Unit | Type    | Wr | Ind | Mult | Regex                                                                        |
|---|----------|-------------------------------|------|---------|----|-----|------|------------------------------------------------------------------------------|
| * | ACTUAL   | value.brightness              | lux  | number  | -  |     |      | `/brightness$/`                                                              |
|   | UNREACH  | indicator.maintenance.unreach |      | boolean |    | X   |      | `/^indicator(\.maintenance)?\.unreach$/`                                     |
|   | LOWBAT   | indicator.maintenance.lowbat  |      | boolean |    | X   |      | `/^indicator(\.maintenance)?\.lowbat$｜^indicator(\.maintenance)?\.battery$/` |
|   | MAINTAIN | indicator.maintenance         |      | boolean |    | X   |      | `/^indicator\.maintenance$/`                                                 |
|   | ERROR    | indicator.error               |      |         |    | X   |      | `/^indicator\.error$/`                                                       |
|   | BATTERY  | value.battery                 | %    | number  | -  |     |      | `/^value\.battery$/`                                                         |


### image [image]
| R | Name     | Role                          | Unit | Type    | Wr | Ind | Mult | Regex                                                                        |
|---|----------|-------------------------------|------|---------|----|-----|------|------------------------------------------------------------------------------|
| * | URL      |                               |      | string  | -  |     |      | `/\.icon$｜^icon$｜^icon\.｜\.icon\.｜\.chart\.url\.｜\.chart\.url$｜^url.icon$/`  |
|   | UNREACH  | indicator.maintenance.unreach |      | boolean |    | X   |      | `/^indicator(\.maintenance)?\.unreach$/`                                     |
|   | LOWBAT   | indicator.maintenance.lowbat  |      | boolean |    | X   |      | `/^indicator(\.maintenance)?\.lowbat$｜^indicator(\.maintenance)?\.battery$/` |
|   | MAINTAIN | indicator.maintenance         |      | boolean |    | X   |      | `/^indicator\.maintenance$/`                                                 |
|   | ERROR    | indicator.error               |      |         |    | X   |      | `/^indicator\.error$/`                                                       |
|   | BATTERY  | value.battery                 | %    | number  | -  |     |      | `/^value\.battery$/`                                                         |


### Information device (very simple) [info]
| R | Name     | Role                          | Unit | Type    | Wr | Ind | Mult | Regex                                                                        |
|---|----------|-------------------------------|------|---------|----|-----|------|------------------------------------------------------------------------------|
| * | ACTUAL   | state                         |      |         |    |     | x    |                                                                              |
|   | WORKING  | indicator.working             |      |         |    | X   |      | `/^indicator\.working$/`                                                     |
|   | UNREACH  | indicator.maintenance.unreach |      | boolean |    | X   |      | `/^indicator(\.maintenance)?\.unreach$/`                                     |
|   | LOWBAT   | indicator.maintenance.lowbat  |      | boolean |    | X   |      | `/^indicator(\.maintenance)?\.lowbat$｜^indicator(\.maintenance)?\.battery$/` |
|   | MAINTAIN | indicator.maintenance         |      | boolean |    | X   |      | `/^indicator\.maintenance$/`                                                 |
|   | ERROR    | indicator.error               |      |         |    | X   |      | `/^indicator\.error$/`                                                       |
|   | BATTERY  | value.battery                 | %    | number  | -  |     |      | `/^value\.battery$/`                                                         |


### Slider [levelSlider]
| R | Name     | Role                          | Unit | Type    | Wr | Min | Max | Ind | Mult | Regex                                                                        |
|---|----------|-------------------------------|------|---------|----|-----|-----|-----|------|------------------------------------------------------------------------------|
| * | SET      | level                         | %    | number  | W  | m   | M   |     |      | `/^level(\..*)?$/`                                                           |
|   | ACTUAL   | value                         |      | number  | -  | m   | M   |     |      | `/^value(\..*)?$/`                                                           |
|   | WORKING  | indicator.working             |      |         |    |     |     | X   |      | `/^indicator\.working$/`                                                     |
|   | UNREACH  | indicator.maintenance.unreach |      | boolean |    |     |     | X   |      | `/^indicator(\.maintenance)?\.unreach$/`                                     |
|   | LOWBAT   | indicator.maintenance.lowbat  |      | boolean |    |     |     | X   |      | `/^indicator(\.maintenance)?\.lowbat$｜^indicator(\.maintenance)?\.battery$/` |
|   | MAINTAIN | indicator.maintenance         |      | boolean |    |     |     | X   |      | `/^indicator\.maintenance$/`                                                 |
|   | ERROR    | indicator.error               |      |         |    |     |     | X   |      | `/^indicator\.error$/`                                                       |
|   | BATTERY  | value.battery                 | %    | number  | -  |     |     |     |      | `/^value\.battery$/`                                                         |


### Light switch [light]
| R | Name           | Role                          | Unit | Type    | Wr | Enum | Ind | Mult | Regex                                                                        |
|---|----------------|-------------------------------|------|---------|----|------|-----|------|------------------------------------------------------------------------------|
| * | SET            | switch.light                  |      | boolean | W  | E    |     |      | `/^switch(\.light)?$｜^state$/`                                               |
|   | ON_ACTUAL      | sensor.light                  |      | boolean | -  | E    |     |      | `/^(state｜switch｜sensor)\.light｜switch$/`                                    |
|   | ELECTRIC_POWER | value.power                   | W    | number  | -  |      |     |      | `/^value\.power$/`                                                           |
|   | CURRENT        | value.current                 | mA   | number  | -  |      |     |      | `/^value\.current$/`                                                         |
|   | VOLTAGE        | value.voltage                 | V    | number  | -  |      |     |      | `/^value\.voltage$/`                                                         |
|   | CONSUMPTION    | value.power.consumption       | Wh   | number  | -  |      |     |      | `/^value\.power\.consumption$/`                                              |
|   | FREQUENCY      | value.frequency               | Hz   | number  | -  |      |     |      | `/^value\.frequency$/`                                                       |
|   | WORKING        | indicator.working             |      |         |    |      | X   |      | `/^indicator\.working$/`                                                     |
|   | UNREACH        | indicator.maintenance.unreach |      | boolean |    |      | X   |      | `/^indicator(\.maintenance)?\.unreach$/`                                     |
|   | LOWBAT         | indicator.maintenance.lowbat  |      | boolean |    |      | X   |      | `/^indicator(\.maintenance)?\.lowbat$｜^indicator(\.maintenance)?\.battery$/` |
|   | MAINTAIN       | indicator.maintenance         |      | boolean |    |      | X   |      | `/^indicator\.maintenance$/`                                                 |
|   | ERROR          | indicator.error               |      |         |    |      | X   |      | `/^indicator\.error$/`                                                       |
|   | BATTERY        | value.battery                 | %    | number  | -  |      |     |      | `/^value\.battery$/`                                                         |


### GPS Location [location]
| R | Name      | Role                          | Unit | Type    | Wr | Ind | Mult | Regex                                                                        |
|---|-----------|-------------------------------|------|---------|----|-----|------|------------------------------------------------------------------------------|
| * | LONGITUDE | value.gps.longitude           | °    | number  | -  |     |      | `/^value\.gps\.longitude$/`                                                  |
| * | LATITUDE  | value.gps.latitude            | °    | number  | -  |     |      | `/^value\.gps\.latitude$/`                                                   |
|   | ELEVATION | value.gps.elevation           |      | number  | -  |     |      | `/^value\.gps\.elevation$/`                                                  |
|   | RADIUS    | value.gps.radius              |      | number  | -  |     |      | `/^value\.radius$｜value\.gps\.radius$/`                                      |
|   | ACCURACY  | value.gps.accuracy            |      | number  | -  |     |      | `/^value\.accuracy$｜^value\.gps\.accuracy$/`                                 |
|   | UNREACH   | indicator.maintenance.unreach |      | boolean |    | X   |      | `/^indicator(\.maintenance)?\.unreach$/`                                     |
|   | LOWBAT    | indicator.maintenance.lowbat  |      | boolean |    | X   |      | `/^indicator(\.maintenance)?\.lowbat$｜^indicator(\.maintenance)?\.battery$/` |
|   | MAINTAIN  | indicator.maintenance         |      | boolean |    | X   |      | `/^indicator\.maintenance$/`                                                 |
|   | ERROR     | indicator.error               |      |         |    | X   |      | `/^indicator\.error$/`                                                       |
|   | BATTERY   | value.battery                 | %    | number  | -  |     |      | `/^value\.battery$/`                                                         |


### GPS Location [location_one]
| R | Name      | Role                          | Unit | Type    | Wr | Ind | Mult | Regex                                                                        |
|---|-----------|-------------------------------|------|---------|----|-----|------|------------------------------------------------------------------------------|
| * | GPS       | value.gps                     |      | string  | -  |     |      | `/^value\.gps$/`                                                             |
|   | ELEVATION | value.gps.elevation           |      | number  | -  |     |      | `/^value\.gps\.elevation$/`                                                  |
|   | RADIUS    | value.gps.radius              |      | number  | -  |     |      | `/^value\.radius$｜value\.gps\.radius$/`                                      |
|   | ACCURACY  | value.gps.accuracy            |      | number  | -  |     |      | `/^value\.accuracy$｜^value\.gps\.accuracy$/`                                 |
|   | UNREACH   | indicator.maintenance.unreach |      | boolean |    | X   |      | `/^indicator(\.maintenance)?\.unreach$/`                                     |
|   | LOWBAT    | indicator.maintenance.lowbat  |      | boolean |    | X   |      | `/^indicator(\.maintenance)?\.lowbat$｜^indicator(\.maintenance)?\.battery$/` |
|   | MAINTAIN  | indicator.maintenance         |      | boolean |    | X   |      | `/^indicator\.maintenance$/`                                                 |
|   | ERROR     | indicator.error               |      |         |    | X   |      | `/^indicator\.error$/`                                                       |
|   | BATTERY   | value.battery                 | %    | number  | -  |     |      | `/^value\.battery$/`                                                         |


### Lock [lock]
| R | Name      | Role                          | Unit | Type    | Wr | Ind | Mult | Regex                                                                        |
|---|-----------|-------------------------------|------|---------|----|-----|------|------------------------------------------------------------------------------|
| * | SET       | switch.lock                   |      | boolean | W  |     |      | `/^switch\.lock$/`                                                           |
|   | ACTUAL    | state                         |      | boolean | -  |     |      | `/^state$/`                                                                  |
|   | OPEN      | button                        |      | boolean | W  |     |      |                                                                              |
|   | DIRECTION | indicator.direction           |      | boolean |    | X   |      | `/^indicator\.direction$/`                                                   |
|   | DIRECTION | level.direction               |      | number  |    |     |      | `/^(indicator｜level)\.direction$/`                                           |
|   | WORKING   | indicator.working             |      |         |    | X   |      | `/^indicator\.working$/`                                                     |
|   | UNREACH   | indicator.maintenance.unreach |      | boolean |    | X   |      | `/^indicator(\.maintenance)?\.unreach$/`                                     |
|   | LOWBAT    | indicator.maintenance.lowbat  |      | boolean |    | X   |      | `/^indicator(\.maintenance)?\.lowbat$｜^indicator(\.maintenance)?\.battery$/` |
|   | MAINTAIN  | indicator.maintenance         |      | boolean |    | X   |      | `/^indicator\.maintenance$/`                                                 |
|   | ERROR     | indicator.error               |      |         |    | X   |      | `/^indicator\.error$/`                                                       |
|   | BATTERY   | value.battery                 | %    | number  | -  |     |      | `/^value\.battery$/`                                                         |


### Media [mediaPlayer]
| R | Name          | Role                         | Unit | Type           | Wr | Min | Max | Ind | Mult | Regex                                                                        |
|---|---------------|------------------------------|------|----------------|----|-----|-----|-----|------|------------------------------------------------------------------------------|
| * | STATE         | media.state                  |      | boolean/number |    |     |     |     |      | `/^media.state(\..*)?$/`                                                     |
|   | PLAY          | button.play                  |      | boolean        | W  |     |     |     |      | `/^button.play(\..*)?$｜^action.play(\..*)?$/`                                |
|   | PAUSE         | button.pause                 |      | boolean        | W  |     |     |     |      | `/^button.pause(\..*)?$｜^action.pause(\..*)?$/`                              |
|   | STOP          | button.stop                  |      | boolean        | W  |     |     |     |      | `/^button.stop(\..*)?$｜^action.stop(\..*)?$/`                                |
|   | NEXT          | button.next                  |      | boolean        | W  |     |     |     |      | `/^button.next(\..*)?$｜^action.next(\..*)?$/`                                |
|   | PREV          | button.prev                  |      | boolean        | W  |     |     |     |      | `/^button.prev(\..*)?$｜^action.prev(\..*)?$/`                                |
|   | SHUFFLE       | media.mode.shuffle           |      | boolean        | W  |     |     |     |      | `/^media.mode.shuffle(\..*)?$/`                                              |
|   | REPEAT        | media.mode.repeat            |      | number         | W  |     |     |     |      | `/^media.mode.repeat(\..*)?$/`                                               |
|   | ARTIST        | media.artist                 |      | string         | -  |     |     |     |      | `/^media.artist(\..*)?$/`                                                    |
|   | ALBUM         | media.album                  |      | string         | -  |     |     |     |      | `/^media.album(\..*)?$/`                                                     |
|   | TITLE         | media.title                  |      | string         | -  |     |     |     |      | `/^media.title(\..*)?$/`                                                     |
|   | COVER         | media.cover                  |      | string         | -  |     |     |     |      | `/^media.cover$｜^media.cover.big$/`                                          |
|   | COVER         |                              |      | string         | -  |     |     |     |      | `/^media.cover(\..*)$/`                                                      |
|   | DURATION      | media.duration               | sec  | number         | -  |     |     |     |      | `/^media.duration(\..*)?$/`                                                  |
|   | ELAPSED       | media.elapsed                | sec  | number         |    |     |     |     |      | `/^media.elapsed(\..*)?$/`                                                   |
|   | SEEK          | media.seek                   |      | number         | W  |     |     |     |      | `/^media.seek(\..*)?$/`                                                      |
|   | TRACK         | media.track                  |      | string         |    |     |     |     |      | `/^media.track(\..*)?$/`                                                     |
|   | EPISODE       | media.episode                |      | string         |    |     |     |     |      | `/^media.episode(\..*)?$/`                                                   |
|   | SEASON        | media.season                 |      | string         |    |     |     |     |      | `/^media.season(\..*)?$/`                                                    |
|   | VOLUME        | level.volume                 |      | number         | W  | m   | M   |     |      | `/^level.volume?$/`                                                          |
|   | VOLUME_ACTUAL | value.volume                 |      | number         | -  | m   | M   |     |      | `/^value.volume?$/`                                                          |
|   | MUTE          | media.mute                   |      | boolean        | W  |     |     |     |      | `/^media.mute?$/`                                                            |
|   | IGNORE        |                              |      |                |    |     |     |     | x    |                                                                              |
|   | CONNECTED     | indicator.reachable          |      | boolean        |    |     |     | X   |      | `/^indicator\.reachable$/`                                                   |
|   | LOWBAT        | indicator.maintenance.lowbat |      | boolean        |    |     |     | X   |      | `/^indicator(\.maintenance)?\.lowbat$｜^indicator(\.maintenance)?\.battery$/` |
|   | MAINTAIN      | indicator.maintenance        |      | boolean        |    |     |     | X   |      | `/^indicator\.maintenance$/`                                                 |
|   | ERROR         | indicator.error              |      |                |    |     |     | X   |      | `/^indicator\.error$/`                                                       |
|   | BATTERY       | value.battery                | %    | number         | -  |     |     |     |      | `/^value\.battery$/`                                                         |


### Motion sensor [motion]
| R | Name     | Role                          | Unit | Type    | Wr | Ind | Mult | Regex                                                                        |
|---|----------|-------------------------------|------|---------|----|-----|------|------------------------------------------------------------------------------|
| * | ACTUAL   | sensor.motion                 |      | boolean |    |     |      | `/^state\.motion$｜^sensor\.motion$/`                                         |
|   | SECOND   | value.brightness              | lux  | number  |    |     |      | `/brightness$/`                                                              |
|   | UNREACH  | indicator.maintenance.unreach |      | boolean |    | X   |      | `/^indicator(\.maintenance)?\.unreach$/`                                     |
|   | LOWBAT   | indicator.maintenance.lowbat  |      | boolean |    | X   |      | `/^indicator(\.maintenance)?\.lowbat$｜^indicator(\.maintenance)?\.battery$/` |
|   | MAINTAIN | indicator.maintenance         |      | boolean |    | X   |      | `/^indicator\.maintenance$/`                                                 |
|   | ERROR    | indicator.error               |      |         |    | X   |      | `/^indicator\.error$/`                                                       |
|   | BATTERY  | value.battery                 | %    | number  | -  |     |      | `/^value\.battery$/`                                                         |


### RGB Light (R,G,B have different states) [rgb]
| R | Name            | Role                          | Unit | Type    | Wr | Ind | Mult | Regex                                                                        |
|---|-----------------|-------------------------------|------|---------|----|-----|------|------------------------------------------------------------------------------|
| * | RED             | level.color.red               |      | number  | W  |     |      | `/^level\.color\.red$/`                                                      |
| * | GREEN           | level.color.green             |      | number  | W  |     |      | `/^level\.color\.green$/`                                                    |
| * | BLUE            | level.color.blue              |      | number  | W  |     |      | `/^level\.color\.blue$/`                                                     |
|   | WHITE           | level.color.white             |      | number  | W  |     |      | `/^level\.color\.white$/`                                                    |
|   | DIMMER          | level.dimmer                  | %    | number  | W  |     |      | `/^level\.dimmer$/`                                                          |
|   | BRIGHTNESS      |                               |      | number  | W  |     |      | `/^level\.brightness$/`                                                      |
|   | SATURATION      |                               |      | number  | W  |     |      | `/^level\.color\.saturation$/`                                               |
|   | TEMPERATURE     | level.color.temperature       | °K   | number  | W  |     |      | `/^level\.color\.temperature$/`                                              |
|   | ON              | switch.light                  |      | boolean | W  |     |      | `/^switch\.light$/`                                                          |
|   | ON              |                               |      | boolean | W  |     |      | `/^switch$/`                                                                 |
|   | ON_ACTUAL       | sensor.light                  |      | boolean | -  |     |      | `/^(state｜switch｜sensor)\.light｜switch$/`                                    |
|   | TRANSITION_TIME | time.span                     | ms   | number  | W  |     |      | `/^time(\.span｜\.interval)$/`                                                |
|   | ELECTRIC_POWER  | value.power                   | W    | number  | -  |     |      | `/^value\.power$/`                                                           |
|   | CURRENT         | value.current                 | mA   | number  | -  |     |      | `/^value\.current$/`                                                         |
|   | VOLTAGE         | value.voltage                 | V    | number  | -  |     |      | `/^value\.voltage$/`                                                         |
|   | CONSUMPTION     | value.power.consumption       | Wh   | number  | -  |     |      | `/^value\.power\.consumption$/`                                              |
|   | FREQUENCY       | value.frequency               | Hz   | number  | -  |     |      | `/^value\.frequency$/`                                                       |
|   | WORKING         | indicator.working             |      |         |    | X   |      | `/^indicator\.working$/`                                                     |
|   | UNREACH         | indicator.maintenance.unreach |      | boolean |    | X   |      | `/^indicator(\.maintenance)?\.unreach$/`                                     |
|   | LOWBAT          | indicator.maintenance.lowbat  |      | boolean |    | X   |      | `/^indicator(\.maintenance)?\.lowbat$｜^indicator(\.maintenance)?\.battery$/` |
|   | MAINTAIN        | indicator.maintenance         |      | boolean |    | X   |      | `/^indicator\.maintenance$/`                                                 |
|   | ERROR           | indicator.error               |      |         |    | X   |      | `/^indicator\.error$/`                                                       |
|   | BATTERY         | value.battery                 | %    | number  | -  |     |      | `/^value\.battery$/`                                                         |


### RGB Light with hex color [rgbSingle]
| R | Name            | Role                          | Unit | Type    | Wr | Ind | Mult | Regex                                                                        |
|---|-----------------|-------------------------------|------|---------|----|-----|------|------------------------------------------------------------------------------|
| * | RGB             | level.color.rgb               |      | string  | W  |     |      | `/^level\.color\.rgb$/`                                                      |
|   | DIMMER          | level.dimmer                  | %    | number  | W  |     |      | `/^level\.dimmer$/`                                                          |
|   | BRIGHTNESS      |                               | %    | number  | W  |     |      | `/^level\.brightness$/`                                                      |
|   | SATURATION      |                               |      | number  | W  |     |      | `/^level\.color\.saturation$/`                                               |
|   | TEMPERATURE     | level.color.temperature       | °K   | number  | W  |     |      | `/^level\.color\.temperature$/`                                              |
|   | ON              | switch.light                  |      | boolean | W  |     |      | `/^switch\.light$/`                                                          |
|   | ON              |                               |      | boolean | W  |     |      | `/^switch$/`                                                                 |
|   | ON_ACTUAL       | sensor.light                  |      | boolean | -  |     |      | `/^(state｜switch｜sensor)\.light｜switch$/`                                    |
|   | TRANSITION_TIME | time.span                     | ms   | number  | W  |     |      | `/^time(\.span｜\.interval)$/`                                                |
|   | ELECTRIC_POWER  | value.power                   | W    | number  | -  |     |      | `/^value\.power$/`                                                           |
|   | CURRENT         | value.current                 | mA   | number  | -  |     |      | `/^value\.current$/`                                                         |
|   | VOLTAGE         | value.voltage                 | V    | number  | -  |     |      | `/^value\.voltage$/`                                                         |
|   | CONSUMPTION     | value.power.consumption       | Wh   | number  | -  |     |      | `/^value\.power\.consumption$/`                                              |
|   | FREQUENCY       | value.frequency               | Hz   | number  | -  |     |      | `/^value\.frequency$/`                                                       |
|   | WORKING         | indicator.working             |      |         |    | X   |      | `/^indicator\.working$/`                                                     |
|   | UNREACH         | indicator.maintenance.unreach |      | boolean |    | X   |      | `/^indicator(\.maintenance)?\.unreach$/`                                     |
|   | LOWBAT          | indicator.maintenance.lowbat  |      | boolean |    | X   |      | `/^indicator(\.maintenance)?\.lowbat$｜^indicator(\.maintenance)?\.battery$/` |
|   | MAINTAIN        | indicator.maintenance         |      | boolean |    | X   |      | `/^indicator\.maintenance$/`                                                 |
|   | ERROR           | indicator.error               |      |         |    | X   |      | `/^indicator\.error$/`                                                       |
|   | BATTERY         | value.battery                 | %    | number  | -  |     |      | `/^value\.battery$/`                                                         |


### RGBW Light with hex color [rgbwSingle]
| R | Name            | Role                          | Unit | Type    | Wr | Ind | Mult | Regex                                                                        |
|---|-----------------|-------------------------------|------|---------|----|-----|------|------------------------------------------------------------------------------|
| * | RGBW            | level.color.rgbw              |      | string  | W  |     |      | `/^level\.color\.rgbw$/`                                                     |
|   | DIMMER          | level.dimmer                  | %    | number  | W  |     |      | `/^level\.dimmer$/`                                                          |
|   | BRIGHTNESS      |                               | %    | number  | W  |     |      | `/^level\.brightness$/`                                                      |
|   | SATURATION      |                               |      | number  | W  |     |      | `/^level\.color\.saturation$/`                                               |
|   | TEMPERATURE     | level.color.temperature       | °K   | number  | W  |     |      | `/^level\.color\.temperature$/`                                              |
|   | ON              | switch.light                  |      | boolean | W  |     |      | `/^switch\.light$/`                                                          |
|   | ON              |                               |      | boolean | W  |     |      | `/^switch$/`                                                                 |
|   | ON_ACTUAL       | sensor.light                  |      | boolean | -  |     |      | `/^(state｜switch｜sensor)\.light｜switch$/`                                    |
|   | TRANSITION_TIME | time.span                     | ms   | number  | W  |     |      | `/^time(\.span｜\.interval)$/`                                                |
|   | ELECTRIC_POWER  | value.power                   | W    | number  | -  |     |      | `/^value\.power$/`                                                           |
|   | CURRENT         | value.current                 | mA   | number  | -  |     |      | `/^value\.current$/`                                                         |
|   | VOLTAGE         | value.voltage                 | V    | number  | -  |     |      | `/^value\.voltage$/`                                                         |
|   | CONSUMPTION     | value.power.consumption       | Wh   | number  | -  |     |      | `/^value\.power\.consumption$/`                                              |
|   | FREQUENCY       | value.frequency               | Hz   | number  | -  |     |      | `/^value\.frequency$/`                                                       |
|   | WORKING         | indicator.working             |      |         |    | X   |      | `/^indicator\.working$/`                                                     |
|   | UNREACH         | indicator.maintenance.unreach |      | boolean |    | X   |      | `/^indicator(\.maintenance)?\.unreach$/`                                     |
|   | LOWBAT          | indicator.maintenance.lowbat  |      | boolean |    | X   |      | `/^indicator(\.maintenance)?\.lowbat$｜^indicator(\.maintenance)?\.battery$/` |
|   | MAINTAIN        | indicator.maintenance         |      | boolean |    | X   |      | `/^indicator\.maintenance$/`                                                 |
|   | ERROR           | indicator.error               |      |         |    | X   |      | `/^indicator\.error$/`                                                       |
|   | BATTERY         | value.battery                 | %    | number  | -  |     |      | `/^value\.battery$/`                                                         |


### Socket [socket]
| R | Name           | Role                          | Unit | Type    | Wr | Ind | Mult | Regex                                                                        |
|---|----------------|-------------------------------|------|---------|----|-----|------|------------------------------------------------------------------------------|
| * | SET            | switch                        |      | boolean | W  |     |      | `/^switch$｜^state$｜^switch\.active$/`                                        |
|   | ACTUAL         | sensor.switch                 |      | boolean | -  |     |      | `/^state$｜^state\.active$/`                                                  |
|   | ELECTRIC_POWER | value.power                   | W    | number  | -  |     |      | `/^value\.power$/`                                                           |
|   | CURRENT        | value.current                 | mA   | number  | -  |     |      | `/^value\.current$/`                                                         |
|   | VOLTAGE        | value.voltage                 | V    | number  | -  |     |      | `/^value\.voltage$/`                                                         |
|   | CONSUMPTION    | value.power.consumption       | Wh   | number  | -  |     |      | `/^value\.power\.consumption$/`                                              |
|   | FREQUENCY      | value.frequency               | Hz   | number  | -  |     |      | `/^value\.frequency$/`                                                       |
|   | WORKING        | indicator.working             |      |         |    | X   |      | `/^indicator\.working$/`                                                     |
|   | UNREACH        | indicator.maintenance.unreach |      | boolean |    | X   |      | `/^indicator(\.maintenance)?\.unreach$/`                                     |
|   | LOWBAT         | indicator.maintenance.lowbat  |      | boolean |    | X   |      | `/^indicator(\.maintenance)?\.lowbat$｜^indicator(\.maintenance)?\.battery$/` |
|   | MAINTAIN       | indicator.maintenance         |      | boolean |    | X   |      | `/^indicator\.maintenance$/`                                                 |
|   | ERROR          | indicator.error               |      |         |    | X   |      | `/^indicator\.error$/`                                                       |


### Temperature [temperature]
| R | Name     | Role                          | Unit | Type    | Wr | Ind | Mult | Regex                                                                        |
|---|----------|-------------------------------|------|---------|----|-----|------|------------------------------------------------------------------------------|
| * | ACTUAL   | value.temperature             | °C   | number  | -  |     |      | `/temperature$/`                                                             |
|   | SECOND   | value.humidity                | %    | number  | -  |     |      | `/humidity$/`                                                                |
|   | UNREACH  | indicator.maintenance.unreach |      | boolean |    | X   |      | `/^indicator(\.maintenance)?\.unreach$/`                                     |
|   | LOWBAT   | indicator.maintenance.lowbat  |      | boolean |    | X   |      | `/^indicator(\.maintenance)?\.lowbat$｜^indicator(\.maintenance)?\.battery$/` |
|   | MAINTAIN | indicator.maintenance         |      | boolean |    | X   |      | `/^indicator\.maintenance$/`                                                 |
|   | ERROR    | indicator.error               |      |         |    | X   |      | `/^indicator\.error$/`                                                       |
|   | BATTERY  | value.battery                 | %    | number  | -  |     |      | `/^value\.battery$/`                                                         |


### Thermostat [thermostat]
| R | Name     | Role                          | Unit | Type           | Wr | Ind | Mult | Regex                                                                        |
|---|----------|-------------------------------|------|----------------|----|-----|------|------------------------------------------------------------------------------|
| * | SET      | level.temperature             | °C   | number         | W  |     |      | `/temperature(\..*)?$/`                                                      |
|   | ACTUAL   | value.temperature             | °C   | number         | -  |     |      | `/temperature(\..*)?$/`                                                      |
|   | HUMIDITY | value.humidity                | %    | number         | -  |     |      | `/humidity(\..*)?$/`                                                         |
|   | BOOST    | switch.mode.boost             |      | boolean/number | W  |     |      | `/^switch(\.mode)?\.boost(\..*)?$/`                                          |
|   | POWER    | switch.power                  |      | boolean/number | W  |     |      | `/^switch\.power$/`                                                          |
|   | PARTY    | switch.mode.party             |      | boolean/number | W  |     |      | `/^switch(\.mode)?\.party$/`                                                 |
|   | POWER    |                               |      | boolean        | W  |     |      | `/^switch$/`                                                                 |
|   | MODE     | level.mode.thermostat         |      | number         | W  |     |      | `/^level(\.mode)?\.thermostat$/`                                             |
|   | WORKING  | indicator.working             |      |                |    | X   |      | `/^indicator\.working$/`                                                     |
|   | UNREACH  | indicator.maintenance.unreach |      | boolean        |    | X   |      | `/^indicator(\.maintenance)?\.unreach$/`                                     |
|   | LOWBAT   | indicator.maintenance.lowbat  |      | boolean        |    | X   |      | `/^indicator(\.maintenance)?\.lowbat$｜^indicator(\.maintenance)?\.battery$/` |
|   | MAINTAIN | indicator.maintenance         |      | boolean        |    | X   |      | `/^indicator\.maintenance$/`                                                 |
|   | ERROR    | indicator.error               |      |                |    | X   |      | `/^indicator\.error$/`                                                       |
|   | BATTERY  | value.battery                 | %    | number         | -  |     |      | `/^value\.battery$/`                                                         |


### Vacuum cleaner (robot) [vacuumCleaner]
| R | Name        | Role                          | Unit | Type           | Wr | Ind | Mult | Regex                                                                        |
|---|-------------|-------------------------------|------|----------------|----|-----|------|------------------------------------------------------------------------------|
| * | POWER       | switch.power                  |      | boolean/number | W  |     |      | `/^switch\.power$/`                                                          |
| * | MODE        | level.mode.cleanup            |      | number         | W  |     |      | `/mode\.cleanup$/`                                                           |
|   | MAP_BASE64  | vacuum.map.base64             |      | string         | -  |     |      | `/vacuum\.map\.base64$/`                                                     |
|   | MAP_URL     |                               |      | string         | -  |     |      | `/vacuum\.map\.url$/`                                                        |
|   | WORK_MODE   | level.mode.work               |      | number         | W  |     |      | `/mode\.work$/`                                                              |
|   | WATER       | value.water                   | %    | number         | -  |     |      | `/^value\.water$/`                                                           |
|   | WASTE       | value.waste                   | %    | number         | -  |     |      | `/^value\.waste$/`                                                           |
|   | BATTERY     | value.battery                 | %    | number         | -  |     |      | `/^value\.battery$/`                                                         |
|   | STATE       | value.state                   |      | number/string  | -  |     |      | `/^value\.state$/`                                                           |
|   | PAUSE       | switch.pause                  |      | boolean        | W  |     |      | `/^switch\.pause$/`                                                          |
|   | WASTE_ALARM | indicator.maintenance.waste   |      | boolean        |    | X   |      | `/^indicator(\.maintenance)?\.waste$｜^indicator(\.alarm)?\.waste/`           |
|   | WATER_ALARM | indicator.maintenance.water   |      | boolean        |    | X   |      | `/^indicator(\.maintenance)?\.water$｜^indicator(\.alarm)?\.water/`           |
|   | FILTER      | value.usage.filter            | %    | number         |    | X   |      | `/^value(\.usage)?\.filter/`                                                 |
|   | BRUSH       | value.usage.brush             | %    | number         |    | X   |      | `/^value(\.usage)?\.brush/`                                                  |
|   | SENSORS     | value.usage.sensors           | %    | number         |    | X   |      | `/^value(\.usage)?\.sensors/`                                                |
|   | SIDE_BRUSH  | value.usage.brush.side        | %    | number         |    | X   |      | `/^value(\.usage)?\.brush\.side/`                                            |
|   | UNREACH     | indicator.maintenance.unreach |      | boolean        |    | X   |      | `/^indicator(\.maintenance)?\.unreach$/`                                     |
|   | LOWBAT      | indicator.maintenance.lowbat  |      | boolean        |    | X   |      | `/^indicator(\.maintenance)?\.lowbat$｜^indicator(\.maintenance)?\.battery$/` |
|   | MAINTAIN    | indicator.maintenance         |      | boolean        |    | X   |      | `/^indicator\.maintenance$/`                                                 |
|   | ERROR       | indicator.error               |      |                |    | X   |      | `/^indicator\.error$/`                                                       |
|   | BATTERY     | value.battery                 | %    | number         | -  |     |      | `/^value\.battery$/`                                                         |


### Volume [volume]
| R | Name     | Role                          | Unit | Type    | Wr | Min | Max | Ind | Mult | Regex                                                                        |
|---|----------|-------------------------------|------|---------|----|-----|-----|-----|------|------------------------------------------------------------------------------|
| * | SET      | level.volume                  |      | number  | W  | m   | M   |     |      | `/^level\.volume$/`                                                          |
|   | ACTUAL   | value.volume                  |      | number  | -  | m   | M   |     |      | `/^value\.volume$/`                                                          |
|   | MUTE     | media.mute                    |      | boolean | W  |     |     |     |      | `/^media\.mute$/`                                                            |
|   | WORKING  | indicator.working             |      |         |    |     |     | X   |      | `/^indicator\.working$/`                                                     |
|   | UNREACH  | indicator.maintenance.unreach |      | boolean |    |     |     | X   |      | `/^indicator(\.maintenance)?\.unreach$/`                                     |
|   | LOWBAT   | indicator.maintenance.lowbat  |      | boolean |    |     |     | X   |      | `/^indicator(\.maintenance)?\.lowbat$｜^indicator(\.maintenance)?\.battery$/` |
|   | MAINTAIN | indicator.maintenance         |      | boolean |    |     |     | X   |      | `/^indicator\.maintenance$/`                                                 |
|   | ERROR    | indicator.error               |      |         |    |     |     | X   |      | `/^indicator\.error$/`                                                       |
|   | BATTERY  | value.battery                 | %    | number  | -  |     |     |     |      | `/^value\.battery$/`                                                         |


### Volume group [volumeGroup]
| R | Name     | Role                          | Unit | Type    | Wr | Min | Max | Ind | Mult | Regex                                                                        |
|---|----------|-------------------------------|------|---------|----|-----|-----|-----|------|------------------------------------------------------------------------------|
| * | SET      | level.volume.group            |      | number  | W  | m   | M   |     |      | `/^level\.volume\.group?$/`                                                  |
|   | ACTUAL   | value.volume.group            |      | number  | -  | m   | M   |     |      | `/^value\.volume\.group$/`                                                   |
|   | MUTE     | media.mute.group              |      | boolean | W  |     |     |     |      | `/^media\.mute\.group$/`                                                     |
|   | WORKING  | indicator.working             |      |         |    |     |     | X   |      | `/^indicator\.working$/`                                                     |
|   | UNREACH  | indicator.maintenance.unreach |      | boolean |    |     |     | X   |      | `/^indicator(\.maintenance)?\.unreach$/`                                     |
|   | LOWBAT   | indicator.maintenance.lowbat  |      | boolean |    |     |     | X   |      | `/^indicator(\.maintenance)?\.lowbat$｜^indicator(\.maintenance)?\.battery$/` |
|   | MAINTAIN | indicator.maintenance         |      | boolean |    |     |     | X   |      | `/^indicator\.maintenance$/`                                                 |
|   | ERROR    | indicator.error               |      |         |    |     |     | X   |      | `/^indicator\.error$/`                                                       |
|   | BATTERY  | value.battery                 | %    | number  | -  |     |     |     |      | `/^value\.battery$/`                                                         |


### Warning [warning]
| R | Name  | Role                | Type   | Ind | Mult | Regex                       |
|---|-------|---------------------|--------|-----|------|-----------------------------|
| * | LEVEL | value.warning       |        |     |      | `/^value\.warning$/`        |
|   | TITLE | weather.title.short | string |     |      | `/^weather\.title\.short$/` |
|   | INFO  | weather.title       | string |     |      | `/^weather\.title$/`        |
|   | START | date.start          | string |     |      | `/^date\.start$/`           |
|   | END   | date.end            | string |     |      | `/^date\.end$/`             |
|   | START |                     | string |     |      | `/^date$/`                  |
|   | ICON  | weather.chart.url   | string |     |      | `/^weather\.chart\.url/`    |
|   | DESC  | weather.state       | string |     |      | `/^weather\.state$/`        |


### Current weather [weatherCurrent]
| R | Name                  | Role                          | Unit | Type    | Wr | Ind | Mult | Regex                                                                        |
|---|-----------------------|-------------------------------|------|---------|----|-----|------|------------------------------------------------------------------------------|
| * | ACTUAL                | value.temperature             | °C   | number  |    |     |      | `/^value(\.temperature)?$/`                                                  |
| * | ICON                  | weather.icon                  |      |         |    |     |      | `/^weather\.icon$/`                                                          |
|   | PRECIPITATION_CHANCE  | value.precipitation.chance    | %    | number  |    |     |      | `/^value\.precipitation\.chance$/`                                           |
|   | PRECIPITATION_TYPE    | value.precipitation.type      |      | number  |    |     |      | `/^value\.precipitation\.type$/`                                             |
|   | PRESSURE              | value.pressure                | mbar | number  |    |     |      | `/^value\.pressure$/`                                                        |
|   | PRESSURE_TENDENCY     | value.pressure.tendency       |      | string  |    |     |      | `/^value\.pressure\.tendency$/`                                              |
|   | REAL_FEEL_TEMPERATURE | value.temperature.windchill   | °C   | number  |    |     |      | `/^value\.temperature\.windchill$/`                                          |
|   | HUMIDITY              | value.humidity                | %    | number  |    |     |      | `/^value.humidity$/`                                                         |
|   | UV                    | value.uv                      |      | number  |    |     |      | `/^value.uv$/`                                                               |
|   | WEATHER               | weather.state                 |      | string  |    |     |      | `/^weather\.state$/`                                                         |
|   | WIND_DIRECTION        | value.direction.wind          | °    | string  |    |     |      | `/^value\.direction\.wind$/`                                                 |
|   | WIND_GUST             | value.speed.wind.gust         | km/h | number  |    |     |      | `/^value\.speed\.wind\.gust$/`                                               |
|   | WIND_SPEED            | value.speed.wind$             | km/h | number  |    |     |      | `/^value\.speed\.wind$/`                                                     |
|   | LOWBAT                | indicator.maintenance.lowbat  |      | boolean |    | X   |      | `/^indicator(\.maintenance)?\.lowbat$｜^indicator(\.maintenance)?\.battery$/` |
|   | UNREACH               | indicator.maintenance.unreach |      | boolean |    | X   |      | `/^indicator(\.maintenance)?\.unreach$/`                                     |
|   | MAINTAIN              | indicator.maintenance         |      | boolean |    | X   |      | `/^indicator\.maintenance$/`                                                 |
|   | ERROR                 | indicator.error               |      |         |    | X   |      | `/^indicator\.error$/`                                                       |
|   | BATTERY               | value.battery                 | %    | number  | -  |     |      | `/^value\.battery$/`                                                         |


### Weather forecast [weatherForecast]
| R | Name                   | Role                                   | Unit  | Type   | Ind | Mult | Regex                                                                      |
|---|------------------------|----------------------------------------|-------|--------|-----|------|----------------------------------------------------------------------------|
| * | ICON                   | weather.icon.forecast.0                |       | string |     |      | `/^weather.icon$｜^weather.icon.forecast.0$/`                               |
| * | TEMP_MIN               | value.temperature.min.forecast.0       |       | number |     |      | `/^value.temperature.min.forecast.0$/`                                     |
| * | TEMP_MAX               | value.temperature.max.forecast.0       |       | number |     |      | `/^value.temperature.max.forecast.0$/`                                     |
|   | PRECIPITATION_CHANCE   | value.precipitation.forecast.0         |  / %  | number |     |      | `/^value.precipitation$｜^value.precipitation.forecast.0$/`                 |
|   | PRECIPITATION          | value.precipitation.forecast.0         |  / mm | number |     |      | `/^value.precipitation$｜^value.precipitation.forecast.0$/`                 |
|   | DATE                   | date.forecast.0                        |       | string |     |      | `/^date$｜^date.forecast.0$/`                                               |
|   | DOW                    | dayofweek.forecast.0                   |       | string |     |      | `/^dayofweek$｜^dayofweek.forecast.0$/`                                     |
|   | STATE                  | weather.state.forecast.0               |       | string |     |      | `/^weather.state$｜^weather.state.forecast.0$/`                             |
|   | TEMP                   | value.temperature.forecast.0           |       | number |     |      | `/^value.temperature$｜^value.temperature.forecast.0$/`                     |
|   | PRESSURE               | weather.icon.forecast.0                |       | number |     |      | `/^value.pressure$/`                                                       |
|   | HUMIDITY               | value.humidity.forecast.0              |       | number |     |      | `/^value.humidity$｜value.humidity.forecast.0$/`                            |
|   | TIME_SUNRISE           | date.sunrise                           |       | string |     |      | `/^(?:date｜time).sunrise(?:.forecast\.0)?$/`                               |
|   | TIME_SUNSET            | date.sunset                            |       | string |     |      | `/^(?:date｜time).sunset(?:.forecast\.0)?$/`                                |
|   | WIND_CHILL             | value.temperature.windchill.forecast.0 |       | number |     |      | `/^value.temperature.windchill$｜^value.temperature.windchill.forecast.0$/` |
|   | FEELS_LIKE             | value.temperature.feelslike.forecast.0 |       | number |     |      | `/^value.temperature.feelslike$｜^value.temperature.feelslike.forecast.0$/` |
|   | WIND_SPEED             | value.speed.wind.forecast.0            |       | number |     |      | `/^value.speed.wind$｜^value.speed.wind.forecast.0$/`                       |
|   | WIND_DIRECTION         | value.direction.wind.forecast.0        |       | number |     |      | `/^value.direction.wind$｜^value.direction.wind.forecast.0$/`               |
|   | WIND_DIRECTION_STR     | weather.direction.wind.forecast.0      |       | string |     |      | `/^weather.direction.wind$｜^weather.direction.wind.forecast.0$/`           |
|   | WIND_ICON              | weather.icon.wind.forecast.0           |       | string |     |      | `/^weather.icon.wind$｜^weather.icon.wind.forecast.0$/`                     |
|   | HISTORY_CHART          | weather.chart.url                      |       | string |     |      | `/^weather.chart.url$/`                                                    |
|   | FORECAST_CHART         | weather.chart.url.forecast             |       | string |     |      | `/^weather.chart.url.forecast$/`                                           |
|   | LOCATION               | location                               |       | string |     |      | `/^location$/`                                                             |
|   | ICON%d                 |                                        |       | string |     | x    | `/^weather.icon.forecast.(\d)$/`                                           |
|   | TEMP_MIN%d             |                                        |       | number |     | x    | `/^value.temperature.min.forecast.(\d)$/`                                  |
|   | TEMP_MAX%d             |                                        |       | number |     | x    | `/^value.temperature.max.forecast.(\d)$/`                                  |
|   | DATE%d                 |                                        |       | string |     | x    | `/^date.forecast.(\d)$/`                                                   |
|   | DOW%d                  |                                        |       | string |     | x    | `/^dayofweek.forecast.(\d)$/`                                              |
|   | STATE%d                |                                        |       | string |     | x    | `/^weather.state.forecast.(\d)$/`                                          |
|   | TEMP%d                 |                                        |       | number |     | x    | `/^value.temperature.forecast.(\d)$/`                                      |
|   | HUMIDITY%d             |                                        |       | number |     | x    | `/^value.humidity.forecast.(\d)$/`                                         |
|   | HUMIDITY_MAX%d         |                                        |       | number |     | x    | `/^value.humidity.max.forecast.(\d)$/`                                     |
|   | PRECIPITATION_CHANCE%d |                                        |  / %  | number |     | x    | `/^value.precipitation.forecast.(\d)$/`                                    |
|   | PRECIPITATION%d        |                                        |  / mm | number |     | x    | `/^value.precipitation.forecast.(\d)$/`                                    |
|   | WIND_SPEED%d           |                                        |       | number |     | x    | `/^value.speed.wind.forecast.(\d)$/`                                       |
|   | WIND_DIRECTION%d       |                                        |       | number |     | x    | `/^value.direction.wind.forecast.(\d)$/`                                   |
|   | WIND_DIRECTION_STR%d   |                                        |       | string |     | x    | `/^weather.direction.wind.forecast.(\d)$/`                                 |
|   | WIND_ICON%d            |                                        |       | string |     | x    | `/^weather.icon.wind.forecast.(\d)$/`                                      |


### Window [window]
| R | Name     | Role                          | Unit | Type    | Wr | Enum | Ind | Mult | Regex                                                                        |
|---|----------|-------------------------------|------|---------|----|------|-----|------|------------------------------------------------------------------------------|
| * | ACTUAL   | sensor.window                 |      | boolean |    | E    |     |      | `/^state(\.window)?$｜^sensor(\.window)?/`                                    |
|   | UNREACH  | indicator.maintenance.unreach |      | boolean |    |      | X   |      | `/^indicator(\.maintenance)?\.unreach$/`                                     |
|   | LOWBAT   | indicator.maintenance.lowbat  |      | boolean |    |      | X   |      | `/^indicator(\.maintenance)?\.lowbat$｜^indicator(\.maintenance)?\.battery$/` |
|   | MAINTAIN | indicator.maintenance         |      | boolean |    |      | X   |      | `/^indicator\.maintenance$/`                                                 |
|   | ERROR    | indicator.error               |      |         |    |      | X   |      | `/^indicator\.error$/`                                                       |
|   | BATTERY  | value.battery                 | %    | number  | -  |      |     |      | `/^value\.battery$/`                                                         |


### Window that could be in tilted state [windowTilt]
| R | Name     | Role                          | Unit | Type    | Wr | Enum | Ind | Mult | Regex                                                                        |
|---|----------|-------------------------------|------|---------|----|------|-----|------|------------------------------------------------------------------------------|
| * | ACTUAL   | value.window                  |      | number  |    | E    |     |      | `/^state?$｜^value(\.window)?$/`                                              |
|   | UNREACH  | indicator.maintenance.unreach |      | boolean |    |      | X   |      | `/^indicator(\.maintenance)?\.unreach$/`                                     |
|   | LOWBAT   | indicator.maintenance.lowbat  |      | boolean |    |      | X   |      | `/^indicator(\.maintenance)?\.lowbat$｜^indicator(\.maintenance)?\.battery$/` |
|   | MAINTAIN | indicator.maintenance         |      | boolean |    |      | X   |      | `/^indicator\.maintenance$/`                                                 |
|   | ERROR    | indicator.error               |      |         |    |      | X   |      | `/^indicator\.error$/`                                                       |
|   | BATTERY  | value.battery                 | %    | number  | -  |      |     |      | `/^value\.battery$/`                                                         |



## Categories
### door
To detect these devices, it must belong to one of the following categories (any regex in any language):
- **en**: ``/doors?/i``, ``/gates?/i``, ``/wickets?/i``, ``/entry|entries/i``
- **de**: ``/^türe?/i``, ``/^tuere?/i``, ``/^tore?$/i``, ``/einfahrt(en)?/i``, ``/pforten?/i``
- **ru**: ``/двери|дверь/i``, ``/ворота/i``, ``/калитка|калитки/``, ``/въезды?/i``, ``/входы?/i``

Or has one of the roles: 
`door`, `state.door`, `sensor.door`

### window
To detect these devices, it must belong to one of the following categories (any regex in any language):
- **en**: ``/blinds?/i``, ``/windows?/i``, ``/shutters?/i``
- **de**: ``/rollladen?/i``, ``/fenstern?/i``, ``/beschattung(en)?/i``, ``/jalousien?/i``
- **ru**: ``/ставни/i``, ``/рольставни/i``, ``/окна|окно/``, ``/жалюзи/i``

Or has one of the roles: 
`window`, `state.window`, `sensor.window`, `value.window`

### blind
To detect these devices, it must belong to one of the following categories (any regex in any language):
- **en**: ``/blinds?/i``, ``/windows?/i``, ``/shutters?/i``
- **de**: ``/rollladen?/i``, ``/fenstern?/i``, ``/beschattung(en)?/i``, ``/jalousien?/i``
- **ru**: ``/ставни/i``, ``/рольставни/i``, ``/окна|окно/``, ``/жалюзи/i``

Or has one of the roles: 
`blind`, `level.blind`, `value.blind`, `action.stop`, `button.stop`, `button.stop.blind`, `button.open.blind`, `button.close.blind`, `level.tilt`, `value.tilt`, `button.tilt.open`, `button.tilt.close`, `button.tilt.stop`

### gate
To detect these devices, it must belong to one of the following categories (any regex in any language):
- **en**: ``/gates?/i``
- **de**: ``/^toren$/i``, ``/^tor$/i``
- **ru**: ``/ворота/i``

Or has one of the roles: 
`gate`, `value.gate`, `switch.gate`, `action.stop`, `button.stop`

### light
To detect these devices, it must belong to one of the following categories (any regex in any language):
- **en**: ``/lights?/i``, ``/lamps?/i``, ``/ceilings?/i``
- **de**: ``/licht(er)?/i``, ``/lampen?/i``, ``/beleuchtung(en)?/i``
- **ru**: ``/свет/i``, ``/ламп[аы]/i``, ``/торшеры?/``, ``/подсветк[аи]/i``, ``/лампочк[аи]/i``, ``/светильники?/i``

Or has one of the roles: 
`switch.light`, `dimmer`, `value.dimmer`, `level.dimmer`, `sensor.light`, `state.light`
