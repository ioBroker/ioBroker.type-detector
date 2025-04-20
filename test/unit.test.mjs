import { expect } from 'chai';
import { getObjectsBelowId } from '../build/RoleEnumUtils.js';

// generate test data of 10000 objects like `attr0.9.param2.param3.param4.param5`, where random is from 0-9
function getData(size = 5, random = 9) {
    const data = [];
    for (let i = 0; i < 100000; i++) {
        const item = [];
        const localSize = Math.floor(Math.random() * size) + 1;
        let found;
        do {
            found = false;
            for (let j = 0; j < localSize; j++) {
                item.push(`attr${Math.floor(Math.random() * random)}`);
            }
            const id = item.join('.');
            found = data.includes(id)
        } while (found)

        data.push(item.join('.'));
    }
    data.sort();
    return data;
}

export function getObjectsBelowIdSimple(keys, startId) {
    const list = [];
    startId += '.';
    keys.forEach(id => (id === startId || id.startsWith(startId)) && list.push(id));
    return list;
}

describe(`Unit tests`, () => {
    it(`getObjectsBelowId`, done => {
        const gStart = Date.now();
        console.log('Generate Test data...')
        const data = getData(5, 20);
        console.log(`Generated in ${Date.now() - gStart}ms`);
        // find brunch with most objects
        const branches = {};
        for (let i = 0; i < data.length; i++) {
            const item = data[i].split('.');
            if (item.length > 1) {
                const branch = `${item[0]}.${item[1]}`;
                branches[branch] = branches[branch] ? branches[branch] + 1 : 1;
            }
        }

        // Take the longest branch
        const branch = Object.keys(branches).sort().pop();
        console.log('Use branch', branch, 'with', branches[branch], 'objects');

        const originalList = getObjectsBelowIdSimple(data, branch);
        const optimizedList = getObjectsBelowId(data, branch);
        expect(JSON.stringify(optimizedList)).to.be.equal(JSON.stringify(originalList));

        // Calculate the time with optimized function
        const start = Date.now();
        let lengths = [];
        for (let attempt = 0; attempt < 10000; attempt++) {
            const list = getObjectsBelowId(data, branch);
            // Hopefully the JS engine cannot optimize this and skip search
            lengths.push(list.length);
        }
        const optimizedDuration = Date.now() - start;

        console.log(`Optimized time for ${lengths.length} attempts: ${Date.now() - start}`);

        // Calculate the time with simple function
        const startSimple = Date.now();
        lengths = [];
        for (let attempt = 0; attempt < 1000; attempt++) {
            const list = getObjectsBelowIdSimple(data, branch);
            // Hopefully the JS engine cannot optimize this and skip search
            lengths.push(list.length);
        }
        const simpledDuration = Date.now() - start;
        console.log(`Simple time for ${lengths.length} attempts: ${Date.now() - startSimple}. Optimization is x${Math.floor((simpledDuration * 10) / optimizedDuration)}`);

        done();
    }).timeout(50000);
});
