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

console.log('Spelling API started on port ' + port + '...');

module.exports = app;
