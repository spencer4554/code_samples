/**
 * main entry point
 */
var express = require('express');
var app = express();

// routes
require('./routes')(app);

// Default port 3000
var port = 3000;

app.listen(port);

console.log('API v3 started on port ' + port + '...');

module.exports = app;
