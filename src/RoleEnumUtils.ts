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

import type { PatternWords } from './types';

export function checkEnum(enums: string[], words: PatternWords): boolean {
    let found = false;
    if (enums) {
        enums.forEach(en => {
            const pos = en.lastIndexOf('.');
            if (pos !== -1) {
                en = en.substring(pos + 1);
            }
            for (const lang in words) {
                if (Object.prototype.hasOwnProperty.call(words, lang)) {
                    if (words[lang as 'en' | 'ru' | 'de'].find(reg => reg.test(en))) {
                        found = true;
                        return false;
                    }
                }
            }
        });
    }
    return found;
}

export function roleOrEnum(obj: ioBroker.Object, enums: string[], roles: string[], words: PatternWords): boolean {
    if (roles && obj.common.role && roles.includes(obj.common.role)) {
        return true;
    }
    return checkEnum(enums, words);
}

// -------------- LIGHT -----------------------------------------
const lightWords: PatternWords = {
    en: [/lights?/i, /lamps?/i, /ceilings?/i],
    de: [/licht(er)?/i, /lampen?/i, /beleuchtung(en)?/i],
    ru: [/свет/i, /ламп[аы]/i, /торшеры?/, /подсветк[аи]/i, /лампочк[аи]/i, /светильники?/i],
};
const lightRoles: string[] = ['switch.light', 'dimmer', 'value.dimmer', 'level.dimmer', 'sensor.light', 'state.light'];
export function roleOrEnumLight(obj: ioBroker.Object, enums: string[]): boolean {
    return roleOrEnum(obj, enums, lightRoles, lightWords);
}

// -------------- BLINDS -----------------------------------------
const blindWords: PatternWords = {
    en: [/blinds?/i, /windows?/i, /shutters?/i],
    de: [/rollladen?/i, /fenstern?/i, /beschattung(en)?/i, /jalousien?/i],
    ru: [/ставни/i, /рольставни/i, /окна|окно/, /жалюзи/i],
};

const blindRoles: string[] = [
    'blind',
    'level.blind',
    'value.blind',
    'action.stop',
    'button.stop',
    'button.stop.blind',
    'button.open.blind',
    'button.close.blind',
    'level.tilt',
    'value.tilt',
    'button.tilt.open',
    'button.tilt.close',
    'button.tilt.stop',
];
export function roleOrEnumBlind(obj: ioBroker.Object, enums: string[]): boolean {
    return roleOrEnum(obj, enums, blindRoles, blindWords);
}

// -------------- GATES ------------------------------------------
const gateWords: PatternWords = {
    en: [/gates?/i],
    de: [/^toren$/i, /^tor$/i], // "^" because of Actor
    ru: [/ворота/i],
};

const gateRoles: string[] = ['gate', 'value.gate', 'switch.gate', 'action.stop', 'button.stop'];
export function roleOrEnumGate(obj: ioBroker.Object, enums: string[]): boolean {
    return roleOrEnum(obj, enums, gateRoles, gateWords);
}

// -------------- WINDOWS -----------------------------------------
const windowRoles: string[] = ['window', 'state.window', 'sensor.window', 'value.window'];
export function roleOrEnumWindow(obj: ioBroker.Object, enums: string[]): boolean {
    return roleOrEnum(obj, enums, windowRoles, blindWords);
}

// -------------- DOORS -----------------------------------------
const doorsWords: PatternWords = {
    en: [/doors?/i, /gates?/i, /wickets?/i, /entry|entries/i],
    de: [/^türe?/i, /^tuere?/i, /^tore?$/i, /einfahrt(en)?/i, /pforten?/i], // "^" because of Actor
    ru: [/двери|дверь/i, /ворота/i, /калитка|калитки/, /въезды?/i, /входы?/i],
};

const doorsRoles: string[] = ['door', 'state.door', 'sensor.door'];
export function roleOrEnumDoor(obj: ioBroker.Object, enums: string[]): boolean {
    return roleOrEnum(obj, enums, doorsRoles, doorsWords);
}

export function getEnums(): Record<
    'door' | 'window' | 'blind' | 'gate' | 'light',
    { roles: string[]; words: { [lang: string]: RegExp[] } }
> {
    return {
        door: {
            roles: doorsRoles,
            words: doorsWords,
        },
        window: {
            roles: windowRoles,
            words: blindWords,
        },
        blind: {
            roles: blindRoles,
            words: blindWords,
        },
        gate: {
            roles: gateRoles,
            words: gateWords,
        },
        light: {
            roles: lightRoles,
            words: lightWords,
        },
    };
}

export function getAllStatesInChannel(keys: string[], channelId: string): string[] {
    const list: string[] = [];
    const reg = new RegExp(`^${channelId.replace(/([$^.)([\]{}])/g, '\\$1')}\\.[^.]+$`);
    keys.forEach(_id => reg.test(_id) && list.push(_id));
    return list;
}

export function getAllStatesInDevice(keys: string[], channelId: string): string[] {
    const list: string[] = [];
    const reg = new RegExp(`^${channelId.replace(/([$^.)([\]{}])/g, '\\$1')}\\.[^.]+\\.[^.]+$`);
    keys.forEach(_id => reg.test(_id) && list.push(_id));
    return list;
}

/**
 * Finds all objects "below" a certain ID and the ID itself. It is irrelevant how many levels deep these are
 */
export function getObjectsBelowId(sortedKeys: string[], startId: string): string[] {
    const list: string[] = [];
    startId += '.';

    // Find the starting index using binary search
    let left = 0;
    let right = sortedKeys.length - 1;
    let startIndex = -1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (sortedKeys[mid] < startId) {
            left = mid + 1;
        } else {
            startIndex = mid;
            right = mid - 1;
        }
    }

    // If no keys are >= startId, return empty array
    if (startIndex === -1 || startIndex >= sortedKeys.length) {
        return list;
    }

    // Iterate from startIndex, collecting keys that match or start with startId
    for (let i = startIndex; i < sortedKeys.length; i++) {
        const id = sortedKeys[i];
        if (id === startId || id.startsWith(startId)) {
            list.push(id);
        } else {
            // Since the keys are sorted, we can break early
            break;
        }
    }

    return list;
}

export function getFunctionEnums(objects: Record<string, ioBroker.Object>, sortedKeys: string[]): string[] {
    const enums: string[] = [];
    const reg = /^enum\.functions\./;
    const enumKeys = getObjectsBelowId(sortedKeys, 'enum');

    for (const id of enumKeys) {
        if (
            Object.prototype.hasOwnProperty.call(objects, id) &&
            reg.test(id) &&
            objects[id]?.type === 'enum' &&
            objects[id].common?.members?.length
        ) {
            enums.push(id);
        }
    }

    return enums;
}

export function getParentId(id: string): string {
    const pos = id.lastIndexOf('.');
    if (pos !== -1) {
        return id.substring(0, pos);
    }

    return id;
}
