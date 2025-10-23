/**
 * Copyright 2018-2025 bluefox <dogafox@gmail.com>
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
 */

// Make sure when you add a new entry here to also add in lib/types with the
// end user facing name for documentation
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
    illuminance = 'illuminance',
    image = 'image',
    info = 'info',
    instance = 'instance',
    light = 'light',
    location = 'location',
    locationOne = 'locationOne',
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
}

export interface InternalDetectorState {
    /** RegEx to detect role */
    role?: RegExp;

    /** RegEx to detect channel role of state */
    channelRole?: RegExp;

    /** RegEx to ignore some specific roles */
    ignoreRole?: RegExp;

    /** Is it will be shown like a small icon or as a value */
    indicator?: boolean;

    /** State type: 'number', 'string' or 'boolean' or array of possible values */
    type?: StateType | StateType[];

    /** Own TAG of the state to process it in the logic */
    name: string;

    /** If set to true or false, it will be checked the write attribute, if no attribute, so "false" will be assumed */
    write?: boolean;

    /** If set to true or false, it will be checked the write attribute, if no attribute, so "true" will be assumed */
    read?: boolean;

    /** Type of attribute: number', 'string' or 'boolean'. This attribute must exist in common */
    min?: StateType;

    /** Type of attribute: number', 'string' or 'boolean'. This attribute must exist in common */
    max?: StateType;

    /** If required to detect the pattern as valid */
    required?: boolean;

    /** No automatic subscription for this state (e.g., if write-only) */
    noSubscribe?: boolean;

    /** If this pattern should be searched in a device too and not only in channel */
    searchInParent?: boolean;

    /** Function to execute custom category detection */
    enums?: (obj: ioBroker.Object, enums: string[]) => boolean;

    /** If more than one state may have this pattern in channel */
    multiple?: boolean;

    /** Do not search indicators in a parent device */
    noDeviceDetection?: boolean;

    /** This state may belong to more than one tile simultaneously (e.g., volume tile and media with volume) */
    notSingle?: boolean;

    /** If the state of indicator must be inverted */
    inverted?: boolean;

    /** Regex for state names (IDs). Not suggested */
    stateName?: RegExp;

    /** Is irrelevant for detection, but will be used by iobroker.devices and iobroker.matter. */
    defaultStates?: { [key: string]: string };

    /**
     * It is used to enhance detection by laxing some rules if matching, else will be used by
     * iobroker.devices and iobroker.matter
     * Only states WITH defaultRole will show up in UI.
     */
    defaultRole?: string;

    /**
     * It is used to enhance detection by laxing some rules if matching, else will be used by
     * iobroker.devices and iobroker.matter.
     */
    defaultUnit?: string;

    /** Is irrelevant for detection, but will be used by iobroker.devices and iobroker.matter. */
    defaultType?: StateType;

    /** Is irrelevant for detection, but will be used by iobroker.devices and iobroker.matter. */
    defaultChannelRole?: string;

    /** If set then the unit needs to match. */
    unit?: string;

    /** If set then the object type needs to match. */
    objectType?: string;

    /**
     * If set then the regex needs to match with the last-level-state-name (the one after the
     * last ".")
     */
    state?: RegExp;
}

export interface DetectorState extends InternalDetectorState {
    original?: InternalDetectorState;
    id: string;
}
export interface ExternalDetectorState extends Omit<InternalDetectorState, 'enums' | 'role'> {
    enums?: boolean;
    role?: string;
}

export interface DetectOptions {
    /** All objects */
    objects: Record<string, ioBroker.Object>;

    /** ID to detect of state, device or channel */
    id: string;

    /** List of state names, that will be ignored. e.g., ['UNREACH_STICKY'] */
    ignoreIndicators?: string[];

    /** List of allowed types. e.g., ['slider', 'rgbSingle'] */
    allowedTypes?: Types[];

    /** List of excluded types. e.g., ['rgb', 'rgbSingle'] */
    excludedTypes?: Types[];

    /**
     * List of types that when detected also limit other types,
     * e.g. [[Types.light, Types.ct, Types.rgb, Types.rgbSingle, Types.rgbwSingle, Types.hue, Types.cie]] limits detection to one lighting type.
     */
    limitTypesToOneOf?: Types[][];

    /**
     * List of Types to prioritize before the others.
     * Example: [[Types.hue, Types.rgb], [Types.RgbSingle, Types.RGB]] moves Hue before RGB and RGBSingle also before RGB
     */
    prioritizedTypes?: [moveThisType: Types, beforeThatType: Types][];

    /**
      If true, the cache will be ignored
     */
    ignoreCache?: boolean;

    /**
     * If true, the enums will be ignored. Will be set to true automatically if allowedTypes has exactly 1 entry
     */
    ignoreEnums?: boolean;

    /**
     * If true, the usedIds will be ignored and all wanted types are detected with all available states. Only use for
     * limited object cases. It automatically excludes "info" type
     */
    detectAllPossibleDevices?: boolean;

    /**
     * Adjusts the logic to try to find a device object and consider all state in there, else a channel
     */
    detectParent?: boolean;

    /** Look only in one level above. The flag will be ignored if detectParent is set */
    detectOnlyChannel?: boolean;

    // Internally used infos and caches

    /** For optimization, it is Object.keys(objects) */
    _keysOptional?: string[];

    /** For optimization, if the provided _keysOptional are sorted */
    _keysOptionalSorted?: boolean;

    /** For optimization, initially it is empty array */
    _usedIdsOptional?: string[];

    /** For optimization, initially it is empty array */
    _checkedPatterns?: Types[];

    /** For optimization, internal list of patterns order to process */
    _patternList?: Types[];
}

export interface DetectorContext {
    objects: Record<string, ioBroker.Object>; // all objects
    channelStates: string[];
    usedIds: string[];
    usedInCurrentDevice: string[];
    ignoreIndicators: string[];
    result?: PatternControl;
    pattern: Types;
    state: InternalDetectorState;
    ignoreEnums: boolean;
    sortedKeys: string[];
    favorId?: string;
    detectAllPossibleDevices?: boolean;
}

export interface MatchedDetectorContext extends Omit<DetectorContext, 'result'> {
    result: PatternControl;
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

export interface ExternalPatternControl {
    states: ExternalDetectorState[];
    type: Types;
    enumRequired?: boolean;
}

export type PatternLanguages = 'en' | 'de' | 'ru';
export type PatternWords = Record<PatternLanguages, RegExp[]>;
