
// Author - Rajesh Borade
// Description - Async word seach service in huge files

var http = require('http');
var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var routeManager = require('./routes/route-manager');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// define all the routing under routeManager
app.use('/', routeManager);


var server = http.createServer(app);
server.listen(3000);
console.log('Server started at port 3000...');
// module.exports = app;