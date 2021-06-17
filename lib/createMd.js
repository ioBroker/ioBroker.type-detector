const {Types, ChannelDetector} = require('../index');
const Names = require('./types');
const fs = require('fs');

const channelDetector = new ChannelDetector();
const patterns = channelDetector.getPatterns();

const file = [];
function writeLine(line) {
    console.log(line);
    file.push(line);
}
const FIELDS = ['R', 'Name', 'Role', 'Unit', 'Type', 'Wr', 'Min', 'Max', 'Enum', 'Ind', 'Mult', 'Regex'];

function showState(state) {
    let line = [];

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
    line.push(state.defaultUnit || '' + (state.unit ? ' / ' + state.unit : ''));
    line.push(typeof state.type === 'object' ? state.type.join('/') : state.type || '');
    line.push(state.write ? 'W' : (state.write === false ? '-' : ''));

    line.push(state.min ? 'm' : '');
    line.push(state.max ? 'M' : '');
    line.push(state.enums ? 'E' : '');


    line.push(state.indicator ? 'X' : ' ');

    line.push(state.multiple ? 'x' : ' ');

    line.push(state.role ? '``' + state.role.toString().replace(/\|/g, '｜') + '``' : ''); //escape | character inside table cell!

    return line;
}

const prefix = fs.readFileSync(__dirname + '/DEVICES.md');
file.push(prefix);

writeLine('## Devices' );
Object.keys(Types).sort().forEach(type => {
    if (patterns[type] && type !== 'instance') {
        writeLine('### ' + (Names[type] || type));
        const lines = [];
        patterns[type].states.forEach(state => lines.push(showState(state)));
        const length = [];
        // find length
        FIELDS.forEach((field, i) => {
            length[i] = 0;
            lines.forEach(line => {
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
        const _line = '| ' + line.join(' | ') + ' |';
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
            })
                .filter((_, i) => length[i]);

            writeLine('| ' + lline.join(' | ') + ' |');
        });
        //writeLine(_line.replace(/[\s\w]/g, '-'));
        writeLine('');
        writeLine('');
    }
});
writeLine('');
writeLine('## Categories');
const enums = channelDetector.getEnums();
Object.keys(enums).forEach(enu => {
    writeLine('### ' + enu);
    writeLine('To detect these devices, it must belong to one of following category (any regex in any language):');
    Object.keys(enums[enu].words).forEach(language => {
        writeLine('- **' + language + '**: ' +
            enums[enu].words[language].map(r => '``' + r.toString().replace(/\|/g, '\|') + '``').join(', '));
    });
    writeLine('\nOr has one of the roles: ');
    writeLine(enums[enu].roles.map(r => '`' + r + '`').join(', '));
    writeLine('');
});

fs.writeFileSync(__dirname + '/../DEVICES.md', file.join('\n'));