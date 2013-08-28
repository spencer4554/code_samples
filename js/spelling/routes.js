/**
 * routing schema
 */
var spelling = require('./controllers/spelling');
var base = require('./controllers/base');

module.exports = function(app) {
        // spelling
	app.get('/spellcheck/:word', spelling.spellCheck, base.sendResult);

	// error handlers
	app.use(base.errorHandler);
};
