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

import { PatternWords } from './types';

export function checkEnum(enums: string[], words: PatternWords): boolean {
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

export function roleOrEnum(
    obj: ioBroker.Object,
    enums: string[],
    roles: string[],
    words: PatternWords
): boolean {
    if (roles && obj.common.role && roles.includes(obj.common.role)) {
        return true;
    }
    return checkEnum(enums, words);
}

// -------------- LIGHT -----------------------------------------
const lightWords: PatternWords = {
    en: [/lights?/i, /lamps?/i, /ceilings?/i],
    de: [/licht(er)?/i, /lampen?/i, /beleuchtung(en)?/i],
    ru: [
        /свет/i,
        /ламп[аы]/i,
        /торшеры?/,
        /подсветк[аи]/i,
        /лампочк[аи]/i,
        /светильники?/i,
    ],
};
const lightRoles: string[] = [
    'switch.light',
    'dimmer',
    'value.dimmer',
    'level.dimmer',
    'sensor.light',
    'state.light',
];
export function roleOrEnumLight(
    obj: ioBroker.Object,
    enums: string[]
): boolean {
    return roleOrEnum(obj, enums, lightRoles, lightWords);
}

// -------------- BLINDS -----------------------------------------
const blindWords: { [lang: string]: RegExp[] } = {
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
export function roleOrEnumBlind(
    obj: ioBroker.Object,
    enums: string[]
): boolean {
    return roleOrEnum(obj, enums, blindRoles, blindWords);
}

// -------------- GATES ------------------------------------------
const gateWords: { [lang: string]: RegExp[] } = {
    en: [/gates?/i],
    de: [/^toren$/i, /^tor$/i], // "^" because of Actor
    ru: [/ворота/i],
};

const gateRoles: string[] = [
    'gate',
    'value.gate',
    'switch.gate',
    'action.stop',
    'button.stop',
];
export function roleOrEnumGate(obj: ioBroker.Object, enums: string[]): boolean {
    return roleOrEnum(obj, enums, gateRoles, gateWords);
}

// -------------- WINDOWS -----------------------------------------
const windowRoles: string[] = [
    'window',
    'state.window',
    'sensor.window',
    'value.window',
];
export function roleOrEnumWindow(
    obj: ioBroker.Object,
    enums: string[]
): boolean {
    return roleOrEnum(obj, enums, windowRoles, blindWords);
}

// -------------- DOORS -----------------------------------------
const doorsWords: { [lang: string]: RegExp[] } = {
    en: [/doors?/i, /gates?/i, /wickets?/i, /entry|entries/i],
    de: [/^türe?/i, /^tuere?/i, /^tore?$/i, /einfahrt(en)?/i, /pforten?/i], // "^" because of Actor
    ru: [/двери|дверь/i, /ворота/i, /калитка|калитки/, /въезды?/i, /входы?/i],
};

const doorsRoles: string[] = ['door', 'state.door', 'sensor.door'];
export function roleOrEnumDoor(obj: ioBroker.Object, enums: string[]): boolean {
    return roleOrEnum(obj, enums, doorsRoles, doorsWords);
}

export function getEnums(): {
    [id: string]: { roles: string[]; words: { [lang: string]: RegExp[] } };
} {
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

export function getAllStatesInChannel(
    keys: string[],
    channelId: string
): string[] {
    const list: string[] = [];
    const reg = new RegExp(
        `^${channelId.replace(/([$^.)([\]{}])/g, '\\$1')}\\.[^.]+$`
    );
    keys.forEach(_id => reg.test(_id) && list.push(_id));
    return list;
}

export function getAllStatesInDevice(
    keys: string[],
    channelId: string
): string[] {
    const list: string[] = [];
    const reg = new RegExp(
        `^${channelId.replace(/([$^.)([\]{}])/g, '\\$1')}\\.[^.]+\\.[^.]+$`
    );
    keys.forEach(_id => reg.test(_id) && list.push(_id));
    return list;
}

export function getFunctionEnums(
    objects: Record<string, ioBroker.Object>
): string[] {
    const enums: string[] = [];
    const reg = /^enum\.functions\./;
    for (const id in objects) {
        if (
            objects.hasOwnProperty(id) &&
            reg.test(id) &&
            objects[id] &&
            objects[id].type === 'enum' &&
            objects[id].common &&
            objects[id].common.members &&
            objects[id].common.members.length
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
