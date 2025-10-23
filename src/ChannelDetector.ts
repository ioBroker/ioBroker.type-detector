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

import {
    type DetectOptions,
    type DetectorContext,
    type DetectorState,
    type ExternalDetectorState,
    type ExternalPatternControl,
    type InternalDetectorState,
    type InternalPatternControl,
    type PatternControl,
    type MatchedDetectorContext,
    StateType,
    Types,
} from './types';
import { getFunctionEnums, getParentId, getEnums, getObjectsBelowId } from './roleEnumUtils';
import { patterns } from './typePatterns';

export class ChannelDetector {
    private enums: string[] | null = null;
    private readonly cache: Record<string, PatternControl[] | null> = {};

    public static getEnums = getEnums;

    private _applyPattern(
        objects: Record<string, ioBroker.Object>,
        id: string,
        statePattern: InternalDetectorState,
        ignoreEnums: boolean,
        sortedKeys: string[],
    ): boolean {
        if (objects[id]?.common) {
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

            if (statePattern.type) {
                if (typeof statePattern.type === 'string') {
                    if (statePattern.type !== objects[id].common.type) {
                        return false;
                    }
                } else if (Array.isArray(statePattern.type)) {
                    let oneMatched = false;
                    for (let t = 0; t < statePattern.type.length; t++) {
                        if (statePattern.type[t] === objects[id].common.type) {
                            oneMatched = true;
                            break;
                        }
                    }
                    if (!oneMatched) {
                        return false;
                    }
                }
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

            const defaultRoleAssigned =
                statePattern.defaultRole && objects[id].common.role === statePattern.defaultRole;

            const defaultUnitAssigned = statePattern.defaultUnit
                ? objects[id].common.unit === statePattern.defaultUnit
                : false;

            if (statePattern.min === StateType.Number && typeof objects[id].common.min !== StateType.Number) {
                // If we have a default unit, and it matches and is % allow bypassing min/max because
                // defined as 0..100 anyway
                if (!defaultUnitAssigned || objects[id].common.unit !== '%') {
                    return false;
                }
            }

            if (statePattern.max === StateType.Number && typeof objects[id].common.max !== StateType.Number) {
                // If we have a default unit, and it matches and is % allow bypassing min/max because
                // defined as 0..100 anyway
                if (!defaultUnitAssigned || objects[id].common.unit !== '%') {
                    return false;
                }
            }

            // When the default role is assigned, then the users should know how to handle it,
            // so we can be a bit more laxe if read/write is not set correctly because the user
            // created it manually. Additionally, enum check should be not needed with default role because the role already
            // includes that.

            // But otherwise, check more detailed and also the enums
            if (!defaultRoleAssigned) {
                if (statePattern.write !== undefined && statePattern.write !== !!objects[id].common.write) {
                    return false;
                }

                if (
                    statePattern.read !== undefined &&
                    statePattern.read !== (objects[id].common.read === undefined ? true : objects[id].common.read)
                ) {
                    return false;
                }

                if (typeof statePattern.enums === 'function') {
                    const enums = this._getEnumsForId(objects, id, sortedKeys);
                    if (!ignoreEnums && !statePattern.enums(objects[id], enums || [])) {
                        return false;
                    }
                }
            }

            return true;
        }
        return false;
    }

    private _getEnumsForId(
        objects: Record<string, ioBroker.Object>,
        id: string,
        sortedKeys: string[],
    ): string[] | null {
        this.enums ||= getFunctionEnums(objects, sortedKeys);
        const result: string[] = [];

        this.enums.forEach(e => {
            if (objects[e].common.members.includes(id)) {
                result.push(e);
            }
        });

        if (!result.length && objects[id]?.type === 'state') {
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
        const sortedKeys = context.sortedKeys;
        let result = context.result;
        let found = false;
        // let count = 0;

        // check every state in a channel
        for (const stateId of channelStates) {
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
                const parts = stateId.split('.');
                const lastStateName = parts.pop() || '';

                if (lastStateName && ignoreIndicators.includes(lastStateName)) {
                    // console.log(`${stateId} ignored`);
                    continue;
                }
            }

            if (state.indicator) {
                // We always detect indicators even if one used for multiple devices
            } else if (usedInCurrentDevice.includes(stateId)) {
                // we already used this state in the current device
                continue;
            } else if (state.notSingle) {
                // we already used this state in another device but notSingle is set
            } else if (context.detectAllPossibleDevices) {
                // No matter if used before, we want all possible devices
            } else if (usedIds.includes(stateId)) {
                // we already used this state in another device
                continue;
            }

            if (this._applyPattern(objects, stateId, state, ignoreEnums, sortedKeys)) {
                // we detected a state, copy InternalPatternControl
                if (!result) {
                    result = JSON.parse(JSON.stringify(patterns[pattern])) as PatternControl; // can not be undefined here
                    context.result = result;
                    result?.states.forEach((state, j) => ChannelDetector.copyState(patterns[pattern].states[j], state));
                }

                // map the detected ID to the relevant state in result - if allowed
                if (!result.states.find(({ id }) => id === stateId)) {
                    for (const checkState of result.states) {
                        if (checkState.name === state.name) {
                            // If we already have a mapped ID, we need to decide if we keep this ID or overrule it
                            if (checkState.id) {
                                let useThisMapping: boolean | undefined; // three-state flag

                                // Check if the favored state ID matches one of the available states, then this wins
                                if (context.favorId) {
                                    if (stateId === context.favorId) {
                                        useThisMapping = true;
                                    } else if (checkState.id === context.favorId) {
                                        useThisMapping = false;
                                    }
                                }

                                const existingIdRole = objects[checkState.id]?.common?.role ?? '';
                                const stateIdRole = objects[stateId]?.common?.role ?? '';
                                const defaultRole = checkState.defaultRole;
                                if (defaultRole && useThisMapping === undefined) {
                                    // Check if the defaultRole is matching to any of the available states, then this wins
                                    if (stateIdRole === defaultRole) {
                                        useThisMapping = true;
                                    } else if (existingIdRole === defaultRole) {
                                        useThisMapping = false;
                                    }
                                }
                                if (useThisMapping === undefined) {
                                    // If one of the roles uses state as first level or is empty, then the other one is better.
                                    // If both are not "state" then check how many levels the roles have, the more, the better.
                                    // If same then not having "state" as first level will override the id, else not
                                    const stateIdRoleLevels = stateIdRole.split('.');
                                    const stateIdRoleLevelsCount = stateIdRoleLevels.length;
                                    const existingIdRoleLevels = existingIdRole.split('.');
                                    const existingIdRoleLevelsCount = existingIdRoleLevels.length;
                                    if (stateIdRole === '') {
                                        useThisMapping = false;
                                    } else if (
                                        stateIdRoleLevels[0] === 'state' &&
                                        existingIdRoleLevels[0] !== 'state'
                                    ) {
                                        useThisMapping = false;
                                    } else if (
                                        stateIdRoleLevels[0] !== 'state' &&
                                        existingIdRoleLevels[0] === 'state'
                                    ) {
                                        useThisMapping = true;
                                    } else if (stateIdRoleLevelsCount > existingIdRoleLevelsCount) {
                                        useThisMapping = true;
                                    } else if (stateIdRoleLevelsCount < existingIdRoleLevelsCount) {
                                        useThisMapping = false;
                                    } else {
                                        useThisMapping = stateIdRoleLevels[0] !== 'state';
                                    }
                                }

                                // We ignore the found mapping, because it's better than the current one
                                if (!useThisMapping) {
                                    break;
                                }
                            }

                            // count++;
                            checkState.id = stateId;
                            found = true;
                            break;
                        }
                    }
                } else {
                    found = true; // Was there before already?
                }

                if (found) {
                    if (!state.indicator) {
                        usedInCurrentDevice.push(stateId);
                    }

                    if (state.multiple && channelStates.length > 1) {
                        // execute this rule for every state in this channel
                        for (const cid of channelStates) {
                            if (cid === stateId) {
                                continue;
                            }
                            if (
                                (state.indicator ||
                                    (!usedInCurrentDevice.includes(cid) &&
                                        (state.notSingle || !usedIds.includes(cid)))) &&
                                this._applyPattern(objects, cid, state, ignoreEnums, sortedKeys)
                            ) {
                                if (!state.indicator) {
                                    usedInCurrentDevice.push(cid);
                                }
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
                    }
                }
            }
        }
        return found;
    }

    /**
     * Tries to find a device or channel (as fallback) where the state is in
     */
    private static findParentChannelOrDevice(
        objects: Record<string, ioBroker.Object>,
        id: string,
        onlyChannel?: boolean,
    ): string | undefined {
        if (!objects[id]) {
            // Object does not exist
            return;
        }
        const parts = id.split('.');
        const origId = id;

        if (objects[id].type === 'state') {
            // a state needs to be in a channel, device, folder or such, so check the level above
            parts.pop();
            id = parts.join('.');
        }
        if (parts.length <= 2) {
            // Ok, we already reached the instance level, no need to search higher, then we go with this id
            return id;
        }

        const obj = objects[id];
        if (obj?.type === 'device' || (onlyChannel && obj?.type === 'channel')) {
            // We found a device object, use this
            return id;
        }
        if (onlyChannel) {
            return undefined;
        }
        parts.pop();
        const upperLevelObjectId = parts.join('.');
        const upperObj = objects[upperLevelObjectId];
        if (!upperObj) {
            // Ok not existing object, so we use the existing object from before
            return obj ? id : origId;
        }
        if (upperObj.type === 'device' || parts.length <= 2) {
            // We found a device object, or ended already on instance level, use this
            return upperLevelObjectId;
        }
        if (obj?.type === 'channel') {
            // The object is (or inside) a channel, but above is no device, so lets better use the channel
            return id;
        }

        // When we come here the state.parent or state.parent.parent is no device or channel, and we are not already on top
        // So lets gibe it one more last chance to find something
        parts.pop();
        const secondUpperLevelObjectId = parts.join('.');
        const secondUpperObj = objects[secondUpperLevelObjectId];
        if (!secondUpperObj || (secondUpperObj.type !== 'device' && secondUpperObj.type !== 'channel')) {
            // Ok not existing object or no channel/device, so we use the existing object from before
            return upperLevelObjectId;
        }
        return secondUpperLevelObjectId;
    }

    private static getChannelOrDeviceStates(
        objects: Record<string, ioBroker.Object>,
        id: string,
        keys: string[],
        checkParent = false,
        checkOnlyInSameChannel = false,
    ): string[] {
        const type = objects[id]?.type;
        switch (type) {
            case undefined:
                return [...getObjectsBelowId(keys, id)];
            case 'state':
            case 'channel':
            case 'device':
            case 'folder':
                if (checkParent && type !== 'device') {
                    const foundId = ChannelDetector.findParentChannelOrDevice(objects, id);

                    return foundId && foundId !== id ? [...getObjectsBelowId(keys, foundId)] : [id];
                }
                if (type !== 'state') {
                    return [...getObjectsBelowId(keys, id)];
                } else if (checkOnlyInSameChannel) {
                    const foundId = ChannelDetector.findParentChannelOrDevice(objects, id, true);
                    return foundId && foundId !== id ? [...getObjectsBelowId(keys, foundId)] : [id];
                }
                return [id];

            default:
                return [id];
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

    private static allRequiredStatesFound(context: DetectorContext): context is MatchedDetectorContext {
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

    /** Sorts the list of Type patterns using the definition of the prioritized ones */
    private sortTypes(typeList: Types[], prioritizedTypes: [moveThisType: Types, beforeThatType: Types][]): Types[] {
        prioritizedTypes.forEach(([moveThisType, beforeThatType]) => {
            const fromIndex = typeList.indexOf(moveThisType);
            const toIndex = typeList.indexOf(beforeThatType);
            if (fromIndex === -1 || toIndex === -1) {
                return;
            }
            const fromType = typeList.splice(fromIndex, 1);
            typeList.splice(toIndex, 0, ...fromType);
        });

        return typeList;
    }

    private _detectNext(options: DetectOptions): PatternControl | null {
        const {
            objects,
            id,
            _usedIdsOptional: usedIds = [],
            ignoreIndicators,
            prioritizedTypes,
            detectParent,
            detectOnlyChannel,
            allowedTypes,
            excludedTypes,
            _keysOptional, // sorted keys
            detectAllPossibleDevices,
        } = options;
        let { _patternList } = options;

        options._usedIdsOptional = usedIds;

        const channelStates = ChannelDetector.getChannelOrDeviceStates(
            objects,
            id,
            _keysOptional || [],
            detectParent,
            detectOnlyChannel,
        );

        // We have no ID for that object and also no objects below, so skip it
        if (!objects[id]?.common && !channelStates.length) {
            return null;
        }
        options._checkedPatterns ??= [];

        if (!_patternList) {
            const allPatterns = Object.keys(patterns).filter(pattern =>
                ChannelDetector.patternIsAllowed(patterns[pattern], allowedTypes, excludedTypes),
            ) as Types[];
            _patternList = prioritizedTypes ? this.sortTypes(allPatterns, prioritizedTypes) : allPatterns;
            options._patternList = _patternList;
        }

        const context: DetectorContext = {
            objects,
            channelStates,
            usedIds,
            ignoreIndicators: ignoreIndicators || [],
            pattern: Types.unknown,
            usedInCurrentDevice: [],
            state: {} as InternalDetectorState,
            ignoreEnums: !!options.ignoreEnums,
            sortedKeys: _keysOptional!,
            favorId: options.detectParent ? undefined : id,
            detectAllPossibleDevices,
        };

        const currentType = objects[id]?.type;
        for (const pattern of _patternList) {
            if (options._checkedPatterns.includes(pattern)) {
                continue;
            }
            options._checkedPatterns.push(pattern);

            // reset the result
            delete context.result;

            context.pattern = pattern;
            context.usedInCurrentDevice = [];
            for (const state of patterns[pattern].states) {
                let found = false;

                // one of the following
                context.state = state;
                if (this._testOneState(context)) {
                    found = true;
                }
                if (state.required && !found) {
                    delete context.result;
                    break;
                }
            }

            if (!ChannelDetector.allRequiredStatesFound(context)) {
                continue;
            }

            // Store all used IDs in the array
            context.usedInCurrentDevice.forEach(id => usedIds.push(id));

            let deviceStates: string[];

            // looking for indicators and special states
            if (currentType !== 'device') {
                // get device name
                const deviceId = ChannelDetector.findParentChannelOrDevice(objects, id) ?? id;
                if (
                    objects[deviceId] &&
                    (objects[deviceId].type === 'channel' || objects[deviceId].type === 'device')
                ) {
                    deviceStates = getObjectsBelowId(_keysOptional!, deviceId);
                    for (const _id of deviceStates) {
                        context.result.states.forEach((state, i) => {
                            if (!state.id && (state.indicator || state.searchInParent) && !state.noDeviceDetection) {
                                if (
                                    this._applyPattern(
                                        objects,
                                        _id,
                                        state.original as InternalDetectorState,
                                        !!options.ignoreEnums,
                                        context.sortedKeys,
                                    ) &&
                                    context.result
                                ) {
                                    context.result.states[i].id = _id;
                                }
                            }
                        });
                    }
                }
            }

            context.result.states.forEach((state: DetectorState) => ChannelDetector.cleanState(state, context.objects));

            // Check if the detected type should be limited to a set of types and also declare the others as checked
            if (options.limitTypesToOneOf) {
                for (const types of options.limitTypesToOneOf) {
                    if (types.includes(pattern)) {
                        for (const type of types) {
                            if (type === pattern || options._checkedPatterns.includes(type)) {
                                continue;
                            }
                            options._checkedPatterns.push(type);
                        }
                    }
                }
            }

            return context.result;
        }

        return null;
    }

    /**
     * Detect devices in some given path. Path can show to state, channel or device.
     *
     * @param options - parameters with following fields
     *                  objects - Object, that has all objects in form {'id1': {obj1params...}, 'id2': {obj2params...}}
     *                  id - Root ID from which the detection must start
     *                  _keysOptional - Array with (sorted) keys from `options.objects` for optimization
     *                  _keysOptionalSorted - indicates if `_keysOptional` is sorted (for optimization)
     *                  _usedIdsOptional - Array with yet detected devices to do not similar device under different types
     *                  ignoreIndicators - If simple indicators like "low battery", "not reachable" must be detected as device or only as a part of other device.
     *                  allowedTypes - array with names of device types that can be detected. Not listed device types will be ignored.
     *                  excludedTypes - array with names of device types that must be ignored. The listed device types will be ignored.
     *                  prioritizedTypes - List of Types to prioritize before the others.
     */
    public detect(options: DetectOptions): PatternControl[] | null {
        const { objects, id, ignoreCache, detectAllPossibleDevices } = options;
        let { _keysOptional, _usedIdsOptional } = options;

        if (!ignoreCache && this.cache[id]) {
            // We validate if the cache matches the requirements and if not skip the cache
            const { allowedTypes = [], excludedTypes = [] } = options;
            if (!allowedTypes.length && !excludedTypes.length) {
                return this.cache[id];
            }
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
        } else if (!options._keysOptionalSorted) {
            _keysOptional.sort();
        }

        // We reset the already used IDs normally for better detection but not when we used parent to detect
        // because then we have already checked a whole "subtree" for the best matching results and so can exclude the
        // matched ids
        if (_usedIdsOptional && !options.detectParent) {
            _usedIdsOptional = [];
            options._usedIdsOptional = _usedIdsOptional;
        }

        // When we do want to detect a special device type, we can ignore enums
        if (options.ignoreEnums === undefined && options.allowedTypes?.length === 1) {
            options.ignoreEnums = true;
        }
        if (detectAllPossibleDevices) {
            options.excludedTypes ||= [];
            if (!options.excludedTypes.includes(Types.info)) {
                options.excludedTypes.push(Types.info);
            }
        }
        options._checkedPatterns = [];

        const result: PatternControl[] = [];
        let detected;

        while ((detected = this._detectNext(options))) {
            result.push(detected);
            if (options.detectAllPossibleDevices) {
                options._usedIdsOptional = [];
            }
        }

        // We must place the devices which have initial ID on required place on the first places
        // Then the controls with maximal amount of matched states
        result.sort((a, b) => {
            // place info on tha last place
            if (a.type === Types.info && b.type !== Types.info) {
                return 1;
            }
            if (b.type === Types.info && a.type !== Types.info) {
                return -1;
            }

            const aHasRequiredId = a.states.find(s => s.id === id && s.required) ? 1 : 0;
            const bHasRequiredId = b.states.find(s => s.id === id && s.required) ? 1 : 0;
            if (aHasRequiredId !== bHasRequiredId) {
                return bHasRequiredId - aHasRequiredId;
            }
            if (!aHasRequiredId) {
                const aHasId = a.states.find(s => s.id === id) ? 1 : 0;
                const bHasId = b.states.find(s => s.id === id) ? 1 : 0;
                if (aHasId !== bHasId) {
                    return bHasId - aHasId;
                }
            }

            const aCount = a.states.filter(s => s.id).length;
            const bCount = b.states.filter(s => s.id).length;
            return bCount - aCount;
        });

        this.cache[id] = result.length ? result : null;

        return this.cache[id];
    }

    /**
     * Returns all the known by type-detector type patterns
     */
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
