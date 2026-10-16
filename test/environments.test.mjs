// Proves that the package works in both places it is used:
// - backend: Node.js loads it with require() (CommonJS build) or with import (ES module build)
// - frontend: a bundler builds it for the browser, and the result runs without any Node.js API
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import vm from 'node:vm';
import { buildSync } from 'esbuild';

const require = createRequire(import.meta.url);
const testDir = dirname(fileURLToPath(import.meta.url));
const rootDir = join(testDir, '..');

// Real devices from the test fixtures and the type that each of them must be detected as
const DEVICES = [
    { file: 'blinds.json', id: 'hm-rpc.1.00AAABBBA74CCC.4', type: 'blind' },
    { file: 'light.json', id: 'alias.0.Schlafzimmer.Licht.SET', type: 'light' },
    { file: 'huergb.json', id: 'hue.0.Büro', type: 'rgb' },
    { file: 'lock.json', id: 'hm-rpc.0.LEQ090XYZ.1', type: 'lock' },
    { file: 'zigbee.0.AAAAAAA.json', id: 'zigbee.0.AAAAAAA', type: 'rgb' },
];
const INPUT = JSON.stringify(
    DEVICES.map(({ file, id }) => ({ id, objects: JSON.parse(readFileSync(join(testDir, file), 'utf8')) })),
);

// Runs in Node.js and, as source text, in the browser sandbox, so both do exactly the same.
// It takes and returns JSON, so no object is shared between the sandbox and Node.js
function detectAll(ChannelDetector, input) {
    return JSON.stringify(
        JSON.parse(input).map(({ id, objects }) => {
            Object.keys(objects).forEach(objId => (objects[objId]._id = objId));
            return new ChannelDetector().detect({ objects, id });
        }),
    );
}

function checkTypes(json) {
    const results = JSON.parse(json);
    DEVICES.forEach(({ id, type }, i) => {
        assert.ok(results[i]?.length, `Nothing detected for ${id}`);
        assert.equal(results[i][0].type, type, `Wrong type detected for ${id}`);
    });
}

// The result of the CommonJS build, the one ioBroker adapters use, is the reference for all others
function nodeResult() {
    return detectAll(require('..').default, INPUT);
}

describe('Backend: Node.js', () => {
    it('CommonJS: require() of the package loads the build from "main" and detects devices', () => {
        assert.equal(require.resolve('..'), join(rootDir, 'build', 'index.js'));

        const lib = require('..');
        // TypeScript adapters compiled to CommonJS get the class of `import ChannelDetector from` through these two
        assert.equal(lib.__esModule, true);
        assert.equal(typeof lib.default, 'function');
        assert.equal(lib.Types.light, 'light');
        assert.equal(typeof lib.roleOrEnumLight, 'function');

        checkTypes(detectAll(lib.default, INPUT));
    });

    it('ES module: the ES module build is imported natively by Node.js and detects the same', async () => {
        const lib = await import(pathToFileURL(join(rootDir, 'build', 'esm', 'index.js')).href);
        assert.equal(typeof lib.default, 'function');
        assert.equal(lib.Types.light, 'light');
        assert.equal(typeof lib.roleOrEnumLight, 'function');

        assert.equal(detectAll(lib.default, INPUT), nodeResult());
    });
});

describe('Frontend: browser bundle', function () {
    // the first call starts the esbuild service
    this.timeout(30000);

    // Bundles like Vite or webpack do for a web page: the package is resolved by its name from package.json
    // (fields "browser", "module", "main"), and an import of a Node.js module would make the build fail
    function bundleForBrowser(contents) {
        const result = buildSync({
            stdin: { contents, resolveDir: testDir, sourcefile: 'app.js' },
            absWorkingDir: rootDir,
            bundle: true,
            platform: 'browser',
            format: 'iife',
            globalName: 'TypeDetector',
            write: false,
            metafile: true,
            logLevel: 'silent',
        });
        const { inputs } = Object.values(result.metafile.outputs)[0];
        return {
            code: result.outputFiles[0].text,
            // the files of the package that really ended up in the bundle (after tree-shaking)
            files: Object.keys(inputs).filter(file => file.startsWith('build/') && inputs[file].bytesInOutput > 0),
            metafile: result.metafile,
        };
    }

    let bundle;
    before(() => {
        bundle = bundleForBrowser(`export { default, Types } from '..';`);
    });

    it('uses the ES module build from the field "module" and no CommonJS', () => {
        assert.ok(bundle.files.length, 'The bundle contains no file of the package');
        assert.deepEqual(
            bundle.files.filter(file => !file.startsWith('build/esm/')),
            [],
            'The bundle contains files of the CommonJS build',
        );
        assert.doesNotMatch(bundle.code, /\brequire\s*\(/, 'The bundle still calls require()');
    });

    it('runs without any Node.js API and detects the same devices as Node.js', () => {
        const sandbox = vm.createContext({ input: INPUT });
        vm.runInContext('globalThis.window = globalThis.self = globalThis;', sandbox);
        // the sandbox has only what JavaScript itself brings, like a browser without DOM
        assert.deepEqual(
            ['require', 'module', 'exports', 'process', 'Buffer', 'global', '__dirname', 'setImmediate'].filter(
                name => vm.runInContext(`typeof ${name}`, sandbox) !== 'undefined',
            ),
            [],
        );

        vm.runInContext(bundle.code, sandbox);
        const result = vm.runInContext(`(${detectAll})(TypeDetector.default, input)`, sandbox);

        checkTypes(result);
        assert.equal(result, nodeResult());
    });

    it('imports in the ES module build are relative paths with extension, so browsers load it without bundler', () => {
        const esmFiles = Object.keys(bundle.metafile.inputs).filter(file => file.startsWith('build/esm/'));
        assert.ok(esmFiles.length);
        for (const file of esmFiles) {
            for (const { original } of bundle.metafile.inputs[file].imports) {
                assert.match(original, /^\.\.?\/.+\.js$/, `${file} imports "${original}"`);
            }
        }
    });

    it('keeps only what is imported (tree-shaking)', () => {
        const { files, code } = bundleForBrowser(`export { roleOrEnumLight } from '..';`);
        assert.deepEqual(files, ['build/esm/roleEnumUtils.js'], `Bundle of ${code.length} bytes`);
        // the full bundle has the patterns and the detector
        assert.ok(bundle.files.includes('build/esm/typePatterns.js'));
        assert.ok(bundle.files.includes('build/esm/ChannelDetector.js'));
    });
});
