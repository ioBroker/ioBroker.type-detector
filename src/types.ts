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

export interface InternalDetectorState {
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

export interface DetectOptions {
    objects: Record<string, ioBroker.Object>; // all objects
    id: string;
    _keysOptional?: string[];      // For optimization, it is Object.keys(objects)
    _usedIdsOptional?: string[];   // For optimization, initially it is empty array
    ignoreIndicators?: string[];   // List of state names, that will be ignored. E.g., ['UNREACH_STICKY']
    allowedTypes?: Types[];        // List of allowed types. E.g., ['channel', 'device', 'state']
    excludedTypes?: Types[];        // List of excluded types. E.g., ['channel', 'device', 'state']
}

export interface DetectorContext {
    objects: Record<string, ioBroker.Object>; // all objects
    channelStates: string[];
    usedIds: string[];
    usedInCurrentDevice: string[];
    ignoreIndicators: string[];
    result: PatternControl | null;
    pattern: Types;
    state: InternalDetectorState;
}

export interface InternalPatternControl {
    states: InternalDetectorState[];
    type: Types;
    enumRequired?: boolean;
}
export interface PatternControl {
    states: DetectorState[];
    type: Types;
    enumRequired?: boolean;
}

export interface PatternWords {
    [lang: string]: RegExp[]
}
