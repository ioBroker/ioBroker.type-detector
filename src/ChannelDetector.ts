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

import {
    DetectOptions,
    DetectorContext,
    DetectorState,
    InternalDetectorState,
    InternalPatternControl,
    PatternControl,
    StateType,
    Types,
} from './types';
import { getAllStatesInChannel, getAllStatesInDevice, getFunctionEnums, getParentId } from './RoleEnumUtils';
import { patterns } from './TypePatterns';

// Version 2.0.0, 2023.10.23
export class ChannelDetector {
    private enums: string[] | null = null;
    private cache: any;
    constructor() {
        this.cache = {};
    }

    private _applyPattern(objects: Record<string, ioBroker.Object>, id: string, statePattern: InternalDetectorState) {
        if (objects[id] && objects[id].common) {
            let role = null;
            if (statePattern.role) {
                role = statePattern.role.test(objects[id].common.role || '');

                if (role && statePattern.channelRole) {
                    const channelId = getParentId(id);
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

            if (statePattern.write !== undefined && statePattern.write !== !!objects[id].common.write) {
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
        this.enums = this.enums || getFunctionEnums(objects);
        const result: string[] = [];
        this.enums.forEach(e => {
            if (objects[e].common.members.includes(id)) {
                result.push(e);
            }
        });
        if (!result.length && objects[id] && objects[id].type === 'state') {
            let channel = getParentId(id);
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
                    result = JSON.parse(JSON.stringify(patterns[pattern]));
                    context.result = result;
                    result?.states.forEach((state, j) =>
                        ChannelDetector.copyState(patterns[pattern].states[j], state));
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
                const result = getAllStatesInDevice(keys, id);
                if (result.length) {
                    return result;
                }

                // if no states, it may be device without channels
                return getAllStatesInChannel(keys, id);

            default:
                // channel
                return getAllStatesInChannel(keys, id);
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

        for (const pattern in patterns) {
            if (
                !ChannelDetector.patternIsAllowed(
                    patterns[pattern],
                    options.allowedTypes,
                    options.excludedTypes,
                )
            ) {
                continue;
            }

            context.result = null;

            context.pattern = pattern as Types;
            context.usedInCurrentDevice = [];
            patterns[pattern].states.forEach(state => {
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
                let deviceId = getParentId(id);
                if (
                    objects[deviceId] &&
                    (objects[deviceId].type === 'channel' ||
                        objects[deviceId].type === 'device')
                ) {
                    deviceStates = getAllStatesInDevice(keys, deviceId);
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
        Object.keys(patterns).forEach(type => {
            const item = JSON.parse(JSON.stringify(patterns[type]));
            item.states.forEach((state: DetectorState | DetectorState[], i: number) => {
                let oldState = patterns[type].states[i];
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
