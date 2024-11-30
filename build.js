const pack = require('./package.json');
const { writeFileSync, readFileSync } = require('node:fs');

pack.name = '@iobroker/type-detector';
delete pack.devDependencies;
delete pack.scripts;
writeFileSync(`${__dirname}/build/package.json`, JSON.stringify(pack, null, 2));

writeFileSync(`${__dirname}/build/README.md`, readFileSync(`${__dirname}/README.md`));
writeFileSync(`${__dirname}/build/LICENSE`, readFileSync(`${__dirname}/LICENSE`));
