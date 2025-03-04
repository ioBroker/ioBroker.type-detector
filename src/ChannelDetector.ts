/**
 * Copyright 2018-2024 bluefox <dogafox@gmail.com>
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

import {
    type DetectOptions,
    type DetectorContext,
    type DetectorState,
    type ExternalDetectorState,
    type ExternalPatternControl,
    type InternalDetectorState,
    type InternalPatternControl,
    type PatternControl,
    StateType,
    Types,
} from './types';
import { getAllStatesInChannel, getAllStatesInDevice, getFunctionEnums, getParentId, getEnums } from './RoleEnumUtils';
import { patterns } from './TypePatterns';

// Version 2.0.0, 2023.10.23
export class ChannelDetector {
    private enums: string[] | null = null;
    private readonly cache: Record<string, PatternControl[] | null> = {};

    public static getEnums = getEnums;

    private _applyPattern(
        objects: Record<string, ioBroker.Object>,
        id: string,
        statePattern: InternalDetectorState,
        ignoreEnums: boolean,
    ): boolean {
        if (objects[id] && objects[id].common) {
            let role = null;
            if (statePattern.role) {
                role = statePattern.role.test(objects[id].common.role || '');

                if (role && statePattern.channelRole) {
                    const channelId = getParentId(id);
                    const channelRole = objects[channelId]?.common.role || '';
                    if (
                        channelRole &&
                        (objects[channelId].type === 'channel' || objects[channelId].type === 'device')
                    ) {
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

            if (statePattern.ignoreRole) {
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

            if (
                statePattern.read !== undefined &&
                statePattern.read !== (objects[id].common.read === undefined ? true : objects[id].common.read)
            ) {
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
                if (!ignoreEnums && !statePattern.enums(objects[id], enums || [])) {
                    return false;
                }
            }

            return true;
        }
        return false;
    }

    private _getEnumsForId(objects: Record<string, ioBroker.Object>, id: string): string[] | null {
        this.enums = this.enums || getFunctionEnums(objects);
        const result: string[] = [];
        this.enums.forEach(e => {
            if (objects[e].common.members.includes(id)) {
                result.push(e);
            }
        });
        if (!result.length && objects[id] && objects[id].type === 'state') {
            const channel = getParentId(id);
            if (objects[channel] && (objects[channel].type === 'channel' || objects[channel].type === 'device')) {
                this.enums.forEach(e => {
                    if (objects[e].common.members.includes(channel)) {
                        result.push(e);
                    }
                });
            }
        }

        return result.length ? result : null;
    }

    private static copyState(oldState: InternalDetectorState, newState?: DetectorState): DetectorState {
        const _newState: DetectorState = newState || JSON.parse(JSON.stringify(oldState));
        _newState.original = (oldState as DetectorState).original || oldState;
        if ('enums' in oldState && oldState.enums) {
            _newState.enums = oldState.enums;
        }
        if ('role' in oldState && oldState.role) {
            _newState.role = oldState.role;
        }
        if ('channelRole' in oldState && oldState.channelRole) {
            _newState.channelRole = oldState.channelRole;
        }

        return _newState;
    }

    private _testOneState(context: DetectorContext): boolean {
        const objects = context.objects;
        const pattern = context.pattern;
        const state = context.state;
        const channelStates = context.channelStates;
        const usedIds = context.usedIds;
        const usedInCurrentDevice = context.usedInCurrentDevice;
        const ignoreIndicators = context.ignoreIndicators;
        const ignoreEnums = context.ignoreEnums;
        let result: PatternControl | null = context.result;
        let found = false;
        // let count = 0;

        // check every state in channel
        for (const _id of channelStates) {
            // this is only valid if no one state could be multiple
            // if (result && count >= result.states.length) {
            //     // do not look for more states as all possible found
            //     return;
            // }

            // one exception: if we already found a state with name COVER, so ignore the second one
            if (state.name === 'COVER' && result?.states.find(e => e.id && e.name === 'COVER')) {
                continue;
            }

            if (state.indicator && ignoreIndicators) {
                const parts = _id.split('.');
                const lastStateName = parts.pop() || '';

                if (lastStateName && ignoreIndicators.includes(lastStateName)) {
                    // console.log(`${_id} ignored`);
                    continue;
                }
            }

            if (
                (state.indicator ||
                    (!usedInCurrentDevice.includes(_id) && // not used in a current device and pattern
                        (state.notSingle || !usedIds.includes(_id)))) && // or not used globally
                this._applyPattern(objects, _id, state, ignoreEnums)
            ) {
                if (!state.indicator) {
                    usedInCurrentDevice.push(_id);
                }
                // we detected a state, copy InternalPatternControl
                if (!result) {
                    result = JSON.parse(JSON.stringify(patterns[pattern]));
                    context.result = result;
                    result?.states.forEach((state, j) => ChannelDetector.copyState(patterns[pattern].states[j], state));
                }

                if (result) {
                    // if this ID is not yet in the list
                    if (!result.states.find(e => e.id === _id)) {
                        let _found = false;
                        for (let u = 0; u < result.states.length; u++) {
                            if (result.states[u].name === state.name) {
                                // count++;
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
                            if (
                                (state.indicator ||
                                    (!usedInCurrentDevice.includes(cid) &&
                                        (state.notSingle || !usedIds.includes(cid)))) &&
                                this._applyPattern(objects, cid, state, ignoreEnums)
                            ) {
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
        }
        return found;
    }

    private static getChannelStates(objects: Record<string, ioBroker.Object>, id: string, keys: string[]): string[] {
        switch (objects[id].type) {
            case 'chart':
            case 'state':
                return [id];

            case 'device': {
                // get states device->channel->state
                const deviceStates = getAllStatesInDevice(keys, id);
                // get states device->state
                const channelStates = getAllStatesInChannel(keys, id);
                return deviceStates.concat(channelStates);
            }

            default:
                // channel
                return getAllStatesInChannel(keys, id);
        }
    }

    private static patternIsAllowed(
        pattern: InternalPatternControl,
        allowedTypes: Types[] | undefined,
        excludedTypes: Types[] | undefined,
    ): boolean {
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
        }
        if (allowedTypes && !allowedTypes.includes(pattern.type)) {
            return false;
        }

        return !excludedTypes || !excludedTypes.includes(pattern.type);
    }

    private static allRequiredStatesFound(context: DetectorContext): boolean {
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

    private static cleanState(state: DetectorState, objects: Record<string, ioBroker.Object>): void {
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
        const id = options.id;
        const keys = options._keysOptional || [];
        let usedIds = options._usedIdsOptional || [];
        const ignoreIndicators = options.ignoreIndicators;

        if (!usedIds) {
            usedIds = [];
            options._usedIdsOptional = usedIds;
        }

        if (!objects[id] || !objects[id].common) {
            return null;
        }
        if (options._checkedPatterns === undefined) {
            options._checkedPatterns = [];
        }

        const context: DetectorContext = {
            objects,
            channelStates: ChannelDetector.getChannelStates(objects, id, keys || []),
            usedIds,
            ignoreIndicators: ignoreIndicators || [],
            result: null,
            pattern: Types.unknown,
            usedInCurrentDevice: [],
            state: {} as InternalDetectorState,
            ignoreEnums: !!options.ignoreEnums,
        };

        for (const pattern in patterns) {
            if (
                options._checkedPatterns.includes(pattern as Types) ||
                !ChannelDetector.patternIsAllowed(patterns[pattern], options.allowedTypes, options.excludedTypes)
            ) {
                continue;
            }
            options._checkedPatterns.push(pattern as Types);

            context.result = null;

            context.pattern = pattern as Types;
            context.usedInCurrentDevice = [];
            for (const state of patterns[pattern].states) {
                let found = false;

                // one of the following
                context.state = state;
                if (this._testOneState(context)) {
                    found = true;
                }
                if (state.required && !found) {
                    context.result = null;
                    break;
                }
            }

            if (!ChannelDetector.allRequiredStatesFound(context)) {
                continue;
            }

            context.usedInCurrentDevice.forEach(id => usedIds.push(id));

            let deviceStates;

            // looking for indicators and special states
            if (objects[id].type !== 'device') {
                // get device name
                const deviceId = getParentId(id);
                if (
                    objects[deviceId] &&
                    (objects[deviceId].type === 'channel' || objects[deviceId].type === 'device')
                ) {
                    deviceStates = getAllStatesInDevice(keys, deviceId);
                    deviceStates?.forEach(_id => {
                        context.result?.states.forEach((state, i) => {
                            if (!state.id && (state.indicator || state.searchInParent) && !state.noDeviceDetection) {
                                if (
                                    this._applyPattern(
                                        objects,
                                        _id,
                                        state.original as InternalDetectorState,
                                        !!options.ignoreEnums,
                                    ) &&
                                    context.result
                                ) {
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
                    result.states.forEach((state: DetectorState) => ChannelDetector.cleanState(state, context.objects));
                }
            }

            return context.result;
        }

        return null;
    }

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
     */
    public detect(options: DetectOptions): PatternControl[] | null {
        const objects = options.objects;
        const id = options.id;
        let _keysOptional = options._keysOptional;
        let _usedIdsOptional = options._usedIdsOptional;
        // let ignoreIndicators  = options.ignoreIndicators;

        if (!options.ignoreCache && this.cache[id]) {
            // We validate if the cache matches the requirements and if not skip the cache
            if (!options.allowedTypes && !options.excludedTypes) {
                return this.cache[id];
            }
            const allowedTypes = options.allowedTypes ?? [];
            const excludedTypes = options.excludedTypes ?? [];
            const result = this.cache[id].filter(
                ({ type }) => allowedTypes.includes(type) && !excludedTypes.includes(type),
            );
            if (result.length) {
                return result;
            }
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

        // When we do want to detect a special device type we can ignore enums
        if (options.ignoreEnums === undefined && options.allowedTypes && options.allowedTypes.length === 1) {
            options.ignoreEnums = true;
        }
        if (options.detectAllPossibleDevices) {
            options.excludedTypes = options.excludedTypes || [];
            if (!options.excludedTypes.includes(Types.info)) {
                options.excludedTypes.push(Types.info);
            }
        }
        options._checkedPatterns = [];

        const result = [];
        let detected;

        while ((detected = this._detectNext(options))) {
            result.push(detected);
            if (options.detectAllPossibleDevices) {
                options._usedIdsOptional = [];
            }
        }

        this.cache[id] = result.length ? result : null;

        return this.cache[id];
    }

    public static getPatterns(): { [type: string]: ExternalPatternControl } {
        const copyPatterns: { [type: string]: ExternalPatternControl } = {};

        Object.keys(patterns).forEach(type => {
            const item: ExternalPatternControl = JSON.parse(JSON.stringify(patterns[type]));
            item.states.forEach((_state: ExternalDetectorState | ExternalDetectorState[], i: number) => {
                const oldState = patterns[type].states[i];
                if (oldState.role) {
                    item.states[i].role = oldState.role.toString();
                }

                if (oldState.enums) {
                    item.states[i].enums = true;
                }
            });

            copyPatterns[type] = item;
        });
        return copyPatterns;
    }
}
