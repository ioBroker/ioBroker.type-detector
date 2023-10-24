const expect = require('chai').expect;

const ChannelDetectorImport = require('../build/index');
const createTests = require('./commonTests');
const ChannelDetector = ChannelDetectorImport.default;
const Types = ChannelDetectorImport.Types;

createTests('TS', ChannelDetector, Types);