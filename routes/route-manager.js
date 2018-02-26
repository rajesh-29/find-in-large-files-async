
// Author - Rajesh Borade
// Description - Async word seach service in huge files

var forEach = require('async-foreach').forEach;
var express = require('express');
var router = express.Router();

var AsyncFileReader = require('./../utils/file_reader_async');
var DirectoryReader = require('./../utils/directory_utils');
var TimeUtils = require('./../utils/time_utils');

/* status service */
router.get('/status', function(req, res, next) {
  
	console.log('*** REQUEST - Status ');
    var _resBody = { status : 'RUNNING' };
    res.status(200).send(_resBody);
});

/* search service */
router.post('/search', function(req, res, next) {
	
    console.log('*** REQUEST - /search ');
    if(!req.body) {
        var _resBody = { status : 'ERROR' };
        res.status(500).send(_resBody);
    }

    var parentDirName = req.body.parent_directory;

    var searchWords = ['sample'];
    
    if(req.body.search_words) {
        searchWords = req.body.search_words.split(',');
    }
    var modifiedInLastXHours = 12;
    if(req.body.modified_in_last_x_hours) {
        try {
            modifiedInLastXHours = parseInt(req.body.modified_in_last_x_hours);
        }
        catch (err)
        {
            modifiedInLastXHours = 12;
        }
    }

    var total_searchWords = searchWords.length;
    var currentTimestamp = Date.now();
    var directoryReader = new DirectoryReader(parentDirName);
    
    function callbackForFileList(listOfFiles) {
    
        // console.log('We have list of files ' + listOfFiles);
        var results_array = [];
        // when all searching is done asynchronously
        var onFinishSearchingAllFiles = function() {
            console.log('* Request processing completed...');
            var all_results_JSON = JSON.stringify(results_array);
            console.log(all_results_JSON);
            res.status(200).send(all_results_JSON);
        }
        // sync/async for-each use
        forEach(listOfFiles, function(item, index, arr) {
            var fileTimestampObj = item;
            // console.log("each", item, index, arr);
            var fileName = fileTimestampObj.fileName;
            var fileTimestamp = fileTimestampObj.lastModified;
            var timeUtils = new TimeUtils(fileTimestamp, currentTimestamp);
            var hourDifference = timeUtils.getHourDifference();
            console.log('*** ', fileName, ' - ', fileTimestamp, ' - ', hourDifference );
            if(hourDifference < modifiedInLastXHours) {
                console.log('* Searching in this file asynchronously ... ');
                var done = this.async();
                results = {};
                for (var i = 0; i < total_searchWords; i++) {
                    var _currentWord = searchWords[i];
                    if(_currentWord) {
                        _currentWord = _currentWord.toLocaleLowerCase();
                        results[_currentWord] = 0;
                    }
                }
                function onError(err) {
                    console.log('* Error while reading file.', err);
                    results['status'] = 'ERROR';
                    results['description'] = 'Details - ' + err;
                }
                function onComplete() {
                    console.log('* Finished reading entire file.');
                    meta_results = {};
                    meta_results['status'] = 'SUCCESS';
                    meta_results['file_name'] = fileName;
                    meta_results['search_results'] = results;
                    results_array.push(meta_results);
                    done();
                }
                function callbackForEachLine(line) {
                    if(line) {
                        line = line.toLowerCase();
                        for (var i = 0; i < total_searchWords; i++) {
                            var _currentWord = searchWords[i];
                            if(_currentWord) {
                                _currentWord = _currentWord.toLocaleLowerCase();
                                if(line.indexOf(_currentWord) > -1) {
                                    results[_currentWord] = results[_currentWord] + 1;
                                }
                            }    
                        }
                    }
                }
                var readerObj = new AsyncFileReader(fileName);
                readerObj.asyncFind(callbackForEachLine, onComplete, onError);
            }
        }, onFinishSearchingAllFiles);
    
    }
    directoryReader.listFilesWithDateModified(callbackForFileList);	
});

module.exports = router;