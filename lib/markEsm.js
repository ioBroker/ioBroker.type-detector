// The package is CommonJS, so the folder of the ES module build has to say that it is ESM.
// Bundlers read `sideEffects` from the nearest package.json, which is this one, so it has to be repeated here:
// without it, they keep all patterns even if only a helper is imported
const { writeFileSync } = require('node:fs');
const { join } = require('node:path');

writeFileSync(
    join(__dirname, '../build/esm/package.json'),
    `${JSON.stringify({ type: 'module', sideEffects: false }, null, 4)}\n`,
);
