# ioBroker device types

Fields:
- **R** - If the state is mandatory and must be in the channel/device.
- **Name** - Name of state in channel or in devices. The end state must not have the same name. 
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



## airCondition
--|----------|-------------------------------|------|----------------|-----|------
R | Name     | Role                          | Unit | Wr             | Min | Regex
--|----------|-------------------------------|------|----------------|-----|------
* | SET      | level.temperature             | °C   | number         | W   |      
* | MODE     | level.mode.airconditioner     |      | number         | W   |      
  | SPEED    | level.mode.fan                |      | number         | W   |      
  | POWER    | switch.power                  |      | boolean/number | W   |      
  | POWER    |                               |      | boolean        | W   |      
  | ACTUAL   | value.temperature             | °C   | number         | -   |      
  | HUMIDITY | value.humidity                | %    | number         | -   |      
  | BOOST    | switch.boost                  |      | boolean/number | W   |      
  | SWING    | level.mode.swing              |      | number         | W   |      
  | SWING    | switch.mode.swing             |      | boolean        | W   |      
  | UNREACH  | indicator.maintenance.unreach |      | boolean        |     | X    
  | MAINTAIN | indicator.maintenance         |      | boolean        |     | X    
  | ERROR    | indicator.error               |      |                |     | X    
--|----------|-------------------------------|------|----------------|-----|------


## blindButtons
--|-------------|-------------------------------|---------|-----|------
R | Name        | Role                          | Wr      | Min | Regex
--|-------------|-------------------------------|---------|-----|------
* | STOP        | button.blind.stop             | boolean | W   |      
* | OPEN        | button.blind.open             | boolean | W   |      
* | CLOSE       | button.blind.close            | boolean | W   |      
  | TILT_SET    | level.open.tilt               | number  | W   |      
  | TILT_ACTUAL | value.open.tilt               | number  |     |      
  | TILT_STOP   | button.tilt.stop              | boolean | W   |      
  | TILT_OPEN   | button.tilt.open              | boolean | W   |      
  | TILT_CLOSE  | button.tilt.close             | boolean | W   |      
  | DIRECTION   | indicator.direction           |         |     | X    
  | WORKING     | indicator.working             |         |     | X    
  | UNREACH     | indicator.maintenance.unreach | boolean |     | X    
  | LOWBAT      | indicator.maintenance.lowbat  | boolean |     | X    
  | MAINTAIN    | indicator.maintenance         | boolean |     | X    
  | ERROR       | indicator.error               |         |     | X    
--|-------------|-------------------------------|---------|-----|------


## button
--|----------|-------------------------------|---------|-----|------
R | Name     | Role                          | Wr      | Min | Regex
--|----------|-------------------------------|---------|-----|------
* | SET      | button                        | boolean | W   |      
  | UNREACH  | indicator.maintenance.unreach | boolean |     | X    
  | LOWBAT   | indicator.maintenance.lowbat  | boolean |     | X    
  | MAINTAIN | indicator.maintenance         | boolean |     | X    
  | ERROR    | indicator.error               |         |     | X    
--|----------|-------------------------------|---------|-----|------


## buttonSensor
--|------------|-------------------------------|---------|-----|------
R | Name       | Role                          | Wr      | Min | Regex
--|------------|-------------------------------|---------|-----|------
* | PRESS      | button.press                  | boolean | -   |      
  | PRESS_LONG | button.long                   | boolean | -   |      
  | UNREACH    | indicator.maintenance.unreach | boolean |     | X    
  | LOWBAT     | indicator.maintenance.lowbat  | boolean |     | X    
  | MAINTAIN   | indicator.maintenance         | boolean |     | X    
  | ERROR      | indicator.error               |         |     | X    
--|------------|-------------------------------|---------|-----|------


## camera
--|------------------|--------------------------------|---------|-----|------
R | Name             | Role                           | Wr      | Min | Regex
--|------------------|--------------------------------|---------|-----|------
* | FILE             | camera                         | file    |     |      
  | AUTOFOCUS        | switch.camera.autofocus        | boolean | W   |      
  | AUTOWHITEBALANCE | switch.camera.autowhitebalance | boolean | W   |      
  | BRIGHTNESS       | switch.camera.brightness       | boolean | W   |      
  | NIGHTMODE        | switch.camera.nightmode        | boolean | W   |      
  | PTZ              | level.camera.position          | number  | W   |      
  | UNREACH          | indicator.maintenance.unreach  | boolean |     | X    
  | LOWBAT           | indicator.maintenance.lowbat   | boolean |     | X    
  | MAINTAIN         | indicator.maintenance          | boolean |     | X    
  | ERROR            | indicator.error                |         |     | X    
--|------------------|--------------------------------|---------|-----|------


## ct
--|-------------|-------------------------------|------|---------|-----|------
R | Name        | Role                          | Unit | Wr      | Min | Regex
--|-------------|-------------------------------|------|---------|-----|------
* | TEMPERATURE | level.color.temperature       | °K   | number  | W   |      
  | DIMMER      | level.dimmer                  | %    | number  | W   |      
  | BRIGHTNESS  |                               |      | number  | W   |      
  | SATURATION  |                               |      | number  | W   |      
  | ON          | switch.light                  |      | boolean | W   |      
  | ON          |                               |      | boolean | W   |      
  | WORKING     | indicator.working             |      |         |     | X    
  | UNREACH     | indicator.maintenance.unreach |      | boolean |     | X    
  | LOWBAT      | indicator.maintenance.lowbat  |      | boolean |     | X    
  | MAINTAIN    | indicator.maintenance         |      | boolean |     | X    
  | ERROR       | indicator.error               |      |         |     | X    
--|-------------|-------------------------------|------|---------|-----|------


## dimmer
--|-----------|-------------------------------|------|---------|-----|------
R | Name      | Role                          | Unit | Wr      | Min | Regex
--|-----------|-------------------------------|------|---------|-----|------
* | SET       | level.dimmer                  | %    | number  | W   |      
  | ACTUAL    | value.dimmer                  | %    | number  | -   |      
  | ON_SET    | switch.light                  |      | boolean | W   |      
  | ON_ACTUAL | switch.light                  |      | boolean | -   |      
  | WORKING   | indicator.working             |      |         |     | X    
  | UNREACH   | indicator.maintenance.unreach |      | boolean |     | X    
  | LOWBAT    | indicator.maintenance.lowbat  |      | boolean |     | X    
  | MAINTAIN  | indicator.maintenance         |      | boolean |     | X    
  | ERROR     | indicator.error               |      |         |     | X    
--|-----------|-------------------------------|------|---------|-----|------


## door
--|----------|-------------------------------|---------|-----|------
R | Name     | Role                          | Wr      | Min | Regex
--|----------|-------------------------------|---------|-----|------
* | ACTUAL   | sensor.door                   | boolean | -   |      
  | UNREACH  | indicator.maintenance.unreach | boolean |     | X    
  | LOWBAT   | indicator.maintenance.lowbat  | boolean |     | X    
  | MAINTAIN | indicator.maintenance         | boolean |     | X    
  | ERROR    | indicator.error               |         |     | X    
--|----------|-------------------------------|---------|-----|------


## fireAlarm
--|----------|-------------------------------|---------|------
R | Name     | Role                          | Wr      | Regex
--|----------|-------------------------------|---------|------
* | ACTUAL   | sensor.alarm.fire             | boolean |      
  | UNREACH  | indicator.maintenance.unreach | boolean | X    
  | LOWBAT   | indicator.maintenance.lowbat  | boolean | X    
  | MAINTAIN | indicator.maintenance         | boolean | X    
  | ERROR    | indicator.error               |         | X    
--|----------|-------------------------------|---------|------


## floodAlarm
--|----------|-------------------------------|---------|------
R | Name     | Role                          | Wr      | Regex
--|----------|-------------------------------|---------|------
* | ACTUAL   | sensor.alarm.flood            | boolean |      
  | UNREACH  | indicator.maintenance.unreach | boolean | X    
  | LOWBAT   | indicator.maintenance.lowbat  | boolean | X    
  | MAINTAIN | indicator.maintenance         | boolean | X    
  | ERROR    | indicator.error               |         | X    
--|----------|-------------------------------|---------|------


## gate
--|-----------|-------------------------------|------|---------|-----|------
R | Name      | Role                          | Unit | Wr      | Min | Regex
--|-----------|-------------------------------|------|---------|-----|------
* | SET       | switch.gate                   |      | boolean | W   |      
  | ACTUAL    | value.blind                   | %    | number  |     |      
  | STOP      | button.stop                   |      | boolean | W   |      
  | DIRECTION | indicator.direction           |      |         |     | X    
  | WORKING   | indicator.working             |      |         |     | X    
  | UNREACH   | indicator.maintenance.unreach |      | boolean |     | X    
  | MAINTAIN  | indicator.maintenance         |      | boolean |     | X    
  | ERROR     | indicator.error               |      |         |     | X    
--|-----------|-------------------------------|------|---------|-----|------


## hue
--|-------------|-------------------------------|------|---------|-----|------
R | Name        | Role                          | Unit | Wr      | Min | Regex
--|-------------|-------------------------------|------|---------|-----|------
* | HUE         | level.color.hue               | °    | number  | W   |      
  | DIMMER      | level.dimmer                  | °C   | number  | W   |      
  | BRIGHTNESS  |                               |      | number  | W   |      
  | SATURATION  |                               |      | number  | W   |      
  | TEMPERATURE | level.color.temperature       | °K   | number  | W   |      
  | ON          | switch.light                  |      | boolean | W   |      
  | ON          | switch.light                  |      | boolean | W   |      
  | ON_ACTUAL   | state.light                   |      | boolean | -   |      
  | WORKING     | indicator.working             |      |         |     | X    
  | UNREACH     | indicator.maintenance.unreach |      | boolean |     | X    
  | LOWBAT      | indicator.maintenance.lowbat  |      | boolean |     | X    
  | MAINTAIN    | indicator.maintenance         |      | boolean |     | X    
  | ERROR       | indicator.error               |      |         |     | X    
--|-------------|-------------------------------|------|---------|-----|------


## humidity
--|----------|-------------------------------|------|---------|-----|------
R | Name     | Role                          | Unit | Wr      | Min | Regex
--|----------|-------------------------------|------|---------|-----|------
* | ACTUAL   | value.humidity                | %    | number  | -   |      
  | UNREACH  | indicator.maintenance.unreach |      | boolean |     | X    
  | LOWBAT   | indicator.maintenance.lowbat  |      | boolean |     | X    
  | MAINTAIN | indicator.maintenance         |      | boolean |     | X    
  | ERROR    | indicator.error               |      |         |     | X    
--|----------|-------------------------------|------|---------|-----|------


## image
--|----------|-------------------------------|---------|-----|------
R | Name     | Role                          | Wr      | Min | Regex
--|----------|-------------------------------|---------|-----|------
* | URL      |                               | string  | -   |      
  | UNREACH  | indicator.maintenance.unreach | boolean |     | X    
  | LOWBAT   | indicator.maintenance.lowbat  | boolean |     | X    
  | MAINTAIN | indicator.maintenance         | boolean |     | X    
  | ERROR    | indicator.error               |         |     | X    
--|----------|-------------------------------|---------|-----|------


## info
--|----------|-------------------------------|---------|------
R | Name     | Role                          | Wr      | Regex
--|----------|-------------------------------|---------|------
* | ACTUAL   | state                         |         |      
  | WORKING  | indicator.working             |         | X    
  | UNREACH  | indicator.maintenance.unreach | boolean | X    
  | LOWBAT   | indicator.maintenance.lowbat  | boolean | X    
  | MAINTAIN | indicator.maintenance         | boolean | X    
  | ERROR    | indicator.error               |         | X    
--|----------|-------------------------------|---------|------


## light
--|----------------|-------------------------------|------|---------|-----|------
R | Name           | Role                          | Unit | Wr      | Min | Regex
--|----------------|-------------------------------|------|---------|-----|------
* | SET            | switch.light                  |      | boolean | W   |      
  | ACTUAL         | switch.light                  |      | boolean | -   |      
  | ELECTRIC_POWER | value.power                   | W    | number  | -   |      
  | CURRENT        | value.current                 | mA   | number  | -   |      
  | VOLTAGE        | value.voltage                 | V    | number  | -   |      
  | CONSUMPTION    | value.power.consumption       | Wh   | number  | -   |      
  | FREQUENCY      | value.frequency               | Hz   | number  | -   |      
  | WORKING        | indicator.working             |      |         |     | X    
  | UNREACH        | indicator.maintenance.unreach |      | boolean |     | X    
  | LOWBAT         | indicator.maintenance.lowbat  |      | boolean |     | X    
  | MAINTAIN       | indicator.maintenance         |      | boolean |     | X    
  | ERROR          | indicator.error               |      |         |     | X    
--|----------------|-------------------------------|------|---------|-----|------


## location
--|-----------|-------------------------------|------|---------|-----|------
R | Name      | Role                          | Unit | Wr      | Min | Regex
--|-----------|-------------------------------|------|---------|-----|------
* | LONGITUDE | value.gps.longitude           | °    | number  | -   |      
* | LATITUDE  | value.gps.latitude            | °    | number  | -   |      
  | ELEVATION | value.gps.elevation           |      | number  | -   |      
  | RADIUS    | value.gps.radius              |      | number  | -   |      
  | ACCURACY  | value.gps.accuracy            |      | number  | -   |      
  | UNREACH   | indicator.maintenance.unreach |      | boolean |     | X    
  | LOWBAT    | indicator.maintenance.lowbat  |      | boolean |     | X    
  | MAINTAIN  | indicator.maintenance         |      | boolean |     | X    
  | ERROR     | indicator.error               |      |         |     | X    
--|-----------|-------------------------------|------|---------|-----|------


## lock
--|-----------|-------------------------------|---------|-----|------
R | Name      | Role                          | Wr      | Min | Regex
--|-----------|-------------------------------|---------|-----|------
* | SET       | switch.lock                   | boolean | W   |      
  | ACTUAL    | state                         | boolean | -   |      
  | OPEN      | button                        | boolean | W   |      
  | DIRECTION | indicator.direction           |         |     | X    
  | WORKING   | indicator.working             |         |     | X    
  | UNREACH   | indicator.maintenance.unreach | boolean |     | X    
  | LOWBAT    | indicator.maintenance.lowbat  | boolean |     | X    
  | MAINTAIN  | indicator.maintenance         | boolean |     | X    
  | ERROR     | indicator.error               |         |     | X    
--|-----------|-------------------------------|---------|-----|------


## motion
--|----------|-------------------------------|------|---------|------
R | Name     | Role                          | Unit | Wr      | Regex
--|----------|-------------------------------|------|---------|------
* | ACTUAL   | sensor.motion                 |      | boolean |      
  | SECOND   | value.brightness              | lux  | number  |      
  | UNREACH  | indicator.maintenance.unreach |      | boolean | X    
  | LOWBAT   | indicator.maintenance.lowbat  |      | boolean | X    
  | MAINTAIN | indicator.maintenance         |      | boolean | X    
  | ERROR    | indicator.error               |      |         | X    
--|----------|-------------------------------|------|---------|------


## rgb
--|-------------|-------------------------------|------|---------|-----|------
R | Name        | Role                          | Unit | Wr      | Min | Regex
--|-------------|-------------------------------|------|---------|-----|------
* | RED         | level.color.red               |      | number  | W   |      
* | GREEN       | level.color.green             |      | number  | W   |      
* | BLUE        | level.color.blue              |      | number  | W   |      
  | WHITE       | level.color.white             |      | number  | W   |      
  | DIMMER      | level.dimmer                  | %    | number  | W   |      
  | BRIGHTNESS  |                               |      | number  | W   |      
  | SATURATION  |                               |      | number  | W   |      
  | TEMPERATURE | level.color.temperature       | °K   | number  | W   |      
  | ON          | switch.light                  |      | boolean | W   |      
  | ON          | switch.light                  |      | boolean | W   |      
  | ON_ACTUAL   | state.light                   |      | boolean | -   |      
  | WORKING     | indicator.working             |      |         |     | X    
  | UNREACH     | indicator.maintenance.unreach |      | boolean |     | X    
  | LOWBAT      | indicator.maintenance.lowbat  |      | boolean |     | X    
  | MAINTAIN    | indicator.maintenance         |      | boolean |     | X    
  | ERROR       | indicator.error               |      |         |     | X    
--|-------------|-------------------------------|------|---------|-----|------


## rgbSingle
--|-------------|-------------------------------|------|---------|-----|------
R | Name        | Role                          | Unit | Wr      | Min | Regex
--|-------------|-------------------------------|------|---------|-----|------
* | RGB         | level.color.rgb               |      | string  | W   |      
  | DIMMER      | level.dimmer                  |      | number  | W   |      
  | BRIGHTNESS  |                               | %    | number  | W   |      
  | SATURATION  |                               |      | number  | W   |      
  | TEMPERATURE | level.color.temperature       | °K   | number  | W   |      
  | ON          | switch.light                  |      | boolean | W   |      
  | ON          | switch.light                  |      | boolean | W   |      
  | ON_ACTUAL   | state.light                   |      | boolean | -   |      
  | WORKING     | indicator.working             |      |         |     | X    
  | UNREACH     | indicator.maintenance.unreach |      | boolean |     | X    
  | LOWBAT      | indicator.maintenance.lowbat  |      | boolean |     | X    
  | MAINTAIN    | indicator.maintenance         |      | boolean |     | X    
  | ERROR       | indicator.error               |      |         |     | X    
--|-------------|-------------------------------|------|---------|-----|------


## socket
--|----------------|-------------------------------|------|---------|-----|------
R | Name           | Role                          | Unit | Wr      | Min | Regex
--|----------------|-------------------------------|------|---------|-----|------
* | SET            | switch                        |      | boolean | W   |      
  | ACTUAL         | switch                        |      | boolean | -   |      
  | ELECTRIC_POWER | value.power                   | W    | number  | -   |      
  | CURRENT        | value.current                 | mA   | number  | -   |      
  | VOLTAGE        | value.voltage                 | V    | number  | -   |      
  | CONSUMPTION    | value.power.consumption       | Wh   | number  | -   |      
  | FREQUENCY      | value.frequency               | Hz   | number  | -   |      
  | WORKING        | indicator.working             |      |         |     | X    
  | UNREACH        | indicator.maintenance.unreach |      | boolean |     | X    
  | LOWBAT         | indicator.maintenance.lowbat  |      | boolean |     | X    
  | MAINTAIN       | indicator.maintenance         |      | boolean |     | X    
  | ERROR          | indicator.error               |      |         |     | X    
--|----------------|-------------------------------|------|---------|-----|------


## temperature
--|----------|-------------------------------|------|---------|-----|------
R | Name     | Role                          | Unit | Wr      | Min | Regex
--|----------|-------------------------------|------|---------|-----|------
* | ACTUAL   | value.temperature             | °C   | number  | -   |      
  | SECOND   | value.humidity                | %    | number  | -   |      
  | UNREACH  | indicator.maintenance.unreach |      | boolean |     | X    
  | LOWBAT   | indicator.maintenance.lowbat  |      | boolean |     | X    
  | MAINTAIN | indicator.maintenance         |      | boolean |     | X    
  | ERROR    | indicator.error               |      |         |     | X    
--|----------|-------------------------------|------|---------|-----|------


## thermostat
--|----------|-------------------------------|------|----------------|-----|------
R | Name     | Role                          | Unit | Wr             | Min | Regex
--|----------|-------------------------------|------|----------------|-----|------
* | SET      | level.temperature             | °C   | number         | W   |      
  | ACTUAL   | value.temperature             | °C   | number         | -   |      
  | HUMIDITY | value.humidity                | %    | number         | -   |      
  | BOOST    | switch.mode.boost             |      | boolean/number | W   |      
  | POWER    | switch.power                  |      | boolean/number | W   |      
  | PARTY    | switch.mode.party             |      | boolean/number | W   |      
  | POWER    |                               |      | boolean        | W   |      
  | MODE     | level.mode.thermostat         |      | number         | W   |      
  | WORKING  | indicator.working             |      |                |     | X    
  | UNREACH  | indicator.maintenance.unreach |      | boolean        |     | X    
  | LOWBAT   | indicator.maintenance.lowbat  |      | boolean        |     | X    
  | MAINTAIN | indicator.maintenance         |      | boolean        |     | X    
  | ERROR    | indicator.error               |      |                |     | X    
--|----------|-------------------------------|------|----------------|-----|------


## vacuumCleaner
--|-------------|-------------------------------|------|------|----------------|-----|------
R | Name        | Role                          | Unit | Type | Wr             | Min | Regex
--|-------------|-------------------------------|------|------|----------------|-----|------
* | POWER       | switch.power                  |      |      | boolean/number | W   |      
* | MODE        | level.mode.cleanup            |      |      | number         | W   |      
  | WORK_MODE   | level.mode.work               |      |      | number         | W   |      
  | WATER       | value.water                   | %    | %    | number         | W   |      
  | WASTE       | value.waste                   | %    | %    | number         | W   |      
  | BATTERY     | value.battery                 | %    | %    | number         | W   |      
  | STATE       | value.state                   |      |      | number/string  | W   |      
  | PAUSE       | switch.pause                  |      |      | boolean        | W   |      
  | WASTE_ALARM | indicator.maintenance.waste   |      |      | boolean        |     | X    
  | WATER_ALARM | indicator.maintenance.water   |      |      | boolean        |     | X    
  | UNREACH     | indicator.maintenance.unreach |      |      | boolean        |     | X    
  | LOWBAT      | indicator.maintenance.lowbat  |      |      | boolean        |     | X    
  | MAINTAIN    | indicator.maintenance         |      |      | boolean        |     | X    
  | ERROR       | indicator.error               |      |      |                |     | X    
--|-------------|-------------------------------|------|------|----------------|-----|------


## volume
--|----------|-------------------------------|---------|-----|-----|------|------
R | Name     | Role                          | Wr      | Min | Max | Enum | Regex
--|----------|-------------------------------|---------|-----|-----|------|------
* | SET      | level.volume                  | number  | W   | m   | M    |      
  | ACTUAL   | value.volume                  | number  | -   | m   | M    |      
  | MUTE     | media.mute                    | boolean | W   |     |      |      
  | WORKING  | indicator.working             |         |     |     |      | X    
  | UNREACH  | indicator.maintenance.unreach | boolean |     |     |      | X    
  | LOWBAT   | indicator.maintenance.lowbat  | boolean |     |     |      | X    
  | MAINTAIN | indicator.maintenance         | boolean |     |     |      | X    
  | ERROR    | indicator.error               |         |     |     |      | X    
--|----------|-------------------------------|---------|-----|-----|------|------


## volumeGroup
--|----------|-------------------------------|---------|-----|-----|------|------
R | Name     | Role                          | Wr      | Min | Max | Enum | Regex
--|----------|-------------------------------|---------|-----|-----|------|------
* | SET      | level.volume.group            | number  | W   | m   | M    |      
  | ACTUAL   | value.volume.group            | number  | -   | m   | M    |      
  | MUTE     | media.mute.group              | boolean | W   |     |      |      
  | WORKING  | indicator.working             |         |     |     |      | X    
  | UNREACH  | indicator.maintenance.unreach | boolean |     |     |      | X    
  | LOWBAT   | indicator.maintenance.lowbat  | boolean |     |     |      | X    
  | MAINTAIN | indicator.maintenance         | boolean |     |     |      | X    
  | ERROR    | indicator.error               |         |     |     |      | X    
--|----------|-------------------------------|---------|-----|-----|------|------


## warning
--|-------|---------------------|--------|------
R | Name  | Role                | Wr     | Regex
--|-------|---------------------|--------|------
* | LEVEL | value.warning       |        |      
  | TITLE | weather.title.short | string |      
  | INFO  | weather.title       | string |      
  | START | date.start          | string |      
  | END   | date.end            | string |      
  | START |                     | string |      
  | ICON  | weather.chart.url   | string |      
  | DESC  | weather.state       | string |      
--|-------|---------------------|--------|------


## weatherCurrent
--|-----------------------|-------------------------------|------|---------|------
R | Name                  | Role                          | Unit | Wr      | Regex
--|-----------------------|-------------------------------|------|---------|------
* | ACTUAL                | value.temperature             | °C   | number  |      
* | ICON                  | weather.icon                  |      |         |      
  | PRECIPITATION_CHANCE  | value.precipitation.chance    | %    | number  |      
  | PRECIPITATION_TYPE    | value.precipitation.type      |      | number  |      
  | PRESSURE              | value.pressure                | mbar | number  |      
  | PRESSURE_TENDENCY     | value.pressure.tendency       |      | string  |      
  | REAL_FEEL_TEMPERATURE | value.temperature.windchill   | °C   | number  |      
  | HUMIDITY              | value.humidity                | %    | number  |      
  | UV                    | value.uv                      |      | number  |      
  | WEATHER               | weather.state                 |      | string  |      
  | WIND_DIRECTION        | value.direction.wind          | °    | string  |      
  | WIND_GUST             | value.speed.wind.gust         | km/h | number  |      
  | WIND_SPEED            | value.speed.wind$             | km/h | number  |      
  | LOWBAT                | indicator.maintenance.lowbat  |      | boolean | X    
  | UNREACH               | indicator.maintenance.unreach |      | boolean | X    
  | MAINTAIN              | indicator.maintenance         |      | boolean | X    
  | ERROR                 | indicator.error               |      |         | X    
--|-----------------------|-------------------------------|------|---------|------


## weatherForecast
--|------------------------|----------------------------------------|-------|------|--------|------
R | Name                   | Role                                   | Unit  | Type | Wr     | Regex
--|------------------------|----------------------------------------|-------|------|--------|------
* | ICON                   | weather.icon.forecast.0                |       |      | string |      
* | TEMP_MIN               | value.temperature.min.forecast.0       |       |      | number |      
* | TEMP_MAX               | value.temperature.max.forecast.0       |       |      | number |      
  | PRECIPITATION_CHANCE   | value.precipitation.forecast.0         |  / %  | %    | number |      
  | PRECIPITATION          | value.precipitation.forecast.0         |  / mm | mm   | number |      
  | DATE                   | date.forecast.0                        |       |      | string |      
  | DOW                    | dayofweek.forecast.0                   |       |      | string |      
  | STATE                  | weather.state.forecast.0               |       |      | string |      
  | TEMP                   | value.temperature.forecast.0           |       |      | number |      
  | PRESSURE               | weather.icon.forecast.0                |       |      | number |      
  | HUMIDITY               | value.humidity.forecast.0              |       |      | number |      
  | WIND_CHILL             | value.temperature.windchill.forecast.0 |       |      | number |      
  | FEELS_LIKE             | value.temperature.feelslike.forecast.0 |       |      | number |      
  | WIND_SPEED             | value.speed.wind.forecast.0            |       |      | number |      
  | WIND_DIRECTION         | value.direction.wind.forecast.0        |       |      | number |      
  | WIND_DIRECTION_STR     | weather.direction.wind.forecast.0      |       |      | string |      
  | WIND_ICON              | weather.icon.wind.forecast.0           |       |      | string |      
  | HISTORY_CHART          | weather.chart.url                      |       |      | string |      
  | FORECAST_CHART         | weather.chart.url.forecast             |       |      | string |      
  | LOCATION               | location                               |       |      | string |      
  | ICON%d                 |                                        |       |      | string |      
  | TEMP_MIN%d             |                                        |       |      | number |      
  | TEMP_MAX%d             |                                        |       |      | number |      
  | DATE%d                 |                                        |       |      | string |      
  | DOW%d                  |                                        |       |      | string |      
  | STATE%d                |                                        |       |      | string |      
  | TEMP%d                 |                                        |       |      | number |      
  | HUMIDITY%d             |                                        |       |      | number |      
  | HUMIDITY_MAX%d         |                                        |       |      | number |      
  | PRECIPITATION_CHANCE%d |                                        |  / %  | %    | number |      
  | PRECIPITATION%d        |                                        |  / mm | mm   | number |      
  | WIND_SPEED%d           |                                        |       |      | number |      
  | WIND_DIRECTION%d       |                                        |       |      | number |      
  | WIND_DIRECTION_STR%d   |                                        |       |      | string |      
  | WIND_ICON%d            |                                        |       |      | string |      
--|------------------------|----------------------------------------|-------|------|--------|------


## window
--|----------|-------------------------------|---------|------
R | Name     | Role                          | Wr      | Regex
--|----------|-------------------------------|---------|------
* | ACTUAL   | sensor.window                 | boolean |      
  | UNREACH  | indicator.maintenance.unreach | boolean | X    
  | LOWBAT   | indicator.maintenance.lowbat  | boolean | X    
  | MAINTAIN | indicator.maintenance         | boolean | X    
  | ERROR    | indicator.error               |         | X    
--|----------|-------------------------------|---------|------


## windowTilt
--|----------|-------------------------------|---------|------
R | Name     | Role                          | Wr      | Regex
--|----------|-------------------------------|---------|------
* | ACTUAL   | value.window                  | number  |      
  | UNREACH  | indicator.maintenance.unreach | boolean | X    
  | LOWBAT   | indicator.maintenance.lowbat  | boolean | X    
  | MAINTAIN | indicator.maintenance         | boolean | X    
  | ERROR    | indicator.error               |         | X    
--|----------|-------------------------------|---------|------

