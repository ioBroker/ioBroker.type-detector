const { readFileSync, writeFileSync } = require('node:fs');
const ChannelDetectorImport = require('../build/index');
const ChannelDetector = ChannelDetectorImport.default;
const Names = require('./nameOfTypes');

const patterns = ChannelDetector.getPatterns();

const file = [];
function writeLine(line) {
    // console.log(line);
    file.push(line);
}
const FIELDS = ['R', 'Name', 'Role', 'Unit', 'Type', 'Wr', 'Min', 'Max', 'Enum', 'Ind', 'Multi', 'Regex'];

function showState(state, lines) {
    let line = [];

    if (Array.isArray(state)) {
        for (let i = 0; i < state.length - 1; i++) {
            lines.push(showState(state[i], lines));
        }
        if (state.length) {
            return showState(state[state.length - 1], lines);
        }
    }

    // 0 - R - Required
    if (state.required) {
        line.push('*');
    } else {
        line.push(' ');
    }

    // 1 - Name
    line.push(state.name);

    // 2 - Role
    line.push(state.defaultRole || '');

    // 3 - Unit
    line.push(state.defaultUnit || (state.unit ? ` / ${state.unit}` : ''));
    line.push(typeof state.type === 'object' ? state.type.join('/') : state.type || '');
    line.push(state.write ? 'W' : state.write === false ? '-' : '');

    line.push(state.min ? 'm' : '');
    line.push(state.max ? 'M' : '');
    line.push(state.enums ? 'E' : '');

    line.push(state.indicator ? 'X' : ' ');

    line.push(state.multiple ? 'x' : ' ');

    line.push(state.role ? `\`${state.role.toString().replace(/\|/g, '｜')}\`` : ''); //escape | character inside table cell!

    return line;
}

const prefix = readFileSync(`${__dirname}/DEVICES.md`);
file.push(prefix);

writeLine('## Devices');
writeLine('In [brackets] is given the class name of a device.');
writeLine('');

writeLine('### Content');
Object.keys(patterns)
    .sort()
    .forEach(type => {
        if (patterns[type] && type !== 'instance') {
            const name = Names[patterns[type].type]?.label || type;
            if (!Names[patterns[type].type]) {
                console.warn('Class name not found for', type);
            }
            const link = `${name}${Names[patterns[type].type] ? ` ${type}` : ''}`.toLowerCase().replace(/[^\w]/g, '-');
            writeLine(`* [${name} [${type}]](#${link})`);
        }
    });
writeLine('');

Object.keys(patterns)
    .sort()
    .forEach(type => {
        if (type !== 'instance') {
            writeLine(`### ${Names[patterns[type].type]?.label || type}${Names[patterns[type].type] ? ` [${type}]` : ''}`);
            writeLine('');
            if (Names[patterns[type].type]?.description) {
                writeLine(Names[patterns[type].type].description);
                writeLine('');
            }
            const lines = [];
            patterns[type].states.forEach(state => lines.push(showState(state, lines)));
            const length = [];
            // find length
            FIELDS.forEach((field, i) => {
                length[i] = 0;
                lines.forEach(line => {
                    if (line[i] === undefined || line[i] === null) {
                        debugger;
                    }
                    if (line[i].length > length[i]) {
                        length[i] = line[i].length;
                    }
                });
                if (length[i] && field.length > length[i]) {
                    length[i] = field.length;
                }
            });
            // Show header
            let line = [];
            FIELDS.forEach((field, i) => {
                if (length[i]) {
                    line.push(field.padEnd(length[i]));
                }
            });
            const _line = `| ${line.join(' | ')} |`;
            //writeLine(_line.replace(/[\s\w]/g, '-'));
            writeLine(_line);
            writeLine(_line.replace(/[\s\w]/g, '-'));
            lines.forEach(line => {
                let lline = [];
                line.map((item, i) => {
                    if (length[i]) {
                        lline.push(item.padEnd(length[i]));
                    } else {
                        return '';
                    }
                }).filter((_, i) => length[i]);

                writeLine(`| ${lline.join(' | ')} |`);
            });
            //writeLine(_line.replace(/[\s\w]/g, '-'));
            writeLine('');
            writeLine('');
        } else {
            console.error(`No pattern for ${type}`);
        }
    });

writeLine('');

writeLine('## Categories');
const enums = ChannelDetector.getEnums();
Object.keys(enums).forEach(enu => {
    writeLine(`### ${enu}`);
    writeLine(
        'To detect these devices, it must belong to one of the following categories (any regex in any language):',
    );
    Object.keys(enums[enu].words).forEach(language => {
        writeLine(
            `- **${language}**: ${enums[enu].words[language].map(r => '`' + r.toString().replace(/\|/g, '|') + '`').join(', ')}`,
        );
    });
    writeLine('\nOr has one of the roles: ');
    writeLine(enums[enu].roles.map(r => '`' + r + '`').join(', '));
    writeLine('');
});

writeFileSync(`${__dirname}/../DEVICES.md`, file.join('\n'));
