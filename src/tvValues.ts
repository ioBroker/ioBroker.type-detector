/**
 * The values of the `tv` states that take one of a fixed set of values: `KEY` (`media.key`),
 * `APP` (`media.app`) and `INPUT` (`media.input`).
 *
 * The keys of these objects are binding. A device lists the keys it supports in `common.states`
 * of its state - a subset, in any order - and may label them as it likes, e.g. translated:
 *
 * ```json
 * "common": { "role": "media.app", "type": "string", "states": { "YOUTUBE": "YouTube", "NETFLIX": "Netflix" } }
 * ```
 *
 * A key that is not listed here must not be used: consumers (widgets, the devices adapter, Matter)
 * rely on the keys to show the right button and icon and to translate them for other systems. A
 * missing app or input is added here with a new release.
 *
 * The adapter translates a written key into what its device understands (e.g. `YOUTUBE` into the
 * Samsung app ID `111299001912`).
 */

/**
 * Keys of a remote control, written to `media.key`. The names follow the CEC key codes of the
 * Matter KeypadInput cluster.
 */
export const TV_KEYS: Readonly<Record<string, string>> = Object.freeze({
    UP: 'Up',
    DOWN: 'Down',
    LEFT: 'Left',
    RIGHT: 'Right',
    SELECT: 'Select',
    BACK: 'Back',
    EXIT: 'Exit',
    HOME: 'Home',
    MENU: 'Menu',
    INFO: 'Info',
    GUIDE: 'Guide',
    CHANNEL_UP: 'Channel up',
    CHANNEL_DOWN: 'Channel down',
    NUMBER_0: '0',
    NUMBER_1: '1',
    NUMBER_2: '2',
    NUMBER_3: '3',
    NUMBER_4: '4',
    NUMBER_5: '5',
    NUMBER_6: '6',
    NUMBER_7: '7',
    NUMBER_8: '8',
    NUMBER_9: '9',
    PLAY: 'Play',
    PAUSE: 'Pause',
    STOP: 'Stop',
    REWIND: 'Rewind',
    FAST_FORWARD: 'Fast forward',
    RED: 'Red',
    GREEN: 'Green',
    YELLOW: 'Yellow',
    BLUE: 'Blue',
});

/** Apps a TV can start, written to `media.app` */
export const TV_APPS: Readonly<Record<string, string>> = Object.freeze({
    YOUTUBE: 'YouTube',
    YOUTUBE_MUSIC: 'YouTube Music',
    NETFLIX: 'Netflix',
    DISNEY_PLUS: 'Disney+',
    PRIME_VIDEO: 'Prime Video',
    APPLE_TV: 'Apple TV',
    MAX: 'Max',
    PARAMOUNT_PLUS: 'Paramount+',
    DAZN: 'DAZN',
    WOW: 'WOW',
    JOYN: 'Joyn',
    RTL_PLUS: 'RTL+',
    MAGENTA_TV: 'MagentaTV',
    ARD_MEDIATHEK: 'ARD Mediathek',
    ZDF_MEDIATHEK: 'ZDF Mediathek',
    SPOTIFY: 'Spotify',
    TWITCH: 'Twitch',
    PLEX: 'Plex',
    BROWSER: 'Browser',
});

/**
 * Inputs a TV can switch to, written to `media.input`. `TV` is the built-in tuner (antenna, cable),
 * `SAT` a built-in satellite tuner.
 */
export const TV_INPUTS: Readonly<Record<string, string>> = Object.freeze({
    TV: 'TV',
    SAT: 'Satellite',
    HDMI1: 'HDMI 1',
    HDMI2: 'HDMI 2',
    HDMI3: 'HDMI 3',
    HDMI4: 'HDMI 4',
    USB: 'USB',
    AV: 'AV',
    COMPONENT: 'Component',
    SCART: 'SCART',
    OPTICAL: 'Optical',
    AUX: 'AUX',
});
