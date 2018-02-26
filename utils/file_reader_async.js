
// Author - Rajesh Borade
// Async Reader for huge files

function AsyncFileReader(fileName) {
     
    this.fileName = fileName;

    var processLine = function(line, lr, callbackForEachLine) {
        callbackForEachLine(line);
        lr.resume();
    };

    this.asyncFind = function(callbackForEachLine, onComplete, onError) {

        var LineByLineReader = require('line-by-line'),
        lr = new LineByLineReader(this.fileName);
        
        lr.on('error', function (err) {
            // console.log('Error while reading file.', err);
            onError(err);
        });
        
        lr.on('line', function (line) {
            // pause emitting of lines...
            lr.pause();
            processLine(line, lr, callbackForEachLine);
        });
        
        lr.on('end', function () {
            // console.log('Read entire file.');
            onComplete();
        });    
            
    }
};

module.exports = AsyncFileReader; 

/* TEST usage 


var AsyncFileReader = require('./file_reader_async');

function onError(err) {
    console.log('Error while reading file.', err);
}

function onComplete() {
    console.log('Finished reading entire file.');
}

function callbackForEachLine(line) {
    console.log('* ', line);
}

var readerObj = new AsyncFileReader('file10mb.txt');
readerObj.asyncFind(callbackForEachLine, onComplete, onError);


*/