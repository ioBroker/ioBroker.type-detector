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

import { StateType, Types, InternalDetectorState, InternalPatternControl } from './types';
import { roleOrEnumBlind, roleOrEnumDoor, roleOrEnumGate, roleOrEnumLight, roleOrEnumWindow } from './RoleEnumUtils';

const SharedPatterns: { [id: string]: InternalDetectorState } = {
    working:   {role: /^indicator\.working$/,                 indicator: true,                    notSingle: true, name: 'WORKING',   required: false, defaultRole: 'indicator.working', defaultType: StateType.Boolean},
    unreach:   {role: /^indicator(\.maintenance)?\.unreach$/, indicator: true,  type: StateType.Boolean,  notSingle: true, name: 'UNREACH',   required: false, defaultRole: 'indicator.maintenance.unreach'},
    lowbat:    {role: /^indicator(\.maintenance)?\.lowbat$|^indicator(\.maintenance)?\.battery$/, indicator: true,  type: StateType.Boolean, notSingle: true, name: 'LOWBAT', required: false, defaultRole: 'indicator.maintenance.lowbat'},
    maintain:  {role: /^indicator\.maintenance$/,             indicator: true,  type: StateType.Boolean,  notSingle: true, name: 'MAINTAIN',  required: false, defaultRole: 'indicator.maintenance'},
    error:     {role: /^indicator\.error$/,                   indicator: true,                    notSingle: true, name: 'ERROR',     required: false, defaultRole: 'indicator.error', defaultType: StateType.String},
    direction: {role: /^indicator\.direction$/,               indicator: true,                    notSingle: true, name: 'DIRECTION', required: false, defaultRole: 'indicator.direction'},
    reachable: {role: /^indicator\.reachable$/,               indicator: true,  type: StateType.Boolean,  notSingle: true, name: 'CONNECTED', required: false, defaultRole: 'indicator.reachable', inverted: true},
};

export const patterns: { [key: string]: InternalPatternControl } = {
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
            {role: /^level(\.blind)?$/,                       indicator: false, type: StateType.Number,  write: true, enums: roleOrEnumBlind, name: 'SET',                 required: true, defaultRole: 'level.blind', defaultUnit: '%'},
            // optional
            {role: /^value(\.blind)?$/,                       indicator: false, type: StateType.Number,               enums: roleOrEnumBlind, name: 'ACTUAL',              required: false, defaultRole: 'value.blind', defaultUnit: '%'},
            {role: /^button\.stop(\.blind)?$|^action\.stop$/, indicator: false, type: StateType.Boolean, write: true, enums: roleOrEnumBlind, name: 'STOP',                required: false, noSubscribe: true, defaultRole: 'button.stop.blind'},
            {role: /^button\.open(\.blind)?$/,                indicator: false, type: StateType.Boolean, write: true, enums: roleOrEnumBlind, name: 'OPEN',                required: false, noSubscribe: true, defaultRole: 'button.open.blind'},
            {role: /^button\.close(\.blind)?$/,               indicator: false, type: StateType.Boolean, write: true, enums: roleOrEnumBlind, name: 'CLOSE',               required: false, noSubscribe: true, defaultRole: 'button.close.blind'},
            {role: /^level(\.open)?\.tilt$/,                  indicator: false, type: StateType.Number,  write: true, enums: roleOrEnumBlind, name: 'TILT_SET',            required: false, defaultRole: 'level.tilt'},
            {role: /^value(\.open)?\.tilt$/,                  indicator: false, type: StateType.Number,               enums: roleOrEnumBlind, name: 'TILT_ACTUAL',         required: false, defaultRole: 'value.tilt'},
            {role: /^button\.stop\.tilt$/,                    indicator: false, type: StateType.Boolean, write: true, enums: roleOrEnumBlind, name: 'TILT_STOP',           required: false, noSubscribe: true, defaultRole: 'button.stop.tilt'},
            {role: /^button\.open\.tilt$/,                    indicator: false, type: StateType.Boolean, write: true, enums: roleOrEnumBlind, name: 'TILT_OPEN',           required: false, noSubscribe: true, defaultRole: 'button.open.tilt'},
            {role: /^button\.close\.tilt$/,                   indicator: false, type: StateType.Boolean, write: true, enums: roleOrEnumBlind, name: 'TILT_CLOSE',          required: false, noSubscribe: true, defaultRole: 'button.close.tilt'},
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
            {role: /^button\.stop(\.blind)?$|^action\.stop$/, indicator: false, type: StateType.Boolean, write: true, enums: roleOrEnumBlind, name: 'STOP',                required: true,  noSubscribe: true, defaultRole: 'button.stop.blind'},
            {role: /^button\.open(\.blind)?$/,                indicator: false, type: StateType.Boolean, write: true, enums: roleOrEnumBlind, name: 'OPEN',                required: true,  noSubscribe: true, defaultRole: 'button.open.blind'},
            {role: /^button\.close(\.blind)?$/,               indicator: false, type: StateType.Boolean, write: true, enums: roleOrEnumBlind, name: 'CLOSE',               required: true,  noSubscribe: true, defaultRole: 'button.close.blind'},
            //optional tilt:
            {role: /^level\.tilt$/,                           indicator: false, type: StateType.Number,  write: true, enums: roleOrEnumBlind, name: 'TILT_SET',            required: false, defaultRole: 'level.tilt'},
            {role: /^value\.tilt$/,                           indicator: false, type: StateType.Number,               enums: roleOrEnumBlind, name: 'TILT_ACTUAL',         required: false, defaultRole: 'value.tilt'},
            {role: /^button\.stop\.tilt$/,                    indicator: false, type: StateType.Boolean, write: true, enums: roleOrEnumBlind, name: 'TILT_STOP',           required: false, noSubscribe: true, defaultRole: 'button.stop.tilt'},
            {role: /^button\.open\.tilt$/,                    indicator: false, type: StateType.Boolean, write: true, enums: roleOrEnumBlind, name: 'TILT_OPEN',           required: false, noSubscribe: true, defaultRole: 'button.open.tilt'},
            {role: /^button\.close\.tilt$/,                   indicator: false, type: StateType.Boolean, write: true, enums: roleOrEnumBlind, name: 'TILT_CLOSE',          required: false, noSubscribe: true, defaultRole: 'button.close.tilt'},
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
            {role: /^switch(\.gate)?$/,                   indicator: false, type: StateType.Boolean,  write: true, enums: roleOrEnumGate, name: 'SET',                 required: true, defaultRole: 'switch.gate'},
            // optional
            {role: /^value(\.position)?|^value(\.gate)?$/,indicator: false, type: StateType.Number,                enums: roleOrEnumGate,  name: 'ACTUAL',             required: false, defaultRole: 'value.blind', defaultUnit: '%'},
            {role: /^button\.stop$|^action\.stop$/,       indicator: false, type: StateType.Boolean, write: true,  enums: roleOrEnumGate,  name: 'STOP',               required: false, noSubscribe: true, defaultRole: 'button.stop'},
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
            {role: /^state(\.window)?$|^sensor(\.window)?/,                   indicator: false, type: StateType.Boolean, enums: roleOrEnumWindow, name: 'ACTUAL',     required: true, defaultRole: 'sensor.window'},
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
            {role: /^state?$|^value(\.window)?$/,                             indicator: false, type: StateType.Number,  enums: roleOrEnumWindow, name: 'ACTUAL',     required: true, defaultRole: 'value.window'},
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
            {role: /^state?$|^state(\.door)?$|^sensor(\.door)?/,              indicator: false, type: StateType.Boolean, write: false, enums: roleOrEnumDoor, name: 'ACTUAL',     required: true, defaultRole: 'sensor.door'},
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
            {role: /^level(\.dimmer)?$|^level\.brightness$/, indicator: false, type: StateType.Number,  write: true,       enums: roleOrEnumLight, name: 'SET',        required: true, defaultRole: 'level.dimmer', ignoreRole: /^level\.dimspeed$/, defaultUnit: '%'},
            // optional
            {role: /^value(\.dimmer)?$/,                     indicator: false, type: StateType.Number,  write: false,      enums: roleOrEnumLight, name: 'ACTUAL',      required: false, defaultRole: 'value.dimmer', defaultUnit: '%'},
            {role: /^switch(\.light)?$|^state$/,             indicator: false, type: StateType.Boolean, write: true,       enums: roleOrEnumLight, name: 'ON_SET',      required: false, defaultRole: 'switch.light'},
            {role: /^(state|switch|sensor)\.light|switch$/,  indicator: false, type: StateType.Boolean, write: false,      enums: roleOrEnumLight, name: 'ON_ACTUAL',   required: false, defaultRole: 'sensor.light'},
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
            {role: /^switch(\.light)?$|^state$/,           indicator: false, type: StateType.Boolean, write: true,  name: 'SET',         required: true,  defaultRole: 'switch.light'},
            // optional
            {role: /^(state|switch|sensor)\.light|switch$/, indicator: false, type: StateType.Boolean, write: false,      enums: roleOrEnumLight, name: 'ON_ACTUAL',      required: false, defaultRole: 'sensor.light'},
            {role: /^value\.power$/,                        indicator: false, type: StateType.Number,  write: false,      enums: roleOrEnumLight, name: 'ELECTRIC_POWER', required: false, defaultRole: 'value.power', defaultUnit: 'W'},
            {role: /^value\.current$/,                      indicator: false, type: StateType.Number,  write: false,      enums: roleOrEnumLight, name: 'CURRENT',        required: false, defaultRole: 'value.current', defaultUnit: 'mA'},
            {role: /^value\.voltage$/,                      indicator: false, type: StateType.Number,  write: false,      enums: roleOrEnumLight, name: 'VOLTAGE',        required: false, defaultRole: 'value.voltage', defaultUnit: 'V'},
            {role: /^value\.power\.consumption$/,           indicator: false, type: StateType.Number,  write: false,      enums: roleOrEnumLight, name: 'CONSUMPTION',    required: false, defaultRole: 'value.power.consumption', defaultUnit: 'Wh'},
            {role: /^value\.frequency$/,                    indicator: false, type: StateType.Number,  write: false,      enums: roleOrEnumLight, name: 'FREQUENCY',      required: false, defaultRole: 'value.frequency', defaultUnit: 'Hz'},
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
