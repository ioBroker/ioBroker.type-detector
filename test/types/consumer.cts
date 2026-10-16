// Type-checked by environments.test.mjs as CommonJS: the types must match what Node.js loads at runtime
import ChannelDetector, {
    ChannelDetector as NamedChannelDetector,
    Types,
    type DetectOptions,
    type PatternControl,
} from '@iobroker/type-detector';
// deep imports, as some adapters use them
import { roleOrEnumLight } from '@iobroker/type-detector/build/roleEnumUtils';
import { Types as DeepTypes, type DetectorState } from '@iobroker/type-detector/build/types';

const options: DetectOptions = { objects: {}, id: 'test.0.device' };
const controls: PatternControl[] | null = new ChannelDetector().detect(options);
const fromNamed: PatternControl[] | null = new NamedChannelDetector().detect(options);
const state: DetectorState | undefined = controls?.[0]?.states[0];
// the enum of a deep import must be the one of the package, or the two are not assignable to each other
const type: Types = DeepTypes.light;
const isLight: boolean = roleOrEnumLight({} as ioBroker.Object, []);

export { fromNamed, state, type, isLight };
