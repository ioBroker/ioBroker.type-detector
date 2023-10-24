const pack = require('./package.json');
const fs = require('fs');

pack.name = '@iobroker/type-detector';
delete pack.devDependencies;
delete pack.scripts;
fs.writeFileSync(`${__dirname}/build/package.json`, JSON.stringify(pack, null, 2));

fs.writeFileSync(`${__dirname}/build/README.md`, fs.readFileSync(`${__dirname}/README.md`));
fs.writeFileSync(`${__dirname}/build/LICENSE`, fs.readFileSync(`${__dirname}/LICENSE`));
