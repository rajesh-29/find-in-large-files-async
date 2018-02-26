
// Author - Rajesh Borade

const fs = require('fs');
const util = require('util');

function FileUtils(fileName) {

    this.fileName = fileName;

    this.getLastModifiedTimestampSync = function() {
        var stats = fs.statSync(this.fileName);
        var modifiedTimestamp = new Date(util.inspect(stats.mtime));
        return modifiedTimestamp;
    }

    this.getLastModifiedJsonSync = function() {
        var _json = {};
        var stats = fs.statSync(this.fileName);
        var modifiedTimestamp = new Date(util.inspect(stats.mtime));
        _json['fileName'] = this.fileName;
        _json['lastModified'] = modifiedTimestamp;
        return _json;
    }
}

module.exports = FileUtils;

/* TEST USAGE

var FileUtils = require('./file_utils');
fileName = './../package.json';
var fileUtils = new FileUtils(fileName);
console.log(fileUtils.getLastModifiedTimestampSync());
console.log(fileUtils.getLastModifiedJsonSync());

*/