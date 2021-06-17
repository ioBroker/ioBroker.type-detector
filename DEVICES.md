# ioBroker device types

Fields:
- **R** - If the state is mandatory and must be in the channel/device.
- **Name** - Name describes the function of a state in a channel or in a device and is not 
  connected to the name of the ioBroker state. 
  Important is that role, enum, type, and write attribute are the same as in the table.
- **Role** - Optimal role of the state. But it could variate itself. Check the regex to be sure if the role is suitable.
- **Unit** - Desired unit. After the slash is *required unit*.
- **Type** - Required type
- **Wr** - Is the state must be writable or not. 'W' - must be writable, '-' - must be not writeable.
- **Min** - State must have min attribute.
- **Max** - State must have max attribute.
- **Enum** - State must belong to specific category
- **Ind** - Is the state is an indicator. Indicators will be shown as a small icon in material.
- **Regex** - Role regex


## Air conditioner
| R | Name     | Role                          | Unit | Type           | Wr | Ind | Regex                                    |
|---|----------|-------------------------------|------|----------------|----|-----|------------------------------------------|
| * | SET      | level.temperature             | °C   | number         | W  |     | `/temperature(\..*)?$/`                  |
| * | MODE     | level.mode.airconditioner     |      | number         | W  |     | `/airconditioner$/`                      |
|   | SPEED    | level.mode.fan                |      | number         | W  |     | `/(speed|mode)\.fan$/`                   |
|   | POWER    | switch.power                  |      | boolean/number | W  |     | `/^switch\.power$/`                      |
|   | POWER    |                               |      | boolean        | W  |     | `/^switch$/`                             |
|   | ACTUAL   | value.temperature             | °C   | number         | -  |     | `/temperature(\..*)?$/`                  |
|   | HUMIDITY | value.humidity                | %    | number         | -  |     | `/humidity(\..*)?$/`                     |
|   | BOOST    | switch.boost                  |      | boolean/number | W  |     | `/^switch\.boost(\..*)?$/`               |
|   | SWING    | level.mode.swing              |      | number         | W  |     | `/swing$/`                               |
|   | SWING    | switch.mode.swing             |      | boolean        | W  |     | `/swing$/`                               |
|   | UNREACH  | indicator.maintenance.unreach |      | boolean        |    | X   | `/^indicator(\.maintenance)?\.unreach$/` |
|   | MAINTAIN | indicator.maintenance         |      | boolean        |    | X   | `/^indicator\.maintenance$/`             |
|   | ERROR    | indicator.error               |      |                |    | X   | `/^indicator\.error$/`                   |


## Blinds controlled only by buttons
| R | Name        | Role                          | Type    | Wr | Ind | Regex                                                                       |
|---|-------------|-------------------------------|---------|----|-----|-----------------------------------------------------------------------------|
| * | STOP        | button.blind.stop             | boolean | W  |     | `/^button\.stop(\.blind)?$|^action\.stop$/`                                 |
| * | OPEN        | button.blind.open             | boolean | W  |     | `/^button\.open(\.blind)?$/`                                                |
| * | CLOSE       | button.blind.close            | boolean | W  |     | `/^button\.close(\.blind)?$/`                                               |
|   | TILT_SET    | level.open.tilt               | number  | W  |     | `/^level\.tilt$/`                                                           |
|   | TILT_ACTUAL | value.open.tilt               | number  |    |     | `/^value\.tilt$/`                                                           |
|   | TILT_STOP   | button.tilt.stop              | boolean | W  |     | `/^button\.stop\.tilt$/`                                                    |
|   | TILT_OPEN   | button.tilt.open              | boolean | W  |     | `/^button\.open\.tilt$/`                                                    |
|   | TILT_CLOSE  | button.tilt.close             | boolean | W  |     | `/^button\.close\.tilt$/`                                                   |
|   | DIRECTION   | indicator.direction           |         |    | X   | `/^indicator\.direction$/`                                                  |
|   | WORKING     | indicator.working             |         |    | X   | `/^indicator\.working$/`                                                    |
|   | UNREACH     | indicator.maintenance.unreach | boolean |    | X   | `/^indicator(\.maintenance)?\.unreach$/`                                    |
|   | LOWBAT      | indicator.maintenance.lowbat  | boolean |    | X   | `/^indicator(\.maintenance)?\.lowbat$|^indicator(\.maintenance)?\.battery/` |
|   | MAINTAIN    | indicator.maintenance         | boolean |    | X   | `/^indicator\.maintenance$/`                                                |
|   | ERROR       | indicator.error               |         |    | X   | `/^indicator\.error$/`                                                      |


## Button
| R | Name     | Role                          | Type    | Wr | Ind | Regex                                                                       |
|---|----------|-------------------------------|---------|----|-----|-----------------------------------------------------------------------------|
| * | SET      | button                        | boolean | W  |     | `/^button(\.[.\w]+)?$|^action(\.[.\w]+)?$/`                                 |
|   | UNREACH  | indicator.maintenance.unreach | boolean |    | X   | `/^indicator(\.maintenance)?\.unreach$/`                                    |
|   | LOWBAT   | indicator.maintenance.lowbat  | boolean |    | X   | `/^indicator(\.maintenance)?\.lowbat$|^indicator(\.maintenance)?\.battery/` |
|   | MAINTAIN | indicator.maintenance         | boolean |    | X   | `/^indicator\.maintenance$/`                                                |
|   | ERROR    | indicator.error               |         |    | X   | `/^indicator\.error$/`                                                      |


## buttonSensor
| R | Name       | Role                          | Type    | Wr | Ind | Regex                                                                       |
|---|------------|-------------------------------|---------|----|-----|-----------------------------------------------------------------------------|
| * | PRESS      | button.press                  | boolean | -  |     | `/^button(\.[.\w]+)?$/`                                                     |
|   | PRESS_LONG | button.long                   | boolean | -  |     | `/^button\.long/`                                                           |
|   | UNREACH    | indicator.maintenance.unreach | boolean |    | X   | `/^indicator(\.maintenance)?\.unreach$/`                                    |
|   | LOWBAT     | indicator.maintenance.lowbat  | boolean |    | X   | `/^indicator(\.maintenance)?\.lowbat$|^indicator(\.maintenance)?\.battery/` |
|   | MAINTAIN   | indicator.maintenance         | boolean |    | X   | `/^indicator\.maintenance$/`                                                |
|   | ERROR      | indicator.error               |         |    | X   | `/^indicator\.error$/`                                                      |


## IP Camera
| R | Name             | Role                           | Type    | Wr | Ind | Regex                                                                       |
|---|------------------|--------------------------------|---------|----|-----|-----------------------------------------------------------------------------|
| * | FILE             | camera                         | file    |    |     | `/^camera(\.\w+)?$/`                                                        |
|   | AUTOFOCUS        | switch.camera.autofocus        | boolean | W  |     | `/^switch(\.camera)?\.autofocus$/`                                          |
|   | AUTOWHITEBALANCE | switch.camera.autowhitebalance | boolean | W  |     | `/^switch(\.camera)?\.autowhitebalance$/`                                   |
|   | BRIGHTNESS       | switch.camera.brightness       | boolean | W  |     | `/^switch(\.camera)?\.brightness$/`                                         |
|   | NIGHTMODE        | switch.camera.nightmode        | boolean | W  |     | `/^switch(\.camera)?\.nightmode$/`                                          |
|   | PTZ              | level.camera.position          | number  | W  |     | `/^level(\.camera)?\.position$|^level(\.camera)?(\.ptz)$/`                  |
|   | UNREACH          | indicator.maintenance.unreach  | boolean |    | X   | `/^indicator(\.maintenance)?\.unreach$/`                                    |
|   | LOWBAT           | indicator.maintenance.lowbat   | boolean |    | X   | `/^indicator(\.maintenance)?\.lowbat$|^indicator(\.maintenance)?\.battery/` |
|   | MAINTAIN         | indicator.maintenance          | boolean |    | X   | `/^indicator\.maintenance$/`                                                |
|   | ERROR            | indicator.error                |         |    | X   | `/^indicator\.error$/`                                                      |


## Light with color temperature
| R | Name        | Role                          | Unit | Type    | Wr | Ind | Regex                                                                       |
|---|-------------|-------------------------------|------|---------|----|-----|-----------------------------------------------------------------------------|
| * | TEMPERATURE | level.color.temperature       | °K   | number  | W  |     | `/^level\.color\.temperature$/`                                             |
|   | DIMMER      | level.dimmer                  | %    | number  | W  |     | `/^level\.dimmer$/`                                                         |
|   | BRIGHTNESS  |                               |      | number  | W  |     | `/^level\.brightness$/`                                                     |
|   | SATURATION  |                               |      | number  | W  |     | `/^level\.color\.saturation$/`                                              |
|   | ON          | switch.light                  |      | boolean | W  |     | `/^switch\.light$/`                                                         |
|   | ON          |                               |      | boolean | W  |     | `/^switch$/`                                                                |
|   | WORKING     | indicator.working             |      |         |    | X   | `/^indicator\.working$/`                                                    |
|   | UNREACH     | indicator.maintenance.unreach |      | boolean |    | X   | `/^indicator(\.maintenance)?\.unreach$/`                                    |
|   | LOWBAT      | indicator.maintenance.lowbat  |      | boolean |    | X   | `/^indicator(\.maintenance)?\.lowbat$|^indicator(\.maintenance)?\.battery/` |
|   | MAINTAIN    | indicator.maintenance         |      | boolean |    | X   | `/^indicator\.maintenance$/`                                                |
|   | ERROR       | indicator.error               |      |         |    | X   | `/^indicator\.error$/`                                                      |


## Light dimmer
| R | Name      | Role                          | Unit | Type    | Wr | Ind | Regex                                                                       |
|---|-----------|-------------------------------|------|---------|----|-----|-----------------------------------------------------------------------------|
| * | SET       | level.dimmer                  | %    | number  | W  |     | `/^level(\.dimmer)?$|^level\.brightness$/`                                  |
|   | ACTUAL    | value.dimmer                  | %    | number  | -  |     | `/^value(\.dimmer)?$/`                                                      |
|   | ON_SET    | switch.light                  |      | boolean | W  |     | `/^switch(\.light)?$|^state$/`                                              |
|   | ON_ACTUAL | switch.light                  |      | boolean | -  |     | `/^switch(\.light)?$|^state$/`                                              |
|   | WORKING   | indicator.working             |      |         |    | X   | `/^indicator\.working$/`                                                    |
|   | UNREACH   | indicator.maintenance.unreach |      | boolean |    | X   | `/^indicator(\.maintenance)?\.unreach$/`                                    |
|   | LOWBAT    | indicator.maintenance.lowbat  |      | boolean |    | X   | `/^indicator(\.maintenance)?\.lowbat$|^indicator(\.maintenance)?\.battery/` |
|   | MAINTAIN  | indicator.maintenance         |      | boolean |    | X   | `/^indicator\.maintenance$/`                                                |
|   | ERROR     | indicator.error               |      |         |    | X   | `/^indicator\.error$/`                                                      |


## Door sensor
| R | Name     | Role                          | Type    | Wr | Ind | Regex                                                                       |
|---|----------|-------------------------------|---------|----|-----|-----------------------------------------------------------------------------|
| * | ACTUAL   | sensor.door                   | boolean | -  |     | `/^state?$|^state(\.door)?$|^sensor(\.door)?/`                              |
|   | UNREACH  | indicator.maintenance.unreach | boolean |    | X   | `/^indicator(\.maintenance)?\.unreach$/`                                    |
|   | LOWBAT   | indicator.maintenance.lowbat  | boolean |    | X   | `/^indicator(\.maintenance)?\.lowbat$|^indicator(\.maintenance)?\.battery/` |
|   | MAINTAIN | indicator.maintenance         | boolean |    | X   | `/^indicator\.maintenance$/`                                                |
|   | ERROR    | indicator.error               |         |    | X   | `/^indicator\.error$/`                                                      |


## Fire alarm sensor
| R | Name     | Role                          | Type    | Ind | Regex                                                                       |
|---|----------|-------------------------------|---------|-----|-----------------------------------------------------------------------------|
| * | ACTUAL   | sensor.alarm.fire             | boolean |     | `/^state(\.alarm)?\.fire$|^sensor(\.alarm)?\.fire/`                         |
|   | UNREACH  | indicator.maintenance.unreach | boolean | X   | `/^indicator(\.maintenance)?\.unreach$/`                                    |
|   | LOWBAT   | indicator.maintenance.lowbat  | boolean | X   | `/^indicator(\.maintenance)?\.lowbat$|^indicator(\.maintenance)?\.battery/` |
|   | MAINTAIN | indicator.maintenance         | boolean | X   | `/^indicator\.maintenance$/`                                                |
|   | ERROR    | indicator.error               |         | X   | `/^indicator\.error$/`                                                      |


## Flood alarm sensor
| R | Name     | Role                          | Type    | Ind | Regex                                                                       |
|---|----------|-------------------------------|---------|-----|-----------------------------------------------------------------------------|
| * | ACTUAL   | sensor.alarm.flood            | boolean |     | `/^state(\.alarm)?\.flood$|^sensor(\.alarm)?\.flood/`                       |
|   | UNREACH  | indicator.maintenance.unreach | boolean | X   | `/^indicator(\.maintenance)?\.unreach$/`                                    |
|   | LOWBAT   | indicator.maintenance.lowbat  | boolean | X   | `/^indicator(\.maintenance)?\.lowbat$|^indicator(\.maintenance)?\.battery/` |
|   | MAINTAIN | indicator.maintenance         | boolean | X   | `/^indicator\.maintenance$/`                                                |
|   | ERROR    | indicator.error               |         | X   | `/^indicator\.error$/`                                                      |


## Gate
| R | Name      | Role                          | Unit | Type    | Wr | Ind | Regex                                    |
|---|-----------|-------------------------------|------|---------|----|-----|------------------------------------------|
| * | SET       | switch.gate                   |      | boolean | W  |     | `/^switch(\.gate)?$/`                    |
|   | ACTUAL    | value.blind                   | %    | number  |    |     | `/^value(\.position)?|^value(\.gate)?$/` |
|   | STOP      | button.stop                   |      | boolean | W  |     | `/^button\.stop$|^action\.stop$/`        |
|   | DIRECTION | indicator.direction           |      |         |    | X   | `/^indicator\.direction$/`               |
|   | WORKING   | indicator.working             |      |         |    | X   | `/^indicator\.working$/`                 |
|   | UNREACH   | indicator.maintenance.unreach |      | boolean |    | X   | `/^indicator(\.maintenance)?\.unreach$/` |
|   | MAINTAIN  | indicator.maintenance         |      | boolean |    | X   | `/^indicator\.maintenance$/`             |
|   | ERROR     | indicator.error               |      |         |    | X   | `/^indicator\.error$/`                   |


## Light with HUE color
| R | Name        | Role                          | Unit | Type    | Wr | Ind | Regex                                                                       |
|---|-------------|-------------------------------|------|---------|----|-----|-----------------------------------------------------------------------------|
| * | HUE         | level.color.hue               | °    | number  | W  |     | `/^level\.color\.hue$/`                                                     |
|   | DIMMER      | level.dimmer                  | °C   | number  | W  |     | `/^level\.dimmer$/`                                                         |
|   | BRIGHTNESS  |                               |      | number  | W  |     | `/^level\.brightness$/`                                                     |
|   | SATURATION  |                               |      | number  | W  |     | `/^level\.color\.saturation$/`                                              |
|   | TEMPERATURE | level.color.temperature       | °K   | number  | W  |     | `/^level\.color\.temperature$/`                                             |
|   | ON          | switch.light                  |      | boolean | W  |     | `/^switch\.light$/`                                                         |
|   | ON          | switch.light                  |      | boolean | W  |     | `/^switch$/`                                                                |
|   | ON_ACTUAL   | state.light                   |      | boolean | -  |     | `/^state(\.light)?$/`                                                       |
|   | WORKING     | indicator.working             |      |         |    | X   | `/^indicator\.working$/`                                                    |
|   | UNREACH     | indicator.maintenance.unreach |      | boolean |    | X   | `/^indicator(\.maintenance)?\.unreach$/`                                    |
|   | LOWBAT      | indicator.maintenance.lowbat  |      | boolean |    | X   | `/^indicator(\.maintenance)?\.lowbat$|^indicator(\.maintenance)?\.battery/` |
|   | MAINTAIN    | indicator.maintenance         |      | boolean |    | X   | `/^indicator\.maintenance$/`                                                |
|   | ERROR       | indicator.error               |      |         |    | X   | `/^indicator\.error$/`                                                      |


## Humidity
| R | Name     | Role                          | Unit | Type    | Wr | Ind | Regex                                                                       |
|---|----------|-------------------------------|------|---------|----|-----|-----------------------------------------------------------------------------|
| * | ACTUAL   | value.humidity                | %    | number  | -  |     | `/humidity$/`                                                               |
|   | UNREACH  | indicator.maintenance.unreach |      | boolean |    | X   | `/^indicator(\.maintenance)?\.unreach$/`                                    |
|   | LOWBAT   | indicator.maintenance.lowbat  |      | boolean |    | X   | `/^indicator(\.maintenance)?\.lowbat$|^indicator(\.maintenance)?\.battery/` |
|   | MAINTAIN | indicator.maintenance         |      | boolean |    | X   | `/^indicator\.maintenance$/`                                                |
|   | ERROR    | indicator.error               |      |         |    | X   | `/^indicator\.error$/`                                                      |


## Image
| R | Name     | Role                          | Type    | Wr | Ind | Regex                                                                       |
|---|----------|-------------------------------|---------|----|-----|-----------------------------------------------------------------------------|
| * | URL      |                               | string  | -  |     | `/\.icon$|^icon$|^icon\.|\.icon\.|\.chart\.url\.|\.chart\.url$|^url.icon$/` |
|   | UNREACH  | indicator.maintenance.unreach | boolean |    | X   | `/^indicator(\.maintenance)?\.unreach$/`                                    |
|   | LOWBAT   | indicator.maintenance.lowbat  | boolean |    | X   | `/^indicator(\.maintenance)?\.lowbat$|^indicator(\.maintenance)?\.battery/` |
|   | MAINTAIN | indicator.maintenance         | boolean |    | X   | `/^indicator\.maintenance$/`                                                |
|   | ERROR    | indicator.error               |         |    | X   | `/^indicator\.error$/`                                                      |


## Information device (very simple)
| R | Name     | Role                          | Type    | Ind | Regex                                                                       |
|---|----------|-------------------------------|---------|-----|-----------------------------------------------------------------------------|
| * | ACTUAL   | state                         |         |     |                                                                             |
|   | WORKING  | indicator.working             |         | X   | `/^indicator\.working$/`                                                    |
|   | UNREACH  | indicator.maintenance.unreach | boolean | X   | `/^indicator(\.maintenance)?\.unreach$/`                                    |
|   | LOWBAT   | indicator.maintenance.lowbat  | boolean | X   | `/^indicator(\.maintenance)?\.lowbat$|^indicator(\.maintenance)?\.battery/` |
|   | MAINTAIN | indicator.maintenance         | boolean | X   | `/^indicator\.maintenance$/`                                                |
|   | ERROR    | indicator.error               |         | X   | `/^indicator\.error$/`                                                      |


## Light switch
| R | Name           | Role                          | Unit | Type    | Wr | Ind | Regex                                                                       |
|---|----------------|-------------------------------|------|---------|----|-----|-----------------------------------------------------------------------------|
| * | SET            | switch.light                  |      | boolean | W  |     | `/^switch(\.light)?$|^state$/`                                              |
|   | ACTUAL         | switch.light                  |      | boolean | -  |     | `/^switch(\.light)?$|^state$/`                                              |
|   | ELECTRIC_POWER | value.power                   | W    | number  | -  |     | `/^value\.power$/`                                                          |
|   | CURRENT        | value.current                 | mA   | number  | -  |     | `/^value\.current$/`                                                        |
|   | VOLTAGE        | value.voltage                 | V    | number  | -  |     | `/^value\.voltage$/`                                                        |
|   | CONSUMPTION    | value.power.consumption       | Wh   | number  | -  |     | `/^value\.power\.consumption$/`                                             |
|   | FREQUENCY      | value.frequency               | Hz   | number  | -  |     | `/^value\.frequency$/`                                                      |
|   | WORKING        | indicator.working             |      |         |    | X   | `/^indicator\.working$/`                                                    |
|   | UNREACH        | indicator.maintenance.unreach |      | boolean |    | X   | `/^indicator(\.maintenance)?\.unreach$/`                                    |
|   | LOWBAT         | indicator.maintenance.lowbat  |      | boolean |    | X   | `/^indicator(\.maintenance)?\.lowbat$|^indicator(\.maintenance)?\.battery/` |
|   | MAINTAIN       | indicator.maintenance         |      | boolean |    | X   | `/^indicator\.maintenance$/`                                                |
|   | ERROR          | indicator.error               |      |         |    | X   | `/^indicator\.error$/`                                                      |


## GPS Location
| R | Name      | Role                          | Unit | Type    | Wr | Ind | Regex                                                                       |
|---|-----------|-------------------------------|------|---------|----|-----|-----------------------------------------------------------------------------|
| * | LONGITUDE | value.gps.longitude           | °    | number  | -  |     | `/^value\.gps\.longitude$/`                                                 |
| * | LATITUDE  | value.gps.latitude            | °    | number  | -  |     | `/^value\.gps\.latitude$/`                                                  |
|   | ELEVATION | value.gps.elevation           |      | number  | -  |     | `/^value\.gps\.elevation$/`                                                 |
|   | RADIUS    | value.gps.radius              |      | number  | -  |     | `/^value\.radius$|value\.gps\.radius$/`                                     |
|   | ACCURACY  | value.gps.accuracy            |      | number  | -  |     | `/^value\.accuracy$|^value\.gps\.accuracy$/`                                |
|   | UNREACH   | indicator.maintenance.unreach |      | boolean |    | X   | `/^indicator(\.maintenance)?\.unreach$/`                                    |
|   | LOWBAT    | indicator.maintenance.lowbat  |      | boolean |    | X   | `/^indicator(\.maintenance)?\.lowbat$|^indicator(\.maintenance)?\.battery/` |
|   | MAINTAIN  | indicator.maintenance         |      | boolean |    | X   | `/^indicator\.maintenance$/`                                                |
|   | ERROR     | indicator.error               |      |         |    | X   | `/^indicator\.error$/`                                                      |


## Lock
| R | Name      | Role                          | Type    | Wr | Ind | Regex                                                                       |
|---|-----------|-------------------------------|---------|----|-----|-----------------------------------------------------------------------------|
| * | SET       | switch.lock                   | boolean | W  |     | `/^switch\.lock$/`                                                          |
|   | ACTUAL    | state                         | boolean | -  |     | `/^state$/`                                                                 |
|   | OPEN      | button                        | boolean | W  |     |                                                                             |
|   | DIRECTION | indicator.direction           |         |    | X   | `/^indicator\.direction$/`                                                  |
|   | WORKING   | indicator.working             |         |    | X   | `/^indicator\.working$/`                                                    |
|   | UNREACH   | indicator.maintenance.unreach | boolean |    | X   | `/^indicator(\.maintenance)?\.unreach$/`                                    |
|   | LOWBAT    | indicator.maintenance.lowbat  | boolean |    | X   | `/^indicator(\.maintenance)?\.lowbat$|^indicator(\.maintenance)?\.battery/` |
|   | MAINTAIN  | indicator.maintenance         | boolean |    | X   | `/^indicator\.maintenance$/`                                                |
|   | ERROR     | indicator.error               |         |    | X   | `/^indicator\.error$/`                                                      |


## Motion sensor
| R | Name     | Role                          | Unit | Type    | Ind | Regex                                                                       |
|---|----------|-------------------------------|------|---------|-----|-----------------------------------------------------------------------------|
| * | ACTUAL   | sensor.motion                 |      | boolean |     | `/^state\.motion$|^sensor\.motion$/`                                        |
|   | SECOND   | value.brightness              | lux  | number  |     | `/brightness$/`                                                             |
|   | UNREACH  | indicator.maintenance.unreach |      | boolean | X   | `/^indicator(\.maintenance)?\.unreach$/`                                    |
|   | LOWBAT   | indicator.maintenance.lowbat  |      | boolean | X   | `/^indicator(\.maintenance)?\.lowbat$|^indicator(\.maintenance)?\.battery/` |
|   | MAINTAIN | indicator.maintenance         |      | boolean | X   | `/^indicator\.maintenance$/`                                                |
|   | ERROR    | indicator.error               |      |         | X   | `/^indicator\.error$/`                                                      |


## RGB Light (R,G,B have different states)
| R | Name        | Role                          | Unit | Type    | Wr | Ind | Regex                                                                       |
|---|-------------|-------------------------------|------|---------|----|-----|-----------------------------------------------------------------------------|
| * | RED         | level.color.red               |      | number  | W  |     | `/^level\.color\.red$/`                                                     |
| * | GREEN       | level.color.green             |      | number  | W  |     | `/^level\.color\.green$/`                                                   |
| * | BLUE        | level.color.blue              |      | number  | W  |     | `/^level\.color\.blue$/`                                                    |
|   | WHITE       | level.color.white             |      | number  | W  |     | `/^level\.color\.white$/`                                                   |
|   | DIMMER      | level.dimmer                  | %    | number  | W  |     | `/^level\.dimmer$/`                                                         |
|   | BRIGHTNESS  |                               |      | number  | W  |     | `/^level\.brightness$/`                                                     |
|   | SATURATION  |                               |      | number  | W  |     | `/^level\.color\.saturation$/`                                              |
|   | TEMPERATURE | level.color.temperature       | °K   | number  | W  |     | `/^level\.color\.temperature$/`                                             |
|   | ON          | switch.light                  |      | boolean | W  |     | `/^switch\.light$/`                                                         |
|   | ON          | switch.light                  |      | boolean | W  |     | `/^switch$/`                                                                |
|   | ON_ACTUAL   | state.light                   |      | boolean | -  |     | `/^state(\.light)?$/`                                                       |
|   | WORKING     | indicator.working             |      |         |    | X   | `/^indicator\.working$/`                                                    |
|   | UNREACH     | indicator.maintenance.unreach |      | boolean |    | X   | `/^indicator(\.maintenance)?\.unreach$/`                                    |
|   | LOWBAT      | indicator.maintenance.lowbat  |      | boolean |    | X   | `/^indicator(\.maintenance)?\.lowbat$|^indicator(\.maintenance)?\.battery/` |
|   | MAINTAIN    | indicator.maintenance         |      | boolean |    | X   | `/^indicator\.maintenance$/`                                                |
|   | ERROR       | indicator.error               |      |         |    | X   | `/^indicator\.error$/`                                                      |


## RGB Light with hex color
| R | Name        | Role                          | Unit | Type    | Wr | Ind | Regex                                                                       |
|---|-------------|-------------------------------|------|---------|----|-----|-----------------------------------------------------------------------------|
| * | RGB         | level.color.rgb               |      | string  | W  |     | `/^level\.color\.rgb$/`                                                     |
|   | DIMMER      | level.dimmer                  |      | number  | W  |     | `/^level\.dimmer$/`                                                         |
|   | BRIGHTNESS  |                               | %    | number  | W  |     | `/^level\.brightness$/`                                                     |
|   | SATURATION  |                               |      | number  | W  |     | `/^level\.color\.saturation$/`                                              |
|   | TEMPERATURE | level.color.temperature       | °K   | number  | W  |     | `/^level\.color\.temperature$/`                                             |
|   | ON          | switch.light                  |      | boolean | W  |     | `/^switch\.light$/`                                                         |
|   | ON          | switch.light                  |      | boolean | W  |     | `/^switch$/`                                                                |
|   | ON_ACTUAL   | state.light                   |      | boolean | -  |     | `/^state(\.light)?$/`                                                       |
|   | WORKING     | indicator.working             |      |         |    | X   | `/^indicator\.working$/`                                                    |
|   | UNREACH     | indicator.maintenance.unreach |      | boolean |    | X   | `/^indicator(\.maintenance)?\.unreach$/`                                    |
|   | LOWBAT      | indicator.maintenance.lowbat  |      | boolean |    | X   | `/^indicator(\.maintenance)?\.lowbat$|^indicator(\.maintenance)?\.battery/` |
|   | MAINTAIN    | indicator.maintenance         |      | boolean |    | X   | `/^indicator\.maintenance$/`                                                |
|   | ERROR       | indicator.error               |      |         |    | X   | `/^indicator\.error$/`                                                      |


## Socket
| R | Name           | Role                          | Unit | Type    | Wr | Ind | Regex                                                                       |
|---|----------------|-------------------------------|------|---------|----|-----|-----------------------------------------------------------------------------|
| * | SET            | switch                        |      | boolean | W  |     | `/^switch$|^state$|^switch\.active$/`                                       |
|   | ACTUAL         | switch                        |      | boolean | -  |     | `/^state$|^state\.active$/`                                                 |
|   | ELECTRIC_POWER | value.power                   | W    | number  | -  |     | `/^value\.power$/`                                                          |
|   | CURRENT        | value.current                 | mA   | number  | -  |     | `/^value\.current$/`                                                        |
|   | VOLTAGE        | value.voltage                 | V    | number  | -  |     | `/^value\.voltage$/`                                                        |
|   | CONSUMPTION    | value.power.consumption       | Wh   | number  | -  |     | `/^value\.power\.consumption$/`                                             |
|   | FREQUENCY      | value.frequency               | Hz   | number  | -  |     | `/^value\.frequency$/`                                                      |
|   | WORKING        | indicator.working             |      |         |    | X   | `/^indicator\.working$/`                                                    |
|   | UNREACH        | indicator.maintenance.unreach |      | boolean |    | X   | `/^indicator(\.maintenance)?\.unreach$/`                                    |
|   | LOWBAT         | indicator.maintenance.lowbat  |      | boolean |    | X   | `/^indicator(\.maintenance)?\.lowbat$|^indicator(\.maintenance)?\.battery/` |
|   | MAINTAIN       | indicator.maintenance         |      | boolean |    | X   | `/^indicator\.maintenance$/`                                                |
|   | ERROR          | indicator.error               |      |         |    | X   | `/^indicator\.error$/`                                                      |


## Temperature
| R | Name     | Role                          | Unit | Type    | Wr | Ind | Regex                                                                       |
|---|----------|-------------------------------|------|---------|----|-----|-----------------------------------------------------------------------------|
| * | ACTUAL   | value.temperature             | °C   | number  | -  |     | `/temperature$/`                                                            |
|   | SECOND   | value.humidity                | %    | number  | -  |     | `/humidity$/`                                                               |
|   | UNREACH  | indicator.maintenance.unreach |      | boolean |    | X   | `/^indicator(\.maintenance)?\.unreach$/`                                    |
|   | LOWBAT   | indicator.maintenance.lowbat  |      | boolean |    | X   | `/^indicator(\.maintenance)?\.lowbat$|^indicator(\.maintenance)?\.battery/` |
|   | MAINTAIN | indicator.maintenance         |      | boolean |    | X   | `/^indicator\.maintenance$/`                                                |
|   | ERROR    | indicator.error               |      |         |    | X   | `/^indicator\.error$/`                                                      |


## Thermostat
| R | Name     | Role                          | Unit | Type           | Wr | Ind | Regex                                                                       |
|---|----------|-------------------------------|------|----------------|----|-----|-----------------------------------------------------------------------------|
| * | SET      | level.temperature             | °C   | number         | W  |     | `/temperature(\..*)?$/`                                                     |
|   | ACTUAL   | value.temperature             | °C   | number         | -  |     | `/temperature(\..*)?$/`                                                     |
|   | HUMIDITY | value.humidity                | %    | number         | -  |     | `/humidity(\..*)?$/`                                                        |
|   | BOOST    | switch.mode.boost             |      | boolean/number | W  |     | `/^switch(\.mode)?\.boost(\..*)?$/`                                         |
|   | POWER    | switch.power                  |      | boolean/number | W  |     | `/^switch\.power$/`                                                         |
|   | PARTY    | switch.mode.party             |      | boolean/number | W  |     | `/^switch(\.mode)?\.party$/`                                                |
|   | POWER    |                               |      | boolean        | W  |     | `/^switch$/`                                                                |
|   | MODE     | level.mode.thermostat         |      | number         | W  |     | `/^level(\.mode)?\.thermostat$/`                                            |
|   | WORKING  | indicator.working             |      |                |    | X   | `/^indicator\.working$/`                                                    |
|   | UNREACH  | indicator.maintenance.unreach |      | boolean        |    | X   | `/^indicator(\.maintenance)?\.unreach$/`                                    |
|   | LOWBAT   | indicator.maintenance.lowbat  |      | boolean        |    | X   | `/^indicator(\.maintenance)?\.lowbat$|^indicator(\.maintenance)?\.battery/` |
|   | MAINTAIN | indicator.maintenance         |      | boolean        |    | X   | `/^indicator\.maintenance$/`                                                |
|   | ERROR    | indicator.error               |      |                |    | X   | `/^indicator\.error$/`                                                      |


## Vacuum cleaner (robot)
| R | Name        | Role                          | Unit | Type           | Wr | Ind | Regex                                                                       |
|---|-------------|-------------------------------|------|----------------|----|-----|-----------------------------------------------------------------------------|
| * | POWER       | switch.power                  |      | boolean/number | W  |     | `/^switch\.power$/`                                                         |
| * | MODE        | level.mode.cleanup            |      | number         | W  |     | `/mode\.cleanup$/`                                                          |
|   | WORK_MODE   | level.mode.work               |      | number         | W  |     | `/mode\.work$/`                                                             |
|   | WATER       | value.water                   | %    | number         | W  |     | `/^value\.water$/`                                                          |
|   | WASTE       | value.waste                   | %    | number         | W  |     | `/^value\.waste$/`                                                          |
|   | BATTERY     | value.battery                 | %    | number         | W  |     | `/^value\.battery$/`                                                        |
|   | STATE       | value.state                   |      | number/string  | W  |     | `/^value\.state$/`                                                          |
|   | PAUSE       | switch.pause                  |      | boolean        | W  |     | `/^switch\.pause$/`                                                         |
|   | WASTE_ALARM | indicator.maintenance.waste   |      | boolean        |    | X   | `/^indicator(\.maintenance)?\.waste$|^indicator(\.alarm)?\.waste/`          |
|   | WATER_ALARM | indicator.maintenance.water   |      | boolean        |    | X   | `/^indicator(\.maintenance)?\.water$|^indicator(\.alarm)?\.water/`          |
|   | UNREACH     | indicator.maintenance.unreach |      | boolean        |    | X   | `/^indicator(\.maintenance)?\.unreach$/`                                    |
|   | LOWBAT      | indicator.maintenance.lowbat  |      | boolean        |    | X   | `/^indicator(\.maintenance)?\.lowbat$|^indicator(\.maintenance)?\.battery/` |
|   | MAINTAIN    | indicator.maintenance         |      | boolean        |    | X   | `/^indicator\.maintenance$/`                                                |
|   | ERROR       | indicator.error               |      |                |    | X   | `/^indicator\.error$/`                                                      |


## Volume
| R | Name     | Role                          | Type    | Wr | Min | Max | Ind | Regex                                                                       |
|---|----------|-------------------------------|---------|----|-----|-----|-----|-----------------------------------------------------------------------------|
| * | SET      | level.volume                  | number  | W  | m   | M   |     | `/^level\.volume$/`                                                         |
|   | ACTUAL   | value.volume                  | number  | -  | m   | M   |     | `/^value\.volume$/`                                                         |
|   | MUTE     | media.mute                    | boolean | W  |     |     |     | `/^media\.mute$/`                                                           |
|   | WORKING  | indicator.working             |         |    |     |     | X   | `/^indicator\.working$/`                                                    |
|   | UNREACH  | indicator.maintenance.unreach | boolean |    |     |     | X   | `/^indicator(\.maintenance)?\.unreach$/`                                    |
|   | LOWBAT   | indicator.maintenance.lowbat  | boolean |    |     |     | X   | `/^indicator(\.maintenance)?\.lowbat$|^indicator(\.maintenance)?\.battery/` |
|   | MAINTAIN | indicator.maintenance         | boolean |    |     |     | X   | `/^indicator\.maintenance$/`                                                |
|   | ERROR    | indicator.error               |         |    |     |     | X   | `/^indicator\.error$/`                                                      |


## Volume group
| R | Name     | Role                          | Type    | Wr | Min | Max | Ind | Regex                                                                       |
|---|----------|-------------------------------|---------|----|-----|-----|-----|-----------------------------------------------------------------------------|
| * | SET      | level.volume.group            | number  | W  | m   | M   |     | `/^level\.volume\.group?$/`                                                 |
|   | ACTUAL   | value.volume.group            | number  | -  | m   | M   |     | `/^value\.volume\.group$/`                                                  |
|   | MUTE     | media.mute.group              | boolean | W  |     |     |     | `/^media\.mute\.group$/`                                                    |
|   | WORKING  | indicator.working             |         |    |     |     | X   | `/^indicator\.working$/`                                                    |
|   | UNREACH  | indicator.maintenance.unreach | boolean |    |     |     | X   | `/^indicator(\.maintenance)?\.unreach$/`                                    |
|   | LOWBAT   | indicator.maintenance.lowbat  | boolean |    |     |     | X   | `/^indicator(\.maintenance)?\.lowbat$|^indicator(\.maintenance)?\.battery/` |
|   | MAINTAIN | indicator.maintenance         | boolean |    |     |     | X   | `/^indicator\.maintenance$/`                                                |
|   | ERROR    | indicator.error               |         |    |     |     | X   | `/^indicator\.error$/`                                                      |


## Warning
| R | Name  | Role                | Type   | Ind | Regex                       |
|---|-------|---------------------|--------|-----|-----------------------------|
| * | LEVEL | value.warning       |        |     | `/^value\.warning$/`        |
|   | TITLE | weather.title.short | string |     | `/^weather\.title\.short$/` |
|   | INFO  | weather.title       | string |     | `/^weather\.title$/`        |
|   | START | date.start          | string |     | `/^date\.start$/`           |
|   | END   | date.end            | string |     | `/^date\.end$/`             |
|   | START |                     | string |     | `/^date$/`                  |
|   | ICON  | weather.chart.url   | string |     | `/^weather\.chart\.url/`    |
|   | DESC  | weather.state       | string |     | `/^weather\.state$/`        |


## Current weather
| R | Name                  | Role                          | Unit | Type    | Ind | Regex                                                                       |
|---|-----------------------|-------------------------------|------|---------|-----|-----------------------------------------------------------------------------|
| * | ACTUAL                | value.temperature             | °C   | number  |     | `/^value(\.temperature)?$/`                                                 |
| * | ICON                  | weather.icon                  |      |         |     | `/^weather\.icon$/`                                                         |
|   | PRECIPITATION_CHANCE  | value.precipitation.chance    | %    | number  |     | `/^value\.precipitation\.chance$/`                                          |
|   | PRECIPITATION_TYPE    | value.precipitation.type      |      | number  |     | `/^value\.precipitation\.type$/`                                            |
|   | PRESSURE              | value.pressure                | mbar | number  |     | `/^value\.pressure$/`                                                       |
|   | PRESSURE_TENDENCY     | value.pressure.tendency       |      | string  |     | `/^value\.pressure\.tendency$/`                                             |
|   | REAL_FEEL_TEMPERATURE | value.temperature.windchill   | °C   | number  |     | `/^value\.temperature\.windchill$/`                                         |
|   | HUMIDITY              | value.humidity                | %    | number  |     | `/^value.humidity$/`                                                        |
|   | UV                    | value.uv                      |      | number  |     | `/^value.uv$/`                                                              |
|   | WEATHER               | weather.state                 |      | string  |     | `/^weather\.state$/`                                                        |
|   | WIND_DIRECTION        | value.direction.wind          | °    | string  |     | `/^value\.direction\.wind$/`                                                |
|   | WIND_GUST             | value.speed.wind.gust         | km/h | number  |     | `/^value\.speed\.wind\.gust$/`                                              |
|   | WIND_SPEED            | value.speed.wind$             | km/h | number  |     | `/^value\.speed\.wind$/`                                                    |
|   | LOWBAT                | indicator.maintenance.lowbat  |      | boolean | X   | `/^indicator(\.maintenance)?\.lowbat$|^indicator(\.maintenance)?\.battery/` |
|   | UNREACH               | indicator.maintenance.unreach |      | boolean | X   | `/^indicator(\.maintenance)?\.unreach$/`                                    |
|   | MAINTAIN              | indicator.maintenance         |      | boolean | X   | `/^indicator\.maintenance$/`                                                |
|   | ERROR                 | indicator.error               |      |         | X   | `/^indicator\.error$/`                                                      |


## Weather forecast
| R | Name                   | Role                                   | Unit  | Type   | Ind | Regex                                                                      |
|---|------------------------|----------------------------------------|-------|--------|-----|----------------------------------------------------------------------------|
| * | ICON                   | weather.icon.forecast.0                |       | string |     | `/^weather.icon$|^weather.icon.forecast.0$/`                               |
| * | TEMP_MIN               | value.temperature.min.forecast.0       |       | number |     | `/^value.temperature.min.forecast.0$/`                                     |
| * | TEMP_MAX               | value.temperature.max.forecast.0       |       | number |     | `/^value.temperature.max.forecast.0$/`                                     |
|   | PRECIPITATION_CHANCE   | value.precipitation.forecast.0         |  / %  | number |     | `/^value.precipitation$|^value.precipitation.forecast.0$/`                 |
|   | PRECIPITATION          | value.precipitation.forecast.0         |  / mm | number |     | `/^value.precipitation$|^value.precipitation.forecast.0$/`                 |
|   | DATE                   | date.forecast.0                        |       | string |     | `/^date$|^date.forecast.0$/`                                               |
|   | DOW                    | dayofweek.forecast.0                   |       | string |     | `/^dayofweek$|^dayofweek.forecast.0$/`                                     |
|   | STATE                  | weather.state.forecast.0               |       | string |     | `/^weather.state$|^weather.state.forecast.0$/`                             |
|   | TEMP                   | value.temperature.forecast.0           |       | number |     | `/^value.temperature$|^value.temperature.forecast.0$/`                     |
|   | PRESSURE               | weather.icon.forecast.0                |       | number |     | `/^value.pressure$/`                                                       |
|   | HUMIDITY               | value.humidity.forecast.0              |       | number |     | `/^value.humidity$|value.humidity.forecast.0$/`                            |
|   | WIND_CHILL             | value.temperature.windchill.forecast.0 |       | number |     | `/^value.temperature.windchill$|^value.temperature.windchill.forecast.0$/` |
|   | FEELS_LIKE             | value.temperature.feelslike.forecast.0 |       | number |     | `/^value.temperature.feelslike$|^value.temperature.feelslike.forecast.0$/` |
|   | WIND_SPEED             | value.speed.wind.forecast.0            |       | number |     | `/^value.speed.wind$|^value.speed.wind.forecast.0$/`                       |
|   | WIND_DIRECTION         | value.direction.wind.forecast.0        |       | number |     | `/^value.direction.wind$|^value.direction.wind.forecast.0$/`               |
|   | WIND_DIRECTION_STR     | weather.direction.wind.forecast.0      |       | string |     | `/^weather.direction.wind$|^weather.direction.wind.forecast.0$/`           |
|   | WIND_ICON              | weather.icon.wind.forecast.0           |       | string |     | `/^weather.icon.wind$|^weather.icon.wind.forecast.0$/`                     |
|   | HISTORY_CHART          | weather.chart.url                      |       | string |     | `/^weather.chart.url$/`                                                    |
|   | FORECAST_CHART         | weather.chart.url.forecast             |       | string |     | `/^weather.chart.url.forecast$/`                                           |
|   | LOCATION               | location                               |       | string |     | `/^location$/`                                                             |
|   | ICON%d                 |                                        |       | string |     | `/^weather.icon.forecast.(\d)$/`                                           |
|   | TEMP_MIN%d             |                                        |       | number |     | `/^value.temperature.min.forecast.(\d)$/`                                  |
|   | TEMP_MAX%d             |                                        |       | number |     | `/^value.temperature.max.forecast.(\d)$/`                                  |
|   | DATE%d                 |                                        |       | string |     | `/^date.forecast.(\d)$/`                                                   |
|   | DOW%d                  |                                        |       | string |     | `/^dayofweek.forecast.(\d)$/`                                              |
|   | STATE%d                |                                        |       | string |     | `/^weather.state.forecast.(\d)$/`                                          |
|   | TEMP%d                 |                                        |       | number |     | `/^value.temperature.forecast.(\d)$/`                                      |
|   | HUMIDITY%d             |                                        |       | number |     | `/^value.humidity.forecast.(\d)$/`                                         |
|   | HUMIDITY_MAX%d         |                                        |       | number |     | `/^value.humidity.max.forecast.(\d)$/`                                     |
|   | PRECIPITATION_CHANCE%d |                                        |  / %  | number |     | `/^value.precipitation.forecast.(\d)$/`                                    |
|   | PRECIPITATION%d        |                                        |  / mm | number |     | `/^value.precipitation.forecast.(\d)$/`                                    |
|   | WIND_SPEED%d           |                                        |       | number |     | `/^value.speed.wind.forecast.(\d)$/`                                       |
|   | WIND_DIRECTION%d       |                                        |       | number |     | `/^value.direction.wind.forecast.(\d)$/`                                   |
|   | WIND_DIRECTION_STR%d   |                                        |       | string |     | `/^weather.direction.wind.forecast.(\d)$/`                                 |
|   | WIND_ICON%d            |                                        |       | string |     | `/^weather.icon.wind.forecast.(\d)$/`                                      |


## Window
| R | Name     | Role                          | Type    | Ind | Regex                                                                       |
|---|----------|-------------------------------|---------|-----|-----------------------------------------------------------------------------|
| * | ACTUAL   | sensor.window                 | boolean |     | `/^state(\.window)?$|^sensor(\.window)?/`                                   |
|   | UNREACH  | indicator.maintenance.unreach | boolean | X   | `/^indicator(\.maintenance)?\.unreach$/`                                    |
|   | LOWBAT   | indicator.maintenance.lowbat  | boolean | X   | `/^indicator(\.maintenance)?\.lowbat$|^indicator(\.maintenance)?\.battery/` |
|   | MAINTAIN | indicator.maintenance         | boolean | X   | `/^indicator\.maintenance$/`                                                |
|   | ERROR    | indicator.error               |         | X   | `/^indicator\.error$/`                                                      |


## Window that could be in tilted state
| R | Name     | Role                          | Type    | Ind | Regex                                                                       |
|---|----------|-------------------------------|---------|-----|-----------------------------------------------------------------------------|
| * | ACTUAL   | value.window                  | number  |     | `/^state?$|^value(\.window)?$/`                                             |
|   | UNREACH  | indicator.maintenance.unreach | boolean | X   | `/^indicator(\.maintenance)?\.unreach$/`                                    |
|   | LOWBAT   | indicator.maintenance.lowbat  | boolean | X   | `/^indicator(\.maintenance)?\.lowbat$|^indicator(\.maintenance)?\.battery/` |
|   | MAINTAIN | indicator.maintenance         | boolean | X   | `/^indicator\.maintenance$/`                                                |
|   | ERROR    | indicator.error               |         | X   | `/^indicator\.error$/`                                                      |

