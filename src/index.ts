/**
 * Copyright 2018-2023 bluefox <dogafox@gmail.com>
 *
 * The MIT License (MIT)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 **/
// Version 2.0.0, 2023.10.23
export enum Types {
    unknown = 'unknown',
    airCondition = 'airCondition',
    blind = 'blind',
    blindButtons = 'blindButtons',
    button = 'button',
    buttonSensor = 'buttonSensor',
    camera = 'camera',
    chart = 'chart',
    cie = 'cie',
    ct = 'ct',
    dimmer = 'dimmer',
    door = 'door',
    fireAlarm = 'fireAlarm',
    floodAlarm = 'floodAlarm',
    gate = 'gate',
    hue = 'hue',
    humidity = 'humidity',
    image = 'image',
    info = 'info',
    instance = 'instance',
    light = 'light',
    location = 'location',
    lock = 'lock',
    media = 'media',
    motion = 'motion',
    rgb = 'rgb',
    rgbSingle = 'rgbSingle',
    rgbwSingle = 'rgbwSingle',
    slider = 'slider',
    socket = 'socket',
    temperature = 'temperature',
    thermostat = 'thermostat',
    vacuumCleaner = 'vacuumCleaner',
    volume = 'volume',
    volumeGroup = 'volumeGroup',
    warning = 'warning',
    weatherCurrent = 'weatherCurrent',
    weatherForecast = 'weatherForecast',
    window = 'window',
    windowTilt = 'windowTilt',
}

export enum StateType {
    Number = 'number',
    String = 'string',
    Boolean = 'boolean',
    File = 'file',
}

interface InternalDetectorState {
    role?: RegExp; // RegEx to detect role
    channelRole?: RegExp; // RegEx to detect a channel role of state
    ignoreRole?: RegExp; // RegEx to ignore some specific roles
    indicator?: boolean; // is it will be shown like a small icon or as a value
    type?: StateType | StateType[]; // state type: 'number', 'string' or 'boolean' or array of possible values
    name: string; // own TAG of the state to process it in the logic
    write?: boolean; // if set to true or false, it will be checked the write attribute, if no attribute, so "false" will be assumed
    read?: boolean; // if set to true or false, it will be checked the write attribute, if no attribute, so "true" will be assumed
    min?: StateType; // type of attribute: number', 'string' or 'boolean'. This attribute must exist in common
    max?: StateType; // type of attribute: number', 'string' or 'boolean'. This attribute must exist in common
    required?: boolean; // if required to detect the pattern as valid
    noSubscribe?: boolean; // no automatic subscription for this state (e.g., if write only)
    searchInParent?: boolean; // if this pattern should be search in a device too and not only in channel
    enums?: (obj: ioBroker.Object, enums: string[]) => boolean; // function to execute custom category detection
    multiple?: boolean; // if more than one state may have this pattern in channel
    noDeviceDetection?: boolean; // do not search indicators in parent device
    notSingle?: boolean; // this state may belong to more than one tile simultaneously (e.g., volume tile and media with volume)
    inverted?: boolean; // is state of indicator must be inverted
    stateName?: RegExp; // regex for state names (IDs). Not suggested
    defaultStates?: { [key: string]: string }; // is for detection irrelevant, but will be used by iobroker.devices.
    defaultRole?: string; // is for detection irrelevant, but will be used by iobroker.devices - only states WITH defaultRole will show up in UI.
    defaultUnit?: string; // is for detection irrelevant, but will be used by iobroker.devices.
    defaultType?: StateType; // is for detection irrelevant, but will be used by iobroker.devices.
    defaultChannelRole?: string; // is for detection irrelevant, but will be used by iobroker.devices.
    unit?: string;
    objectType?: string;
    state?: RegExp;
}

export interface DetectorState extends InternalDetectorState {
    original?: InternalDetectorState;
    id: string;
}

const SharedPatterns: { [id: string]: InternalDetectorState } = {
    working:   {role: /^indicator\.working$/,                 indicator: true,                    notSingle: true, name: 'WORKING',   required: false, defaultRole: 'indicator.working', defaultType: StateType.Boolean},
    unreach:   {role: /^indicator(\.maintenance)?\.unreach$/, indicator: true,  type: StateType.Boolean,  notSingle: true, name: 'UNREACH',   required: false, defaultRole: 'indicator.maintenance.unreach'},
    lowbat:    {role: /^indicator(\.maintenance)?\.lowbat$|^indicator(\.maintenance)?\.battery$/, indicator: true,  type: StateType.Boolean, notSingle: true, name: 'LOWBAT', required: false, defaultRole: 'indicator.maintenance.lowbat'},
    maintain:  {role: /^indicator\.maintenance$/,             indicator: true,  type: StateType.Boolean,  notSingle: true, name: 'MAINTAIN',  required: false, defaultRole: 'indicator.maintenance'},
    error:     {role: /^indicator\.error$/,                   indicator: true,                    notSingle: true, name: 'ERROR',     required: false, defaultRole: 'indicator.error', defaultType: StateType.String},
    direction: {role: /^indicator\.direction$/,               indicator: true,                    notSingle: true, name: 'DIRECTION', required: false, defaultRole: 'indicator.direction'},
    reachable: {role: /^indicator\.reachable$/,               indicator: true,  type: StateType.Boolean,  notSingle: true, name: 'CONNECTED', required: false, defaultRole: 'indicator.reachable', inverted: true},
};

export interface DetectOptions {
    objects: Record<string, ioBroker.Object>; // all objects
    id: string;
    _keysOptional?: string[];      // For optimization, it is Object.keys(objects)
    _usedIdsOptional?: string[];   // For optimization, initially it is empty array
    ignoreIndicators?: string[];   // List of state names, that will be ignored. E.g., ['UNREACH_STICKY']
    allowedTypes?: Types[];        // List of allowed types. E.g., ['channel', 'device', 'state']
    excludedTypes?: Types[];        // List of excluded types. E.g., ['channel', 'device', 'state']
}

interface DetectorContext {
    objects: Record<string, ioBroker.Object>; // all objects
    channelStates: string[];
    usedIds: string[];
    usedInCurrentDevice: string[];
    ignoreIndicators: string[];
    result: PatternControl | null;
    pattern: Types;
    state: InternalDetectorState;
}

interface InternalPatternControl {
    states: InternalDetectorState[];
    type: Types;
    enumRequired?: boolean;
}
export interface PatternControl {
    states: DetectorState[];
    type: Types;
    enumRequired?: boolean;
}

interface PatternWords {
    [lang: string]: RegExp[]
}

class ChannelDetector {
    private enums: string[] | null = null;
    private cache: any;
    constructor() {
        this.cache = {};
    }
    protected static patterns: { [key: string]: InternalPatternControl } = {
        chart: {
            states: [
                { objectType: 'chart', name: 'CHART' }
            ],
            type: Types.chart
        },
        mediaPlayer: {
            // Receive the state of player via `media.state`. Controlling the player via buttons.
            states: [
                // one of
                {role: /^media.state(\..*)?$/,                               indicator: false,                   type: [StateType.Boolean, StateType.Number], name: 'STATE',    required: true,   defaultRole: 'media.state'},
                // optional
                {role: /^button.play(\..*)?$|^action.play(\..*)?$/,          indicator: false,     write: true,  type: StateType.Boolean, name: 'PLAY',     required: false, noSubscribe: true,   defaultRole: 'button.play'},
                {role: /^button.pause(\..*)?$|^action.pause(\..*)?$/,        indicator: false,     write: true,  type: StateType.Boolean, name: 'PAUSE',    required: false, noSubscribe: true,   defaultRole: 'button.pause'},
                {role: /^button.stop(\..*)?$|^action.stop(\..*)?$/,          indicator: false,     write: true,  type: StateType.Boolean, name: 'STOP',     required: false, noSubscribe: true,   defaultRole: 'button.stop'},
                {role: /^button.next(\..*)?$|^action.next(\..*)?$/,          indicator: false,     write: true,  type: StateType.Boolean, name: 'NEXT',     required: false, noSubscribe: true,   defaultRole: 'button.next'},
                {role: /^button.prev(\..*)?$|^action.prev(\..*)?$/,          indicator: false,     write: true,  type: StateType.Boolean, name: 'PREV',     required: false, noSubscribe: true,   defaultRole: 'button.prev'},
                {role: /^media.mode.shuffle(\..*)?$/,   indicator: false,     write: true,  type: StateType.Boolean, name: 'SHUFFLE',  required: false, noSubscribe: true,   defaultRole: 'media.mode.shuffle'},
                {role: /^media.mode.repeat(\..*)?$/,    indicator: false,     write: true,  type: StateType.Number,  name: 'REPEAT',   required: false, noSubscribe: true,   defaultRole: 'media.mode.repeat'},
                {role: /^media.artist(\..*)?$/,         indicator: false,     write: false, type: StateType.String,  name: 'ARTIST',   required: false,   defaultRole: 'media.artist'},
                {role: /^media.album(\..*)?$/,          indicator: false,     write: false, type: StateType.String,  name: 'ALBUM',    required: false,   defaultRole: 'media.album'},
                {role: /^media.title(\..*)?$/,          indicator: false,     write: false, type: StateType.String,  name: 'TITLE',    required: false,   defaultRole: 'media.title'},
                // one of the following
                {role: /^media.cover$|^media.cover.big$/, indicator: false,   write: false, type: StateType.String,  name: 'COVER',    required: false, notSingle: true,   defaultRole: 'media.cover'},
                {role: /^media.cover(\..*)$/,             indicator: false,   write: false, type: StateType.String,  name: 'COVER',    required: false, notSingle: true},
                {role: /^media.duration(\..*)?$/,       indicator: false,     write: false, type: StateType.Number,  name: 'DURATION', required: false, noSubscribe: true,   defaultRole: 'media.duration', defaultUnit: 'sec'},
                {role: /^media.elapsed(\..*)?$/,        indicator: false,                   type: StateType.Number,  name: 'ELAPSED',  required: false, noSubscribe: true,   defaultRole: 'media.elapsed', defaultUnit: 'sec'},
                {role: /^media.seek(\..*)?$/,           indicator: false,     write: true,  type: StateType.Number,  name: 'SEEK',     required: false, noSubscribe: true,   defaultRole: 'media.seek'},
                {role: /^media.track(\..*)?$/,          indicator: false,                   type: StateType.String,  name: 'TRACK',    required: false, noSubscribe: true,   defaultRole: 'media.track'},
                {role: /^media.episode(\..*)?$/,        indicator: false,                   type: StateType.String,  name: 'EPISODE',  required: false, noSubscribe: true,   defaultRole: 'media.episode'},
                {role: /^media.season(\..*)?$/,         indicator: false,                   type: StateType.String,  name: 'SEASON',   required: false, noSubscribe: true,   defaultRole: 'media.season'},
                {role: /^level.volume?$/,               indicator: false,                   type: StateType.Number,  min: StateType.Number, max: StateType.Number, write: true,       name: 'VOLUME',         required: false, notSingle: true, noSubscribe: true,   defaultRole: 'level.volume'},
                {role: /^value.volume?$/,               indicator: false,                   type: StateType.Number,  min: StateType.Number, max: StateType.Number, write: false,      name: 'VOLUME_ACTUAL',  required: false, notSingle: true, noSubscribe: true,   defaultRole: 'value.volume'},
                {role: /^media.mute?$/,                 indicator: false,                   type: StateType.Boolean,                               write: true,       name: 'MUTE',           required: false, notSingle: true, noSubscribe: true,   defaultRole: 'media.mute'},
                // Ignore the following states of chromecast
                {stateName: /\.paused$|\.playerState$/, indicator: false,                                                                                     name: 'IGNORE',         required: false, multiple: true,  noSubscribe: true},
                SharedPatterns.reachable,
                SharedPatterns.lowbat,
                SharedPatterns.maintain,
                SharedPatterns.error
            ],
            type: Types.media
        },
        weatherForecast: {
            states: [
                {role: /^weather.icon$|^weather.icon.forecast.0$/,                   indicator: false, type: StateType.String,  name: 'ICON',          required: true, defaultRole: 'weather.icon.forecast.0'},
                {role: /^value.temperature.min.forecast.0$/,                         indicator: false, type: StateType.Number,  name: 'TEMP_MIN',      required: true, defaultRole: 'value.temperature.min.forecast.0'},
                {role: /^value.temperature.max.forecast.0$/,                         indicator: false, type: StateType.Number,  name: 'TEMP_MAX',      required: true, defaultRole: 'value.temperature.max.forecast.0'},
                // optional
                {role: /^value.precipitation$|^value.precipitation.forecast.0$/,     indicator: false, type: StateType.Number,  name: 'PRECIPITATION_CHANCE',     unit: '%', required: false, defaultRole: 'value.precipitation.forecast.0'},
                {role: /^value.precipitation$|^value.precipitation.forecast.0$/,     indicator: false, type: StateType.Number,  name: 'PRECIPITATION',            unit: 'mm', required: false, defaultRole: 'value.precipitation.forecast.0'},
                {role: /^date$|^date.forecast.0$/,                                   indicator: false, type: StateType.String,  name: 'DATE',          required: false, defaultRole: 'date.forecast.0'},
                {role: /^dayofweek$|^dayofweek.forecast.0$/,                         indicator: false, type: StateType.String,  name: 'DOW',           required: false, defaultRole: 'dayofweek.forecast.0'},
                {role: /^weather.state$|^weather.state.forecast.0$/,                 indicator: false, type: StateType.String,  name: 'STATE',         required: false, defaultRole: 'weather.state.forecast.0'},
                {role: /^value.temperature$|^value.temperature.forecast.0$/,         indicator: false, type: StateType.Number,  name: 'TEMP',          required: false, defaultRole: 'value.temperature.forecast.0'},
                {role: /^value.pressure$/,                                           indicator: false, type: StateType.Number,  name: 'PRESSURE',      required: false, defaultRole: 'weather.icon.forecast.0'},
                {role: /^value.humidity$|value.humidity.forecast.0$/,                indicator: false, type: StateType.Number,  name: 'HUMIDITY',      required: false, defaultRole: 'value.humidity.forecast.0'},

                {role: /^(?:date|time).sunrise(?:.forecast\.0)?$/,                   indicator: false, type: StateType.String,  name: 'TIME_SUNRISE',  required: false, defaultRole: 'date.sunrise'},
                {role: /^(?:date|time).sunset(?:.forecast\.0)?$/,                    indicator: false, type: StateType.String,  name: 'TIME_SUNSET',   required: false, defaultRole: 'date.sunset'},

                {role: /^value.temperature.windchill$|^value.temperature.windchill.forecast.0$/, indicator: false, type: StateType.Number,  name: 'WIND_CHILL',    required: false, defaultRole: 'value.temperature.windchill.forecast.0'},
                {role: /^value.temperature.feelslike$|^value.temperature.feelslike.forecast.0$/, indicator: false, type: StateType.Number,  name: 'FEELS_LIKE',    required: false, defaultRole: 'value.temperature.feelslike.forecast.0'},
                {role: /^value.speed.wind$|^value.speed.wind.forecast.0$/,           indicator: false, type: StateType.Number,  name: 'WIND_SPEED',    required: false, defaultRole: 'value.speed.wind.forecast.0'},
                {role: /^value.direction.wind$|^value.direction.wind.forecast.0$/,   indicator: false, type: StateType.Number,  name: 'WIND_DIRECTION',required: false, defaultRole: 'value.direction.wind.forecast.0'},
                {role: /^weather.direction.wind$|^weather.direction.wind.forecast.0$/, indicator: false, type: StateType.String,  name: 'WIND_DIRECTION_STR',required: false, defaultRole: 'weather.direction.wind.forecast.0'},
                {role: /^weather.icon.wind$|^weather.icon.wind.forecast.0$/,         indicator: false, type: StateType.String,  name: 'WIND_ICON',     required: false, defaultRole: 'weather.icon.wind.forecast.0'},
                {role: /^weather.chart.url$/,                                        indicator: false, type: StateType.String,  name: 'HISTORY_CHART',   required: false, noSubscribe: true, defaultRole: 'weather.chart.url'},
                {role: /^weather.chart.url.forecast$/,                               indicator: false, type: StateType.String,  name: 'FORECAST_CHART',  required: false, noSubscribe: true, defaultRole: 'weather.chart.url.forecast'},
                {role: /^location$/,                                                 indicator: false, type: StateType.String,  name: 'LOCATION',        required: false, defaultRole: 'location'},

                // other days
                {role: /^weather.icon.forecast.(\d)$/,                               indicator: false, type: StateType.String,  name: 'ICON%d',          required: false, searchInParent: true, multiple: true, noSubscribe: true, notSingle: true},

                {role: /^value.temperature.min.forecast.(\d)$/,                      indicator: false, type: StateType.Number,  name: 'TEMP_MIN%d',      required: false, searchInParent: true, multiple: true, noSubscribe: true},
                {role: /^value.temperature.max.forecast.(\d)$/,                      indicator: false, type: StateType.Number,  name: 'TEMP_MAX%d',      required: false, searchInParent: true, multiple: true, noSubscribe: true},

                {role: /^date.forecast.(\d)$/,                                       indicator: false, type: StateType.String,  name: 'DATE%d',          required: false, searchInParent: true, multiple: true, noSubscribe: true},
                {role: /^dayofweek.forecast.(\d)$/,                                  indicator: false, type: StateType.String,  name: 'DOW%d',           required: false, searchInParent: true, multiple: true, noSubscribe: true},
                {role: /^weather.state.forecast.(\d)$/,                              indicator: false, type: StateType.String,  name: 'STATE%d',         required: false, searchInParent: true, multiple: true, noSubscribe: true},
                {role: /^value.temperature.forecast.(\d)$/,                          indicator: false, type: StateType.Number,  name: 'TEMP%d',          required: false, searchInParent: true, multiple: true, noSubscribe: true},

                {role: /^value.humidity.forecast.(\d)$/,                             indicator: false, type: StateType.Number,  name: 'HUMIDITY%d',      required: false, searchInParent: true, multiple: true, noSubscribe: true},
                {role: /^value.humidity.max.forecast.(\d)$/,                         indicator: false, type: StateType.Number,  name: 'HUMIDITY_MAX%d',  required: false, searchInParent: true, multiple: true, noSubscribe: true},

                {role: /^value.precipitation.forecast.(\d)$/,                        indicator: false, type: StateType.Number,  unit: '%', name: 'PRECIPITATION_CHANCE%d', required: false, searchInParent: true, multiple: true, noSubscribe: true},
                {role: /^value.precipitation.forecast.(\d)$/,                        indicator: false, type: StateType.Number,  unit: 'mm', name: 'PRECIPITATION%d', required: false, searchInParent: true, multiple: true, noSubscribe: true},

                {role: /^value.speed.wind.forecast.(\d)$/,                           indicator: false, type: StateType.Number,  name: 'WIND_SPEED%d',    required: false, searchInParent: true, multiple: true, noSubscribe: true},
                {role: /^value.direction.wind.forecast.(\d)$/,                       indicator: false, type: StateType.Number,  name: 'WIND_DIRECTION%d',required: false, searchInParent: true, multiple: true, noSubscribe: true},
                {role: /^weather.direction.wind.forecast.(\d)$/,                     indicator: false, type: StateType.String,  name: 'WIND_DIRECTION_STR%d',required: false, searchInParent: true, multiple: true, noSubscribe: true},
                {role: /^weather.icon.wind.forecast.(\d)$/,                          indicator: false, type: StateType.String,  name: 'WIND_ICON%d',     required: false, searchInParent: true, multiple: true, noSubscribe: true},
            ],
            type: Types.weatherForecast
        },
        rgb: {
            states: [
                {role: /^level\.color\.red$/,                             indicator: false, type: StateType.Number,  write: true,           name: 'RED',           required: true,   defaultRole: 'level.color.red'},
                {role: /^level\.color\.green$/,                           indicator: false, type: StateType.Number,  write: true,           name: 'GREEN',         required: true,   defaultRole: 'level.color.green'},
                {role: /^level\.color\.blue$/,                            indicator: false, type: StateType.Number,  write: true,           name: 'BLUE',          required: true,   defaultRole: 'level.color.blue'},
                // optional
                {role: /^level\.color\.white$/,                           indicator: false, type: StateType.Number,  write: true,           name: 'WHITE',         required: false,  defaultRole: 'level.color.white'},
                {role: /^level\.dimmer$/,                                 indicator: false, type: StateType.Number,  write: true,           name: 'DIMMER',        required: false,  defaultRole: 'level.dimmer', defaultUnit: '%'},
                {role: /^level\.brightness$/,                             indicator: false, type: StateType.Number,  write: true,           name: 'BRIGHTNESS',    required: false},
                {role: /^level\.color\.saturation$/,                      indicator: false, type: StateType.Number,  write: true,           name: 'SATURATION',    required: false},
                {role: /^level\.color\.temperature$/,                     indicator: false, type: StateType.Number,  write: true,           name: 'TEMPERATURE',   required: false,  defaultRole: 'level.color.temperature', defaultUnit: '°K'},
                {role: /^switch\.light$/,                                 indicator: false, type: StateType.Boolean, write: true,           name: 'ON',            required: false,  defaultRole: 'switch.light'},
                {role: /^switch$/,                                        indicator: false, type: StateType.Boolean, write: true,           name: 'ON',            required: false},
                {role: /^(state|switch|sensor)\.light|switch$/,           indicator: false, type: StateType.Boolean, write: false,          name: 'ON_ACTUAL',     required: false,  defaultRole: 'sensor.light'},
                SharedPatterns.working,
                SharedPatterns.unreach,
                SharedPatterns.lowbat,
                SharedPatterns.maintain,
                SharedPatterns.error
            ],
            type: Types.rgb
        },
        rgbwSingle: {
            states: [
                {role: /^level\.color\.rgbw$/,                            indicator: false, type: StateType.String,  write: true,           name: 'RGBW',          required: true,   defaultRole: 'level.color.rgbw'},
                // optional
                {role: /^level\.dimmer$/,                                 indicator: false, type: StateType.Number,  write: true,           name: 'DIMMER',        required: false,  defaultRole: 'level.dimmer', defaultUnit: '%'},
                {role: /^level\.brightness$/,                             indicator: false, type: StateType.Number,  write: true,           name: 'BRIGHTNESS',    required: false,  defaultUnit: '%'},
                {role: /^level\.color\.saturation$/,                      indicator: false, type: StateType.Number,  write: true,           name: 'SATURATION',    required: false},
                {role: /^level\.color\.temperature$/,                     indicator: false, type: StateType.Number,  write: true,           name: 'TEMPERATURE',   required: false,  defaultRole: 'level.color.temperature', defaultUnit: '°K'},
                {role: /^switch\.light$/,                                 indicator: false, type: StateType.Boolean, write: true,           name: 'ON',            required: false,  defaultRole: 'switch.light'},
                {role: /^switch$/,                                        indicator: false, type: StateType.Boolean, write: true,           name: 'ON',            required: false},
                {role: /^(state|switch|sensor)\.light|switch$/,           indicator: false, type: StateType.Boolean, write: false,          name: 'ON_ACTUAL',     required: false,  defaultRole: 'sensor.light'},
                SharedPatterns.working,
                SharedPatterns.unreach,
                SharedPatterns.lowbat,
                SharedPatterns.maintain,
                SharedPatterns.error
            ],
            type: Types.rgbwSingle
        },
        rgbSingle: {
            states: [
                {role: /^level\.color\.rgb$/,                             indicator: false, type: StateType.String,  write: true,           name: 'RGB',           required: true,   defaultRole: 'level.color.rgb'},
                // optional
                {role: /^level\.dimmer$/,                                 indicator: false, type: StateType.Number,  write: true,           name: 'DIMMER',        required: false,  defaultRole: 'level.dimmer', defaultUnit: '%'},
                {role: /^level\.brightness$/,                             indicator: false, type: StateType.Number,  write: true,           name: 'BRIGHTNESS',    required: false,  defaultUnit: '%'},
                {role: /^level\.color\.saturation$/,                      indicator: false, type: StateType.Number,  write: true,           name: 'SATURATION',    required: false},
                {role: /^level\.color\.temperature$/,                     indicator: false, type: StateType.Number,  write: true,           name: 'TEMPERATURE',   required: false,  defaultRole: 'level.color.temperature', defaultUnit: '°K'},
                {role: /^switch\.light$/,                                 indicator: false, type: StateType.Boolean, write: true,           name: 'ON',            required: false,  defaultRole: 'switch.light'},
                {role: /^switch$/,                                        indicator: false, type: StateType.Boolean, write: true,           name: 'ON',            required: false},
                {role: /^(state|switch|sensor)\.light|switch$/,           indicator: false, type: StateType.Boolean, write: false,          name: 'ON_ACTUAL',     required: false,  defaultRole: 'sensor.light'},
                SharedPatterns.working,
                SharedPatterns.unreach,
                SharedPatterns.lowbat,
                SharedPatterns.maintain,
                SharedPatterns.error
            ],
            type: Types.rgbSingle
        },
        cie: {
            states: [
                {role: /^level\.color\.cie$/,                             indicator: false, type: StateType.String,  write: true,           name: 'CIE',           required: true,   defaultRole: 'level.color.cie'},
                // optional
                {role: /^level\.dimmer$/,                                 indicator: false, type: StateType.Number,  write: true,           name: 'DIMMER',        required: false,  defaultRole: 'level.dimmer', defaultUnit: '%'},
                {role: /^level\.brightness$/,                             indicator: false, type: StateType.Number,  write: true,           name: 'BRIGHTNESS',    required: false,  defaultUnit: '%'},
                {role: /^level\.color\.saturation$/,                      indicator: false, type: StateType.Number,  write: true,           name: 'SATURATION',    required: false},
                {role: /^level\.color\.temperature$/,                     indicator: false, type: StateType.Number,  write: true,           name: 'TEMPERATURE',   required: false,  defaultRole: 'level.color.temperature', defaultUnit: '°K'},
                {role: /^switch(\.light)?$/,                              indicator: false, type: StateType.Boolean, write: true,           name: 'ON',            required: false,  defaultRole: 'switch.light'},
                {role: /^(state|switch|sensor)\.light|switch$/,           indicator: false, type: StateType.Boolean, write: false,          name: 'ON_ACTUAL',     required: false,  defaultRole: 'sensor.light'},
                SharedPatterns.working,
                SharedPatterns.unreach,
                SharedPatterns.lowbat,
                SharedPatterns.maintain,
                SharedPatterns.error
            ],
            type: Types.cie
        },
        hue: {
            states: [
                {role: /^level\.color\.hue$/,                             indicator: false, type: StateType.Number,  write: true,           name: 'HUE',           required: true,  defaultRole: 'level.color.hue', defaultUnit: '°'},
                // optional
                {role: /^level\.dimmer$/,                                 indicator: false, type: StateType.Number,  write: true,           name: 'DIMMER',        required: false, searchInParent: true, defaultRole: 'level.dimmer', defaultUnit: '%'},
                {role: /^level\.brightness$/,                             indicator: false, type: StateType.Number,  write: true,           name: 'BRIGHTNESS',    required: false},
                {role: /^level\.color\.saturation$/,                      indicator: false, type: StateType.Number,  write: true,           name: 'SATURATION',    required: false},
                {role: /^level\.color\.temperature$/,                     indicator: false, type: StateType.Number,  write: true,           name: 'TEMPERATURE',   required: false, defaultRole: 'level.color.temperature', defaultUnit: '°K'},
                {role: /^switch\.light$/,                                 indicator: false, type: StateType.Boolean, write: true,           name: 'ON',            required: false, defaultRole: 'switch.light'},
                {role: /^switch$/,                                        indicator: false, type: StateType.Boolean, write: true,           name: 'ON',            required: false},
                {role: /^(state|switch|sensor)\.light|switch$/,           indicator: false, type: StateType.Boolean, write: false,          name: 'ON_ACTUAL',     required: false, defaultRole: 'sensor.light'},
                SharedPatterns.working,
                SharedPatterns.unreach,
                SharedPatterns.lowbat,
                SharedPatterns.maintain,
                SharedPatterns.error
            ],
            type: Types.hue
        },
        ct: {
            states: [
                {role: /^level\.color\.temperature$/,                     indicator: false, type: StateType.Number,  write: true,           name: 'TEMPERATURE',   required: true,  defaultRole: 'level.color.temperature', defaultUnit: '°K'},
                // optional
                {role: /^level\.dimmer$/,                                 indicator: false, type: StateType.Number,  write: true,           name: 'DIMMER',        required: false, defaultRole: 'level.dimmer', defaultUnit: '%'},
                {role: /^level\.brightness$/,                             indicator: false, type: StateType.Number,  write: true,           name: 'BRIGHTNESS',    required: false},
                {role: /^level\.color\.saturation$/,                      indicator: false, type: StateType.Number,  write: true,           name: 'SATURATION',    required: false},
                {role: /^switch\.light$/,                                 indicator: false, type: StateType.Boolean, write: true,           name: 'ON',            required: false, defaultRole: 'switch.light'},
                {role: /^switch$/,                                        indicator: false, type: StateType.Boolean, write: true,           name: 'ON',            required: false},
                {role: /^(state|switch|sensor)\.light|switch$/,           indicator: false, type: StateType.Boolean, write: false,          name: 'ON_ACTUAL',     required: false,  defaultRole: 'sensor.light'},
                SharedPatterns.working,
                SharedPatterns.unreach,
                SharedPatterns.lowbat,
                SharedPatterns.maintain,
                SharedPatterns.error
            ],
            type: Types.ct
        },
        warning: {
            states: [
                {role: /^value\.warning$/,                                indicator: false,                  name: 'LEVEL',         required: true,  defaultRole: 'value.warning'},
                // optional
                {role: /^weather\.title\.short$/,                         indicator: false, type: StateType.String,  name: 'TITLE',         required: false, defaultRole: 'weather.title.short'},
                {role: /^weather\.title$/,                                indicator: false, type: StateType.String,  name: 'INFO',          required: false, defaultRole: 'weather.title'},
                {role: /^date\.start$/,                                   indicator: false, type: StateType.String,  name: 'START',         required: false, defaultRole: 'date.start'},
                {role: /^date\.end$/,                                     indicator: false, type: StateType.String,  name: 'END',           required: false, defaultRole: 'date.end'},
                {role: /^date$/,                                          indicator: false, type: StateType.String,  name: 'START',         required: false},
                {role: /^weather\.chart\.url/,                            indicator: false, type: StateType.String,  name: 'ICON',          required: false, defaultRole: 'weather.chart.url'},

                // For detailed screen
                {role: /^weather\.state$/,                                indicator: false, type: StateType.String,  name: 'DESC',          required: false, noSubscribe: true, defaultRole: 'weather.state'},
            ],
            type: Types.warning
        },
        // the most full description could be found here:
        // https://yandex.ru/dev/dialogs/alice/doc/smart-home/concepts/device-type-thermostat-ac-docpage/
        airCondition: {
            states: [
                {role: /temperature(\..*)?$/,          indicator: false,     write: true,  type: StateType.Number,                                                    name: 'SET',                required: true,  defaultRole: 'level.temperature',     defaultUnit: '°C'},
                // AUTO, COOL, HEAT, ECO, OFF, DRY, FAN_ONLY
                {role: /airconditioner$/,              indicator: false,     write: true,  type: StateType.Number,    searchInParent: true,                           name: 'MODE',               required: true,  defaultRole: 'level.mode.airconditioner', defaultStates: {0: 'OFF', 1: 'AUTO', 2: 'COOL', 3: 'HEAT', 4: 'ECO', 5: 'FAN_ONLY', 6: 'DRY'}},
                // optional
                {role: /(speed|mode)\.fan$/,                  indicator: false,     write: true,  type: StateType.Number,                                                    name: 'SPEED',       required: false, defaultRole: 'level.mode.fan',        defaultStates: {0: 'AUTO', 1: 'HIGH', 2: 'LOW', 3: 'MEDIUM', 4: 'QUIET', 5: 'TURBO'}},
                {role: /^switch\.power$/,              indicator: false,     write: true,  type: [StateType.Boolean, StateType.Number],   searchInParent: true,               name: 'POWER',              required: false, defaultRole: 'switch.power'},
                {role: /^switch$/,                     indicator: false,     write: true,  type: StateType.Boolean,   searchInParent: true,                           name: 'POWER',              required: false},
                {role: /temperature(\..*)?$/,          indicator: false,     write: false, type: StateType.Number,    searchInParent: true,                           name: 'ACTUAL',             required: false, defaultRole: 'value.temperature',     defaultUnit: '°C'},
                {role: /humidity(\..*)?$/,             indicator: false,     write: false, type: StateType.Number,    searchInParent: true,                           name: 'HUMIDITY',           required: false, defaultRole: 'value.humidity',        defaultUnit: '%'},
                {role: /^switch\.boost(\..*)?$/,       indicator: false,     write: true,  type: [StateType.Boolean, StateType.Number],   searchInParent: true,               name: 'BOOST',              required: false, defaultRole: 'switch.boost'},
                {role: /swing$/,                       indicator: false,     write: true,  type: StateType.Number,    searchInParent: true,                           name: 'SWING',              required: false, defaultRole: 'level.mode.swing',      defaultStates: {0: 'AUTO', 1: 'HORIZONTAL', 2: 'STATIONARY', 3: 'VERTICAL'}},
                {role: /swing$/,                       indicator: false,     write: true,  type: StateType.Boolean,   searchInParent: true,                           name: 'SWING',              required: false, defaultRole: 'switch.mode.swing'},
                SharedPatterns.unreach,
                SharedPatterns.maintain,
                SharedPatterns.error
            ],
            type: Types.airCondition
        },
        thermostat: {
            states: [
                {role: /temperature(\..*)?$/,          indicator: false,     write: true,  type: StateType.Number,                                                    name: 'SET',                required: true,  defaultRole: 'level.temperature', defaultUnit: '°C'},
                // optional
                {role: /temperature(\..*)?$/,          indicator: false,     write: false, type: StateType.Number,    searchInParent: true,                           name: 'ACTUAL',             required: false, defaultRole: 'value.temperature', defaultUnit: '°C'},
                {role: /humidity(\..*)?$/,             indicator: false,     write: false, type: StateType.Number,    searchInParent: true,                           name: 'HUMIDITY',           required: false, defaultRole: 'value.humidity', defaultUnit: '%'},
                {role: /^switch(\.mode)?\.boost(\..*)?$/, indicator: false,  write: true,  type: [StateType.Boolean, StateType.Number],   searchInParent: true,               name: 'BOOST',              required: false, defaultRole: 'switch.mode.boost'},
                {role: /^switch\.power$/,              indicator: false,     write: true,  type: [StateType.Boolean, StateType.Number],   searchInParent: true,               name: 'POWER',              required: false, defaultRole: 'switch.power'},
                {role: /^switch(\.mode)?\.party$/,     indicator: false,     write: true,  type: [StateType.Boolean, StateType.Number],   searchInParent: true,               name: 'PARTY',              required: false, defaultRole: 'switch.mode.party'},
                {role: /^switch$/,                     indicator: false,     write: true,  type: StateType.Boolean,   searchInParent: true,                           name: 'POWER',              required: false},
                {role: /^level(\.mode)?\.thermostat$/, indicator: false,     write: true,  type: StateType.Number,    searchInParent: true,                           name: 'MODE',               required: false, defaultRole: 'level.mode.thermostat', defaultStates: {0: 'AUTO', 1: 'MANUAL'}},
                SharedPatterns.working,
                SharedPatterns.unreach,
                SharedPatterns.lowbat,
                SharedPatterns.maintain,
                SharedPatterns.error
            ],
            type: Types.thermostat
        },
        vacuumCleaner: {
            states: [
                {role: /^switch\.power$/,              indicator: false,     write: true,  type: [StateType.Boolean, StateType.Number],   searchInParent: true,               name: 'POWER',              required: true,  defaultRole: 'switch.power'},
                // AUTO, ECO, EXPRESS, NORMAL, QUIET
                {role: /mode\.cleanup$/,               indicator: false,     write: true,  type: StateType.Number,                searchInParent: true,               name: 'MODE',               required: true,  defaultRole: 'level.mode.cleanup', defaultStates: {0: 'AUTO', 1: 'NORMAL', 2: 'QUIET', 3: 'ECO', 4: 'EXPRESS'}},
                // optional
                {role: /vacuum\.map\.base64$/,         indicator: false,     write: false, type: StateType.String,                searchInParent: true,               name: 'MAP_BASE64',         required: false, defaultRole: 'vacuum.map.base64'},
                {role: /vacuum\.map\.url$/,            indicator: false,     write: false, type: StateType.String,                searchInParent: true,               name: 'MAP_URL',            required: false},
                {role: /mode\.work$/,                  indicator: false,     write: true,  type: StateType.Number,                searchInParent: true,               name: 'WORK_MODE',          required: false, defaultRole: 'level.mode.work',    defaultStates: {0: 'AUTO', 1: 'FAST', 2: 'MEDIUM', 3: 'SLOW', 4: 'TURBO'}},
                {role: /^value\.water$/,               indicator: false,     write: false, type: StateType.Number,                searchInParent: true, unit: '%',    name: 'WATER',              required: false, defaultRole: 'value.water',   defaultUnit: '%'},
                {role: /^value\.waste$/,               indicator: false,     write: false, type: StateType.Number,                searchInParent: true, unit: '%',    name: 'WASTE',              required: false, defaultRole: 'value.waste',   defaultUnit: '%'},
                {role: /^value\.battery$/,             indicator: false,     write: false, type: StateType.Number,                searchInParent: true, unit: '%',    name: 'BATTERY',            required: false, defaultRole: 'value.battery', defaultUnit: '%'},
                {role: /^value\.state$/,               indicator: false,     write: false, type: [StateType.Number, StateType.String],    searchInParent: true,               name: 'STATE',              required: false, defaultRole: 'value.state'},
                {role: /^switch\.pause$/,              indicator: false,     write: true,  type: StateType.Boolean,               searchInParent: true,               name: 'PAUSE',              required: false, defaultRole: 'switch.pause'},
                {role: /^indicator(\.maintenance)?\.waste$|^indicator(\.alarm)?\.waste/,  indicator: true,  type: StateType.Boolean, searchInParent: true,            name: 'WASTE_ALARM',        required: false, defaultRole: 'indicator.maintenance.waste'},
                {role: /^indicator(\.maintenance)?\.water$|^indicator(\.alarm)?\.water/,  indicator: true,  type: StateType.Boolean, searchInParent: true,            name: 'WATER_ALARM',        required: false, defaultRole: 'indicator.maintenance.water'},
                {role: /^value(\.usage)?\.filter/,     indicator: true,                    type: StateType.Number,                searchInParent: true,               name: 'FILTER',             required: false, defaultRole: 'value.usage.filter', defaultUnit: '%'},
                {role: /^value(\.usage)?\.brush/,      indicator: true,                    type: StateType.Number,                searchInParent: true,               name: 'BRUSH',              required: false, defaultRole: 'value.usage.brush', defaultUnit: '%'},
                {role: /^value(\.usage)?\.sensors/,    indicator: true,                    type: StateType.Number,                searchInParent: true,               name: 'SENSORS',            required: false, defaultRole: 'value.usage.sensors', defaultUnit: '%'},
                {role: /^value(\.usage)?\.brush\.side/,indicator: true,                    type: StateType.Number,                searchInParent: true,               name: 'SIDE_BRUSH',         required: false, defaultRole: 'value.usage.brush.side', defaultUnit: '%'},
                SharedPatterns.unreach,
                SharedPatterns.lowbat,
                SharedPatterns.maintain,
                SharedPatterns.error
            ],
            type: Types.vacuumCleaner
        },
        blinds: {
            states: [
                {role: /^level(\.blind)?$/,                       indicator: false, type: StateType.Number,  write: true, enums: ChannelDetector.roleOrEnumBlind, name: 'SET',                 required: true, defaultRole: 'level.blind', defaultUnit: '%'},
                // optional
                {role: /^value(\.blind)?$/,                       indicator: false, type: StateType.Number,               enums: ChannelDetector.roleOrEnumBlind, name: 'ACTUAL',              required: false, defaultRole: 'value.blind', defaultUnit: '%'},
                {role: /^button\.stop(\.blind)?$|^action\.stop$/, indicator: false, type: StateType.Boolean, write: true, enums: ChannelDetector.roleOrEnumBlind, name: 'STOP',                required: false, noSubscribe: true, defaultRole: 'button.stop.blind'},
                {role: /^button\.open(\.blind)?$/,                indicator: false, type: StateType.Boolean, write: true, enums: ChannelDetector.roleOrEnumBlind, name: 'OPEN',                required: false, noSubscribe: true, defaultRole: 'button.open.blind'},
                {role: /^button\.close(\.blind)?$/,               indicator: false, type: StateType.Boolean, write: true, enums: ChannelDetector.roleOrEnumBlind, name: 'CLOSE',               required: false, noSubscribe: true, defaultRole: 'button.close.blind'},
                {role: /^level(\.open)?\.tilt$/,                  indicator: false, type: StateType.Number,  write: true, enums: ChannelDetector.roleOrEnumBlind, name: 'TILT_SET',            required: false, defaultRole: 'level.tilt'},
                {role: /^value(\.open)?\.tilt$/,                  indicator: false, type: StateType.Number,               enums: ChannelDetector.roleOrEnumBlind, name: 'TILT_ACTUAL',         required: false, defaultRole: 'value.tilt'},
                {role: /^button\.stop\.tilt$/,                    indicator: false, type: StateType.Boolean, write: true, enums: ChannelDetector.roleOrEnumBlind, name: 'TILT_STOP',           required: false, noSubscribe: true, defaultRole: 'button.stop.tilt'},
                {role: /^button\.open\.tilt$/,                    indicator: false, type: StateType.Boolean, write: true, enums: ChannelDetector.roleOrEnumBlind, name: 'TILT_OPEN',           required: false, noSubscribe: true, defaultRole: 'button.open.tilt'},
                {role: /^button\.close\.tilt$/,                   indicator: false, type: StateType.Boolean, write: true, enums: ChannelDetector.roleOrEnumBlind, name: 'TILT_CLOSE',          required: false, noSubscribe: true, defaultRole: 'button.close.tilt'},
                SharedPatterns.direction,
                SharedPatterns.working,
                SharedPatterns.unreach,
                SharedPatterns.lowbat,
                SharedPatterns.maintain,
                SharedPatterns.error
            ],
            type: Types.blind
        },
        blindButtons: {
            states: [
                // blinds with no percentage setting / reading but buttons for up/down and stop:
                {role: /^button\.stop(\.blind)?$|^action\.stop$/, indicator: false, type: StateType.Boolean, write: true, enums: ChannelDetector.roleOrEnumBlind, name: 'STOP',                required: true,  noSubscribe: true, defaultRole: 'button.stop.blind'},
                {role: /^button\.open(\.blind)?$/,                indicator: false, type: StateType.Boolean, write: true, enums: ChannelDetector.roleOrEnumBlind, name: 'OPEN',                required: true,  noSubscribe: true, defaultRole: 'button.open.blind'},
                {role: /^button\.close(\.blind)?$/,               indicator: false, type: StateType.Boolean, write: true, enums: ChannelDetector.roleOrEnumBlind, name: 'CLOSE',               required: true,  noSubscribe: true, defaultRole: 'button.close.blind'},
                //optional tilt:
                {role: /^level\.tilt$/,                           indicator: false, type: StateType.Number,  write: true, enums: ChannelDetector.roleOrEnumBlind, name: 'TILT_SET',            required: false, defaultRole: 'level.tilt'},
                {role: /^value\.tilt$/,                           indicator: false, type: StateType.Number,               enums: ChannelDetector.roleOrEnumBlind, name: 'TILT_ACTUAL',         required: false, defaultRole: 'value.tilt'},
                {role: /^button\.stop\.tilt$/,                    indicator: false, type: StateType.Boolean, write: true, enums: ChannelDetector.roleOrEnumBlind, name: 'TILT_STOP',           required: false, noSubscribe: true, defaultRole: 'button.stop.tilt'},
                {role: /^button\.open\.tilt$/,                    indicator: false, type: StateType.Boolean, write: true, enums: ChannelDetector.roleOrEnumBlind, name: 'TILT_OPEN',           required: false, noSubscribe: true, defaultRole: 'button.open.tilt'},
                {role: /^button\.close\.tilt$/,                   indicator: false, type: StateType.Boolean, write: true, enums: ChannelDetector.roleOrEnumBlind, name: 'TILT_CLOSE',          required: false, noSubscribe: true, defaultRole: 'button.close.tilt'},
                SharedPatterns.direction,
                SharedPatterns.working,
                SharedPatterns.unreach,
                SharedPatterns.lowbat,
                SharedPatterns.maintain,
                SharedPatterns.error
            ],
            type: Types.blindButtons
        },
        gate: {
            states: [
                {role: /^switch(\.gate)?$/,                   indicator: false, type: StateType.Boolean,  write: true, enums: ChannelDetector.roleOrEnumGate, name: 'SET',                 required: true, defaultRole: 'switch.gate'},
                // optional
                {role: /^value(\.position)?|^value(\.gate)?$/,indicator: false, type: StateType.Number,                enums: ChannelDetector.roleOrEnumGate,  name: 'ACTUAL',             required: false, defaultRole: 'value.blind', defaultUnit: '%'},
                {role: /^button\.stop$|^action\.stop$/,       indicator: false, type: StateType.Boolean, write: true,  enums: ChannelDetector.roleOrEnumGate,  name: 'STOP',               required: false, noSubscribe: true, defaultRole: 'button.stop'},
                SharedPatterns.direction,
                SharedPatterns.working,
                SharedPatterns.unreach,
                SharedPatterns.maintain,
                SharedPatterns.error
            ],
            type: Types.gate
        },
        weatherCurrent: {
            states: [
                {role: /^value(\.temperature)?$/,                     indicator: false, type: StateType.Number,                name: 'ACTUAL',                                      required: true, defaultRole: 'value.temperature', defaultUnit: '°C'},
                {role: /^weather\.icon$/,                             indicator: false,                                name: 'ICON',                                        required: true, defaultRole: 'weather.icon'},
                // optional
                {role: /^value\.precipitation\.chance$/,              indicator: false, type: StateType.Number,                name: 'PRECIPITATION_CHANCE',                        defaultRole: 'value.precipitation.chance', defaultUnit: '%'},
                {role: /^value\.precipitation\.type$/,                indicator: false, type: StateType.Number,                name: 'PRECIPITATION_TYPE',                          defaultRole: 'value.precipitation.type', defaultStates: {0: 'NO', 1: 'RAIN', 2: 'SNOW', 3: 'HAIL'}},
                {role: /^value\.pressure$/,                           indicator: false, type: StateType.Number,                name: 'PRESSURE',                                    defaultRole: 'value.pressure', defaultUnit: 'mbar'},
                {role: /^value\.pressure\.tendency$/,                 indicator: false, type: StateType.String,                name: 'PRESSURE_TENDENCY',                           defaultRole: 'value.pressure.tendency'},
                {role: /^value\.temperature\.windchill$/,             indicator: false, type: StateType.Number,                name: 'REAL_FEEL_TEMPERATURE',                       defaultRole: 'value.temperature.windchill', defaultUnit: '°C'},
                {role: /^value.humidity$/,                            indicator: false, type: StateType.Number,                name: 'HUMIDITY',                                    defaultRole: 'value.humidity', defaultUnit: '%'},
                {role: /^value.uv$/,                                  indicator: false, type: StateType.Number,                name: 'UV',                                          defaultRole: 'value.uv'},
                {role: /^weather\.state$/,                            indicator: false, type: StateType.String,                name: 'WEATHER',                                     defaultRole: 'weather.state'},
                {role: /^value\.direction\.wind$/,                    indicator: false, type: StateType.String,                name: 'WIND_DIRECTION',                              defaultRole: 'value.direction.wind', defaultUnit: '°'},
                {role: /^value\.speed\.wind\.gust$/,                  indicator: false, type: StateType.Number,                name: 'WIND_GUST',                                   defaultRole: 'value.speed.wind.gust', defaultUnit: 'km/h'},
                {role: /^value\.speed\.wind$/,                        indicator: false, type: StateType.Number,                name: 'WIND_SPEED',                                  defaultRole: 'value.speed.wind$', defaultUnit: 'km/h'},
                SharedPatterns.lowbat,
                SharedPatterns.unreach,
                SharedPatterns.maintain,
                SharedPatterns.error
            ],
            type: Types.weatherCurrent
        },
        camera: {
            states: [
                {role: /^camera(\.\w+)?$/,                                        indicator: false, type: StateType.File,     name: 'FILE',                           required: true, defaultRole: 'camera'},
                // optional
                {role: /^switch(\.camera)?\.autofocus$/,                          indicator: false, type: StateType.Boolean,  write: true,  name: 'AUTOFOCUS',        required: false, defaultRole: 'switch.camera.autofocus'},
                {role: /^switch(\.camera)?\.autowhitebalance$/,                   indicator: false, type: StateType.Boolean,  write: true,  name: 'AUTOWHITEBALANCE', required: false, defaultRole: 'switch.camera.autowhitebalance'},
                {role: /^switch(\.camera)?\.brightness$/,                         indicator: false, type: StateType.Boolean,  write: true,  name: 'BRIGHTNESS',       required: false, defaultRole: 'switch.camera.brightness'},
                {role: /^switch(\.camera)?\.nightmode$/,                          indicator: false, type: StateType.Boolean,  write: true,  name: 'NIGHTMODE',        required: false, defaultRole: 'switch.camera.nightmode'},
                {role: /^level(\.camera)?\.position$|^level(\.camera)?(\.ptz)$/,  indicator: false, type: StateType.Number,   write: true,  name: 'PTZ',              required: false, defaultRole: 'level.camera.position'},
                SharedPatterns.unreach,
                SharedPatterns.lowbat,
                SharedPatterns.maintain,
                SharedPatterns.error
            ],
            type: Types.camera,
            enumRequired: false
        },
        lock: {
            states: [
                {role: /^switch\.lock$/,                      indicator: false, type: StateType.Boolean,  write: true,              name: 'SET',                 required: true, defaultRole: 'switch.lock'},
                // optional
                {role: /^state$/,                             indicator: false, type: StateType.Boolean,  write: false,             name: 'ACTUAL',              required: false, defaultRole: 'state'},
                {                                             indicator: false, type: StateType.Boolean,  write: true, read: false, name: 'OPEN',                required: false, noSubscribe: true, defaultRole: 'button'},
                SharedPatterns.direction,
                SharedPatterns.working,
                SharedPatterns.unreach,
                SharedPatterns.lowbat,
                SharedPatterns.maintain,
                SharedPatterns.error
            ],
            type: Types.lock
        },
        motion: {
            states: [
                {role: /^state\.motion$|^sensor\.motion$/,                   indicator: false, type: StateType.Boolean, name: 'ACTUAL',     required: true, defaultRole: 'sensor.motion'},
                // optional
                {role: /brightness$/,                                        indicator: false, type: StateType.Number,  name: 'SECOND',     required: false, defaultRole: 'value.brightness', defaultUnit: 'lux'},
                SharedPatterns.unreach,
                SharedPatterns.lowbat,
                SharedPatterns.maintain,
                SharedPatterns.error
            ],
            type: Types.motion
        },
        window: {
            states: [
                {role: /^state(\.window)?$|^sensor(\.window)?/,                   indicator: false, type: StateType.Boolean, enums: ChannelDetector.roleOrEnumWindow, name: 'ACTUAL',     required: true, defaultRole: 'sensor.window'},
                // optional
                SharedPatterns.unreach,
                SharedPatterns.lowbat,
                SharedPatterns.maintain,
                SharedPatterns.error
            ],
            type: Types.window
        },
        windowTilt: {
            states: [
                {role: /^state?$|^value(\.window)?$/,                             indicator: false, type: StateType.Number,  enums: ChannelDetector.roleOrEnumWindow, name: 'ACTUAL',     required: true, defaultRole: 'value.window'},
                // optional
                SharedPatterns.unreach,
                SharedPatterns.lowbat,
                SharedPatterns.maintain,
                SharedPatterns.error
            ],
            type: Types.windowTilt
        },
        fireAlarm: {
            states: [
                {role: /^(state|sensor|indicator)(\.alarm)?\.fire$/,                        indicator: false, type: StateType.Boolean, name: 'ACTUAL',     required: true, defaultRole: 'sensor.alarm.fire', defaultChannelRole: 'sensor.alarm.fire'},
                // optional
                SharedPatterns.unreach,
                SharedPatterns.lowbat,
                SharedPatterns.maintain,
                SharedPatterns.error
            ],
            type: Types.fireAlarm,
            enumRequired: false
        },
        floodAlarm: {
            states: [
                {role: /^(state|sensor|indicator)(\.alarm)?\.flood$/,                        indicator: false, type: StateType.Boolean, name: 'ACTUAL',     required: true, defaultRole: 'sensor.alarm.flood', defaultChannelRole: 'sensor.alarm.flood'},
                // optional
                SharedPatterns.unreach,
                SharedPatterns.lowbat,
                SharedPatterns.maintain,
                SharedPatterns.error
            ],
            type: Types.floodAlarm
        },
        door: {
            states: [
                {role: /^state?$|^state(\.door)?$|^sensor(\.door)?/,              indicator: false, type: StateType.Boolean, write: false, enums: ChannelDetector.roleOrEnumDoor, name: 'ACTUAL',     required: true, defaultRole: 'sensor.door'},
                // optional
                SharedPatterns.unreach,
                SharedPatterns.lowbat,
                SharedPatterns.maintain,
                SharedPatterns.error
            ],
            type: Types.door
        },
        dimmer: {
            states: [
                {role: /^level(\.dimmer)?$|^level\.brightness$/, indicator: false, type: StateType.Number,  write: true,       enums: ChannelDetector.roleOrEnumLight, name: 'SET',        required: true, defaultRole: 'level.dimmer', ignoreRole: /^level\.dimspeed$/, defaultUnit: '%'},
                // optional
                {role: /^value(\.dimmer)?$/,                     indicator: false, type: StateType.Number,  write: false,      enums: ChannelDetector.roleOrEnumLight, name: 'ACTUAL',      required: false, defaultRole: 'value.dimmer', defaultUnit: '%'},
                {role: /^switch(\.light)?$|^state$/,             indicator: false, type: StateType.Boolean, write: true,       enums: ChannelDetector.roleOrEnumLight, name: 'ON_SET',      required: false, defaultRole: 'switch.light'},
                {role: /^(state|switch|sensor)\.light|switch$/,  indicator: false, type: StateType.Boolean, write: false,      enums: ChannelDetector.roleOrEnumLight, name: 'ON_ACTUAL',   required: false, defaultRole: 'sensor.light'},
                SharedPatterns.working,
                SharedPatterns.unreach,
                SharedPatterns.lowbat,
                SharedPatterns.maintain,
                SharedPatterns.error
            ],
            type: Types.dimmer
        },
        light: {
            states: [
                {role: /^switch(\.light)?$|^state$/,           indicator: false, type: StateType.Boolean, write: true,       enums: ChannelDetector.roleOrEnumLight, name: 'SET',         required: true,  defaultRole: 'switch.light'},
                // optional
                {role: /^(state|switch|sensor)\.light|switch$/, indicator: false, type: StateType.Boolean, write: false,      enums: ChannelDetector.roleOrEnumLight, name: 'ON_ACTUAL',      required: false, defaultRole: 'sensor.light'},
                {role: /^value\.power$/,                        indicator: false, type: StateType.Number,  write: false,      enums: ChannelDetector.roleOrEnumLight, name: 'ELECTRIC_POWER', required: false, defaultRole: 'value.power', defaultUnit: 'W'},
                {role: /^value\.current$/,                      indicator: false, type: StateType.Number,  write: false,      enums: ChannelDetector.roleOrEnumLight, name: 'CURRENT',        required: false, defaultRole: 'value.current', defaultUnit: 'mA'},
                {role: /^value\.voltage$/,                      indicator: false, type: StateType.Number,  write: false,      enums: ChannelDetector.roleOrEnumLight, name: 'VOLTAGE',        required: false, defaultRole: 'value.voltage', defaultUnit: 'V'},
                {role: /^value\.power\.consumption$/,           indicator: false, type: StateType.Number,  write: false,      enums: ChannelDetector.roleOrEnumLight, name: 'CONSUMPTION',    required: false, defaultRole: 'value.power.consumption', defaultUnit: 'Wh'},
                {role: /^value\.frequency$/,                    indicator: false, type: StateType.Number,  write: false,      enums: ChannelDetector.roleOrEnumLight, name: 'FREQUENCY',      required: false, defaultRole: 'value.frequency', defaultUnit: 'Hz'},
                SharedPatterns.working,
                SharedPatterns.unreach,
                SharedPatterns.lowbat,
                SharedPatterns.maintain,
                SharedPatterns.error
            ],
            type: Types.light
        },
        volume: {
            states: [
                {role: /^level\.volume$/,                   indicator: false, type: StateType.Number,  min: StateType.Number, max: StateType.Number, write: true,       name: 'SET',         required: true,   defaultRole: 'level.volume'},
                // optional
                {role: /^value\.volume$/,                   indicator: false, type: StateType.Number,  min: StateType.Number, max: StateType.Number, write: false,      name: 'ACTUAL',      required: false,  defaultRole: 'value.volume'},
                {role: /^media\.mute$/,                     indicator: false, type: StateType.Boolean,                               write: true,       name: 'MUTE',        required: false,  defaultRole: 'media.mute'},
                SharedPatterns.working,
                SharedPatterns.unreach,
                SharedPatterns.lowbat,
                SharedPatterns.maintain,
                SharedPatterns.error
            ],
            type: Types.volume
        },
        location_one: {
            states: [
                {role: /^value\.gps$/,                             indicator: false, type: StateType.String,  write: false,      name: 'GPS',           required: true,  defaultRole: 'value.gps'},
                // optional
                {role: /^value\.gps\.elevation$/,                  indicator: false, type: StateType.Number,  write: false,      name: 'ELEVATION',     required: false,  defaultRole: 'value.gps.elevation'},
                {role: /^value\.radius$|value\.gps\.radius$/,      indicator: false, type: StateType.Number,  write: false,      name: 'RADIUS',        required: false,  defaultRole: 'value.gps.radius'},
                {role: /^value\.accuracy$|^value\.gps\.accuracy$/, indicator: false, type: StateType.Number,  write: false,      name: 'ACCURACY',      required: false,  defaultRole: 'value.gps.accuracy'},
                SharedPatterns.unreach,
                SharedPatterns.lowbat,
                SharedPatterns.maintain,
                SharedPatterns.error
            ],
            type: Types.location
        },
        location: {
            states: [
                {role: /^value\.gps\.longitude$/,                  indicator: false, type: StateType.Number,  write: false,      name: 'LONGITUDE',     required: true,  defaultRole: 'value.gps.longitude', defaultUnit: '°'},
                {role: /^value\.gps\.latitude$/,                   indicator: false, type: StateType.Number,  write: false,      name: 'LATITUDE',      required: true,  defaultRole: 'value.gps.latitude', defaultUnit: '°'},
                // optional
                {role: /^value\.gps\.elevation$/,                  indicator: false, type: StateType.Number,  write: false,      name: 'ELEVATION',     required: false,  defaultRole: 'value.gps.elevation'},
                {role: /^value\.radius$|value\.gps\.radius$/,      indicator: false, type: StateType.Number,  write: false,      name: 'RADIUS',        required: false,  defaultRole: 'value.gps.radius'},
                {role: /^value\.accuracy$|^value\.gps\.accuracy$/, indicator: false, type: StateType.Number,  write: false,      name: 'ACCURACY',      required: false,  defaultRole: 'value.gps.accuracy'},
                SharedPatterns.unreach,
                SharedPatterns.lowbat,
                SharedPatterns.maintain,
                SharedPatterns.error
            ],
            type: Types.location
        },
        volumeGroup: {
            states: [
                {role: /^level\.volume\.group?$/,            indicator: false, type: StateType.Number,  min: StateType.Number, max: StateType.Number, write: true,       name: 'SET',         required: true,  defaultRole: 'level.volume.group'},
                // optional
                {role: /^value\.volume\.group$/,             indicator: false, type: StateType.Number,  min: StateType.Number, max: StateType.Number, write: false,      name: 'ACTUAL',      required: false, defaultRole: 'value.volume.group'},
                {role: /^media\.mute\.group$/,               indicator: false, type: StateType.Boolean,                               write: true,       name: 'MUTE',        required: false, defaultRole: 'media.mute.group'},
                SharedPatterns.working,
                SharedPatterns.unreach,
                SharedPatterns.lowbat,
                SharedPatterns.maintain,
                SharedPatterns.error
            ],
            type: Types.volumeGroup
        },
        levelSlider: {
            states: [
                {role: /^level(\..*)?$/,                   indicator: false, type: StateType.Number,  min: StateType.Number, max: StateType.Number, write: true,       name: 'SET',         required: true, defaultRole: 'level', defaultUnit: '%'},
                // optional
                {role: /^value(\..*)?$/,                   indicator: false, type: StateType.Number,  min: StateType.Number, max: StateType.Number, write: false,      name: 'ACTUAL',      required: false, defaultRole: 'value'},
                SharedPatterns.working,
                SharedPatterns.unreach,
                SharedPatterns.lowbat,
                SharedPatterns.maintain,
                SharedPatterns.error
            ],
            type: Types.slider
        },
        socket: {
            states: [
                {role: /^switch$|^state$|^switch\.active$/,           indicator: false, type: StateType.Boolean, write: true,  name: 'SET',            required: true,  defaultRole: 'switch'},
                // optional
                {role: /^state$|^state\.active$/,                     indicator: false, type: StateType.Boolean, write: false, name: 'ACTUAL',         required: false, defaultRole: 'switch'},
                {role: /^value\.power$/,                              indicator: false, type: StateType.Number,  write: false, name: 'ELECTRIC_POWER', required: false, defaultRole: 'value.power', defaultUnit: 'W'},
                {role: /^value\.current$/,                            indicator: false, type: StateType.Number,  write: false, name: 'CURRENT',        required: false, defaultRole: 'value.current', defaultUnit: 'mA'},
                {role: /^value\.voltage$/,                            indicator: false, type: StateType.Number,  write: false, name: 'VOLTAGE',        required: false, defaultRole: 'value.voltage', defaultUnit: 'V'},
                {role: /^value\.power\.consumption$/,                 indicator: false, type: StateType.Number,  write: false, name: 'CONSUMPTION',    required: false, defaultRole: 'value.power.consumption', defaultUnit: 'Wh'},
                {role: /^value\.frequency$/,                          indicator: false, type: StateType.Number,  write: false, name: 'FREQUENCY',      required: false, defaultRole: 'value.frequency', defaultUnit: 'Hz'},
                SharedPatterns.working,
                SharedPatterns.unreach,
                SharedPatterns.lowbat,
                SharedPatterns.maintain,
                SharedPatterns.error
            ],
            type: Types.socket
        },
        button: {
            states: [
                {role: /^button(\.[.\w]+)?$|^action(\.[.\w]+)?$/,           indicator: false, type: StateType.Boolean, read: false, write: true,       name: 'SET',         required: true, noSubscribe: true, defaultRole: 'button'},
                // optional
                SharedPatterns.unreach,
                SharedPatterns.lowbat,
                SharedPatterns.maintain,
                SharedPatterns.error
            ],
            type: Types.button
        },
        buttonSensor: {
            states: [
                {role: /^button(\.[.\w]+)?$/,           indicator: false, type: StateType.Boolean, read: true, write: false,       name: 'PRESS',         required: true,  defaultRole: 'button.press'},
                // optional
                {role: /^button\.long/,                 indicator: false, type: StateType.Boolean, read: true, write: false,       name: 'PRESS_LONG',    required: false, defaultRole: 'button.long'},
                SharedPatterns.unreach,
                SharedPatterns.lowbat,
                SharedPatterns.maintain,
                SharedPatterns.error
            ],
            type: Types.buttonSensor
        },
        temperature: {
            states: [
                {role: /temperature$/,             indicator: false, write: false, type: StateType.Number,  name: 'ACTUAL',     required: true,  defaultRole: 'value.temperature', defaultUnit: '°C'},
                {role: /humidity$/,                indicator: false, write: false, type: StateType.Number,  name: 'SECOND',     required: false, defaultRole: 'value.humidity', defaultUnit: '%'},
                SharedPatterns.unreach,
                SharedPatterns.lowbat,
                SharedPatterns.maintain,
                SharedPatterns.error
            ],
            type: Types.temperature
        },
        humidity: {
            states: [
                {role: /humidity$/,                indicator: false, write: false, type: StateType.Number,  name: 'ACTUAL',     required: true, defaultRole: 'value.humidity', defaultUnit: '%'},
                SharedPatterns.unreach,
                SharedPatterns.lowbat,
                SharedPatterns.maintain,
                SharedPatterns.error
            ],
            type: Types.humidity
        },
        image: {
            states: [
                {role: /\.icon$|^icon$|^icon\.|\.icon\.|\.chart\.url\.|\.chart\.url$|^url.icon$/, indicator: false, write: false, type: StateType.String, name: 'URL', required: true},
                SharedPatterns.unreach,
                SharedPatterns.lowbat,
                SharedPatterns.maintain,
                SharedPatterns.error
            ],
            type: Types.image
        },
        info: {
            states: [
                {                                  indicator: false,                                 name: 'ACTUAL',         required: true, multiple: true, noDeviceDetection: true, ignoreRole: /\.inhibit$/, defaultRole: 'state'},
                SharedPatterns.working,
                SharedPatterns.unreach,
                SharedPatterns.lowbat,
                SharedPatterns.maintain,
                SharedPatterns.error
            ],
            type: Types.info
        }
    };

    private static checkEnum(enums: string[], words: PatternWords): boolean {
        let found = false;
        if (enums) {
            enums.forEach(en => {
                const pos = en.lastIndexOf('.');
                if (pos !== -1) {
                    en = en.substring(pos + 1);
                }
                for (const lang in words) {
                    if (words.hasOwnProperty(lang)) {
                        if (words[lang].find(reg => reg.test(en))) {
                            found = true;
                            return false;
                        }
                    }
                }
            });
        }
        return found;
    }

    private static roleOrEnum(obj: ioBroker.Object, enums: string[], roles: string[], words: PatternWords): boolean {
        if (roles && obj.common.role && roles.includes(obj.common.role)) {
            return true;
        }
        return ChannelDetector.checkEnum(enums, words);
    }

// -------------- LIGHT -----------------------------------------
    private static lightWords: PatternWords = {
        en: [/lights?/i,    /lamps?/i,      /ceilings?/i],
        de: [/licht(er)?/i, /lampen?/i,     /beleuchtung(en)?/i],
        ru: [/свет/i,       /ламп[аы]/i,    /торшеры?/, /подсветк[аи]/i, /лампочк[аи]/i, /светильники?/i]
    };
    private static lightRoles: string[] = ['switch.light', 'dimmer', 'value.dimmer', 'level.dimmer', 'sensor.light', 'state.light'];
    private static roleOrEnumLight(obj: ioBroker.Object, enums: string[]): boolean {
        return ChannelDetector.roleOrEnum(obj, enums, ChannelDetector.lightRoles, ChannelDetector.lightWords);
    }

// -------------- BLINDS -----------------------------------------
    private static blindWords: { [lang: string]: RegExp[] } = {
        en: [/blinds?/i,    /windows?/i,    /shutters?/i],
        de: [/rollladen?/i, /fenstern?/i,   /beschattung(en)?/i, /jalousien?/i],
        ru: [/ставни/i,     /рольставни/i,  /окна|окно/, /жалюзи/i]
    };

    private static blindRoles: string[] = ['blind', 'level.blind', 'value.blind', 'action.stop', 'button.stop', 'button.stop.blind', 'button.open.blind', 'button.close.blind', 'level.tilt', 'value.tilt', 'button.tilt.open', 'button.tilt.close', 'button.tilt.stop'];
    private static roleOrEnumBlind(obj: ioBroker.Object, enums: string[]): boolean {
        return ChannelDetector.roleOrEnum(obj, enums, ChannelDetector.blindRoles, ChannelDetector.blindWords);
    }

    // -------------- GATES ------------------------------------------
    private static gateWords: { [lang: string]: RegExp[] } = {
        en: [/gates?/i],
        de: [/^toren$/i, /^tor$/i], // "^" because of Actor
        ru: [/ворота/i],
    };

    private static gateRoles: string[] = ['gate', 'value.gate', 'switch.gate', 'action.stop', 'button.stop'];
    private static roleOrEnumGate(obj: ioBroker.Object, enums: string[]): boolean {
        return ChannelDetector.roleOrEnum(obj, enums, ChannelDetector.gateRoles, ChannelDetector.gateWords);
    }

    // -------------- WINDOWS -----------------------------------------
    private static windowRoles: string[] = ['window', 'state.window', 'sensor.window', 'value.window'];
    private static roleOrEnumWindow(obj: ioBroker.Object, enums: string[]): boolean {
        return ChannelDetector.roleOrEnum(obj, enums, ChannelDetector.windowRoles, ChannelDetector.blindWords);
    }

    // -------------- DOORS -----------------------------------------
    private static doorsWords: { [lang: string]: RegExp[] } = {
        en: [/doors?/i,      /gates?/i,      /wickets?/i,        /entry|entries/i],
        de: [/^türe?/i,      /^tuere?/i,     /^tore?$/i,         /einfahrt(en)?/i,  /pforten?/i], // "^" because of Actor
        ru: [/двери|дверь/i, /ворота/i,      /калитка|калитки/,  /въезды?/i,        /входы?/i]
    };

    private static doorsRoles: string[] = ['door', 'state.door', 'sensor.door'];
    private static roleOrEnumDoor(obj: ioBroker.Object, enums: string[]): boolean {
        return ChannelDetector.roleOrEnum(obj, enums, ChannelDetector.doorsRoles, ChannelDetector.doorsWords);
    }

    private static getEnums(): { [id: string]: { roles: string[], words: { [lang: string]: RegExp[] } }} {
        return {
            door: {
                roles: ChannelDetector.doorsRoles,
                words: ChannelDetector.doorsWords,
            },
            window: {
                roles: ChannelDetector.windowRoles,
                words: ChannelDetector.blindWords,
            },
            blind: {
                roles: ChannelDetector.blindRoles,
                words: ChannelDetector.blindWords,
            },
            gate: {
                roles: ChannelDetector.gateRoles,
                words: ChannelDetector.gateWords
            },
            light: {
                roles: ChannelDetector.lightRoles,
                words: ChannelDetector.lightWords,
            }
        }
    }

    private static getAllStatesInChannel(keys: string[], channelId: string): string[] {
        const list: string[] = [];
        const reg = new RegExp(`^${channelId.replace(/([$^.)([\]{}])/g, '\\$1')}\\.[^.]+$`);
        keys.forEach(_id => reg.test(_id) && list.push(_id));
        return list;
    }

    private static getAllStatesInDevice(keys: string[], channelId: string): string[] {
        const list: string[] = [];
        const reg = new RegExp(`^${channelId.replace(/([$^.)([\]{}])/g, '\\$1')}\\.[^.]+\\.[^.]+$`);
        keys.forEach(_id =>reg.test(_id) && list.push(_id));
        return list;
    }

    private static getFunctionEnums(objects: Record<string, ioBroker.Object>): string[] {
        const enums: string[] = [];
        const reg = /^enum\.functions\./;
        for (const id in objects) {
            if (objects.hasOwnProperty(id) && reg.test(id) && objects[id] && objects[id].type === 'enum' && objects[id].common && objects[id].common.members && objects[id].common.members.length) {
                enums.push(id);
            }
        }
        return enums;
    }

    private static getParentId(id: string): string {
        const pos = id.lastIndexOf('.');
        if (pos !== -1) {
            return id.substring(0, pos);
        }
        return id;
    }

    private _applyPattern(objects: Record<string, ioBroker.Object>, id: string, statePattern: InternalDetectorState) {
        if (objects[id] && objects[id].common) {
            let role = null;
            if (statePattern.role) {
                role = statePattern.role.test(objects[id].common.role || '');

                if (role && statePattern.channelRole) {
                    const channelId = ChannelDetector.getParentId(id);
                    const channelRole = objects[channelId]?.common.role || '';
                    if (channelRole && (objects[channelId].type === 'channel' || objects[channelId].type === 'device')) {
                        role = statePattern.channelRole.test(channelRole);
                    } else {
                        role = false;
                    }
                }
            }
            if (role === false) {
                return false;
            }

            if (statePattern.objectType && objects[id].type !== statePattern.objectType) {
                return false;
            }

            if (statePattern.stateName && !statePattern.stateName.test(id)) {
                return false;
            }

            if (statePattern.unit && statePattern.unit !== objects[id].common.unit) {
                return false;
            }

            if (statePattern.ignoreRole){
                const role = objects[id].common.role || '';
                if (role && statePattern.ignoreRole.test(role)) {
                    return false;
                }
            }

            if (statePattern.indicator === false && (objects[id].common.role || '').match(/^indicator(\.[.\w]+)?$/)) {
                return false;
            }

            if (statePattern.state) {
                const lastStateName = id.split('.').pop() || '';
                if (lastStateName && !statePattern.state.test(lastStateName)) {
                    return false;
                }
            }

            if (statePattern.write !== undefined && statePattern.write !== (objects[id].common.write || false)) {
                return false;
            }

            if (statePattern.min === StateType.Number && typeof objects[id].common.min !== StateType.Number) {
                return false;
            }

            if (statePattern.max === StateType.Number && typeof objects[id].common.max !== StateType.Number) {
                return false;
            }

            if (statePattern.read !== undefined && statePattern.read !== (objects[id].common.read === undefined ? true : objects[id].common.read)) {
                return false;
            }

            if (statePattern.type) {
                if (typeof statePattern.type === StateType.String) {
                    if (statePattern.type !== objects[id].common.type) {
                        return false;
                    }
                } else {
                    let noOneOk = true;
                    for (let t = 0; t < statePattern.type.length; t++) {
                        if (statePattern.type[t] === objects[id].common.type) {
                            noOneOk = false;
                            break;
                        }
                    }
                    if (noOneOk) {
                        return false;
                    }
                }
            }

            if (statePattern.enums && typeof statePattern.enums === 'function') {
                const enums = this._getEnumsForId(objects, id);
                if (!statePattern.enums(objects[id], enums || [])) {
                    return false;
                }
            }

            return true;
        } else {
            return false;
        }
    };

    private _getEnumsForId(objects: Record<string, ioBroker.Object>, id: string): string[] | null {
        this.enums = this.enums || ChannelDetector.getFunctionEnums(objects);
        const result: string[] = [];
        this.enums.forEach(e => {
            if (objects[e].common.members.includes(id)) {
                result.push(e);
            }
        });
        if (!result.length && objects[id] && objects[id].type === 'state') {
            let channel = ChannelDetector.getParentId(id);
            if (objects[channel] && (objects[channel].type === 'channel' || objects[channel].type === 'device')) {
                this.enums.forEach(e => {
                    if (objects[e].common.members.includes(channel)) {
                        result.push(e);
                    }
                });
            }
        }

        return result.length ? result : null;
    };

    private static copyState(oldState: InternalDetectorState, newState?: DetectorState): DetectorState {
        newState = newState || JSON.parse(JSON.stringify(oldState));
        if (newState) {
            // @ts-ignore
            newState.original = oldState.original || oldState;
            if ('enums' in oldState && oldState.enums) {
                newState.enums = oldState.enums;
            }
            if ('role' in oldState && oldState.role) {
                newState.role = oldState.role;
            }
            if ('channelRole' in oldState && oldState.channelRole) {
                newState.channelRole = oldState.channelRole;
            }
        }

        // @ts-ignore
        return newState;
    }

    private _testOneState(context: DetectorContext): boolean {
        const objects: Record<string, ioBroker.Object> = context.objects;
        const pattern: Types = context.pattern;
        const state: InternalDetectorState = context.state;
        const channelStates: string[] = context.channelStates;
        const usedIds: string[] = context.usedIds;
        const usedInCurrentDevice: string[] = context.usedInCurrentDevice;
        const ignoreIndicators: string[] = context.ignoreIndicators;
        let result: PatternControl | null = context.result;
        let found: boolean = false;
        let count = 0;

        // check every state in channel
        channelStates.forEach(_id => {
            // this is only valid if no one state could be multiple
            // if (result && count >= result.states.length) {
            //     // do not look for more states as all possible found
            //     return;
            // }

            // one exception: if we already found a state with name COVER, so ignore the second one
            if (state.name === 'COVER' && result?.states.find(e => e.id && e.name === 'COVER')) {
                return;
            }

            if (state.indicator && ignoreIndicators) {
                const parts = _id.split('.');
                const lastStateName = parts.pop() || '';

                if (lastStateName && ignoreIndicators.includes(lastStateName)) {
                    // console.log(`${_id} ignored`);
                    return;
                }
            }

            if (
                (state.indicator ||
                    (!usedInCurrentDevice.includes(_id) && // not used in a current device and pattern
                        (state.notSingle || !usedIds.includes(_id)) // or not used globally
                    )
                ) && this._applyPattern(objects, _id, state)
            ) {
                if (!state.indicator) {
                    usedInCurrentDevice.push(_id);
                }
                // we detected a state, copy InternalPatternControl
                if (!result) {
                    result = JSON.parse(JSON.stringify(ChannelDetector.patterns[pattern]));
                    context.result = result;
                    result?.states.forEach((state, j) =>
                        ChannelDetector.copyState(ChannelDetector.patterns[pattern].states[j], state));
                }

                if (result) {
                    // if this ID is not yet in the list
                    if (!result.states.find(e => e.id === _id)) {
                        let _found = false;
                        for (let u = 0; u < result.states.length; u++) {
                            if (result.states[u].name === state.name) {
                                count++;
                                result.states[u].id = _id;
                                _found = true;
                                break;
                            }
                        }
                        if (!_found) {
                             // impossible
                            console.error(`Cannot find state for ${_id}`);
                        }
                    }

                    found = true;
                    if (state.multiple && channelStates.length > 1) {
                        // execute this rule for every state in this channel
                        channelStates.forEach(cid => {
                            if (cid === _id) {
                                return;
                            }
                            if ((state.indicator || (!usedInCurrentDevice.includes(cid) && (state.notSingle || !usedIds.includes(cid)))) &&
                                this._applyPattern(objects, cid, state)) {
                                if (!state.indicator) {
                                    usedInCurrentDevice.push(cid);
                                }
                                if (result) {
                                    if (Array.isArray(state)) {
                                        const newState: DetectorState = ChannelDetector.copyState(state[0]);
                                        newState.id = cid;
                                        result.states.push(newState);
                                    } else {
                                        const newState: DetectorState = ChannelDetector.copyState(state);
                                        newState.id = cid;
                                        result.states.push(newState);
                                    }
                                }
                            }
                        });
                    }
                }
            }
        });
        return found;
    };

    private static getChannelStates(objects: Record<string, ioBroker.Object>, id: string, keys: string[]): string[] {
        switch (objects[id].type) {
            case 'chart':
            case 'state':
                return [id];

            case 'device':
                const result = ChannelDetector.getAllStatesInDevice(keys, id);
                if (result.length) {
                    return result;
                }

                // if no states, it may be device without channels
                return ChannelDetector.getAllStatesInChannel(keys, id);

            default:
                // channel
                return ChannelDetector.getAllStatesInChannel(keys, id);
        }
    }

    private static patternIsAllowed(pattern: InternalPatternControl, allowedTypes: Types[] | undefined, excludedTypes: Types[] | undefined): boolean {
        if (!pattern) {
            return false;
        }
        if (Array.isArray(pattern.type)) {
            for (let t = 0; t < pattern.type.length; t++) {
                if (allowedTypes && !allowedTypes.includes(pattern.type[t])) {
                    return false;
                }
                if (excludedTypes && excludedTypes.includes(pattern.type[t])) {
                    return false;
                }
            }
            return true;
        } else {
            if (allowedTypes && !allowedTypes.includes(pattern.type)) {
                return false;
            }

            return !excludedTypes || !excludedTypes.includes(pattern.type);
        }
    }

    private static allRequiredStatesFound(context: DetectorContext) {
        if (!context.result) {
            return false;
        }

        const states = context.result.states;

        for (let a = 0; a < states.length; a++) {
            if (states[a].required && !states[a].id) {
                return false;
            }
        }

        return true;
    }

    private static cleanState(state: DetectorState, objects: Record<string, ioBroker.Object>) {
        const role: string = objects[state.id]?.common?.role || '';
        if (state.name.includes('%d') && state.role && state.id && role) {
            const m = state.role.exec(role);
            if (m) {
                state.name = state.name.replace('%d', m[1]);
            }
        }
        if (state.role) {
            delete state.role;
        }
        if (state.enums) {
            delete state.enums;
        }
        if (state.original) {
            delete state.original;
        }
    }

    private _detectNext(options: DetectOptions): PatternControl | null {
        const objects = options.objects;
        const id: string = options.id;
        const keys: string[] = options._keysOptional || [];
        let usedIds: string[] = options._usedIdsOptional || [];
        const ignoreIndicators: string[] | undefined  = options.ignoreIndicators;

        if (!usedIds) {
            usedIds = [];
            options._usedIdsOptional = usedIds;
        }

        if (!objects[id] || !objects[id].common) {
            return null;
        }

        const context: DetectorContext = {
            objects,
            channelStates: ChannelDetector.getChannelStates(objects, id, keys || []),
            usedIds,
            ignoreIndicators: ignoreIndicators || [],
            result: null,
            pattern: Types.unknown,
            usedInCurrentDevice: [],
            state: { } as InternalDetectorState,
        };

        for (const pattern in ChannelDetector.patterns) {
            if (
                !ChannelDetector.patternIsAllowed(
                    ChannelDetector.patterns[pattern],
                    options.allowedTypes,
                    options.excludedTypes,
                )
            ) {
                continue;
            }

            context.result = null;

            context.pattern = pattern as Types;
            context.usedInCurrentDevice = [];
            ChannelDetector.patterns[pattern].states.forEach(state => {
                let found = false;

                // one of the following
                context.state = state;
                if (this._testOneState(context)) {
                    found = true;
                }
                if (state.required && !found) {
                    context.result = null;
                    return false;
                }
            });

            if (!ChannelDetector.allRequiredStatesFound(context)) {
                continue;
            }

            context.usedInCurrentDevice.forEach(id => usedIds.push(id));

            let deviceStates;

            // looking for indicators and special states
            if (objects[id].type !== 'device') {
                // get device name
                let deviceId = ChannelDetector.getParentId(id);
                if (
                    objects[deviceId] &&
                    (objects[deviceId].type === 'channel' ||
                        objects[deviceId].type === 'device')
                ) {
                    deviceStates = ChannelDetector.getAllStatesInDevice(keys, deviceId);
                    deviceStates?.forEach(_id => {
                        context.result?.states.forEach((state, i) => {
                            if (
                                !state.id &&
                                (state.indicator || state.searchInParent) &&
                                !state.noDeviceDetection
                            ) {
                                if (this._applyPattern(objects, _id, state.original as InternalDetectorState) && context.result) {
                                    context.result.states[i].id = _id;
                                }
                            }
                        });
                    });
                }
            }

            if (context.result) {
                const result = context.result as PatternControl;
                if (result) {
                    result.states.forEach((state: DetectorState) =>
                        ChannelDetector.cleanState(state, context.objects));
                }
            }

            return context.result;
        }

        return null;
    };

    /**
     * detect
     *
     * Detect devices in some given path. Path can show to state, channel or device.
     *
     * @param options - parameters with following fields
     *                  objects - Object, that has all objects in form {'id1': {obj1params...}, 'id2': {obj2params...}}
     *                  id - Root ID from which the detection must start
     *                  _keysOptional - Array with keys from `options.objects` for optimization
     *                  _usedIdsOptional - Array with yet detected devices to do not similar device under different types
     *                  ignoreIndicators - If simple indicators like "low battery", "not reachable" must be detected as device or only as a part of other device.
     *                  allowedTypes - array with names of device types, that can be detected. Not listed device types will be ignored.
     *                  excludedTypes - array with names of device types, that must be ignored. The listed device types will be ignored.
     * @returns {*|boolean|"DIR"|"FILE"|ReadonlyArray<string>}
     */
    public detect(options: DetectOptions): PatternControl[] | null {
        const objects           = options.objects;
        const id = options.id;
        let _keysOptional = options._keysOptional;
        let _usedIdsOptional= options._usedIdsOptional;
        // let ignoreIndicators  = options.ignoreIndicators;

        if (this.cache[id] !== undefined) {
            return this.cache[id];
        }

        if (!_keysOptional) {
            _keysOptional = Object.keys(objects);
            _keysOptional.sort();
            options._keysOptional = _keysOptional;
        }

        if (_usedIdsOptional) {
            _usedIdsOptional = [];
            options._usedIdsOptional = _usedIdsOptional;
        }

        const result = [];
        let detected;

        while ((detected = this._detectNext(options))) {
            result.push(detected);
        }

        this.cache[id] = result.length ? result : null;

        return this.cache[id];
    };

    public static getPatterns(): { [type: string]: PatternControl } {
        const copyPatterns: { [type: string]: PatternControl } = {};
        Object.keys(ChannelDetector.patterns).forEach(type => {
            const item = JSON.parse(JSON.stringify(ChannelDetector.patterns[type]));
            item.states.forEach((state: DetectorState | DetectorState[], i: number) => {
                let oldState = ChannelDetector.patterns[type].states[i];
                if (oldState.role) {
                    item.states[i].role = oldState.role.toString();
                }

                if (oldState.enums) {
                    // @ts-ignore
                    item.states[i].enums = true;
                    // @ts-ignore
                    item.states[i].enum = true; // it was an error and it is not used anymore, but for back compatibility it must be here
                }
            });

            copyPatterns[type] = item;
        });
        return copyPatterns;
    };
}

export default ChannelDetector;
