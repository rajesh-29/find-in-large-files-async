
// Author - Rajesh Borade
// Async Directory manager

const fs = require('fs');

function DirectoryReader(directoryName) {
     
    this.directoryName = directoryName;

    this.listFiles = function(callbackForFileList) {          
        
        /* for single directory
        var listOfFiles = [];
        fs.readdir(this.directoryName, (err, files) => {
            files.forEach(file => {
                listOfFiles.push(file);
            });
        });
        return listOfFiles;
        */
        var walk    = require('walk');
        var files   = [];
        var walker  = walk.walk(this.directoryName, { followLinks: false });
        walker.on('file', function(root, stat, next) {
            files.push(root + '/' + stat.name);
            next();
        });
        walker.on('end', function() {
            callbackForFileList(files);
        });
    }

    this.listFilesWithDateModified = function(callbackForFileList) {          
        
        var walk    = require('walk');
        var FileUtils = require('./file_utils');
        var files   = [];
        // console.log('Collecting files under - ' + this.directoryName);
        var walker  = walk.walk(this.directoryName, { followLinks: false });
        walker.on('file', function(root, stat, next) {
            var fileWithAbsolutePath = root + '/' + stat.name;
            // console.log('Collected file - ' + fileWithAbsolutePath);
            var fileUtils = new FileUtils(fileWithAbsolutePath);
            files.push(fileUtils.getLastModifiedJsonSync());
            next();
        });
        walker.on('end', function() {
            // console.log('Walking of files finished...' + files);
            callbackForFileList(files);
        });
    }
};

module.exports = DirectoryReader; 


/* TEST USAGE

var DirectoryReader = require('./directory_utils');
var directoryReader = new DirectoryReader('./../test/');
function callbackForFileList(listOfFiles) {
    console.log('' + listOfFiles);
}
directoryReader.listFiles(callbackForFileList);

//--------------------------------------------

var DirectoryReader = require('./directory_utils');
var directoryReader = new DirectoryReader('./../test/');
function callbackForFileList(listOfFiles) {
    listOfFiles.forEach(function(value){
        console.log(JSON.stringify(value));
    });
}
directoryReader.listFilesWithDateModified(callbackForFileList);

*/