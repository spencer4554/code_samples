/**
 * Base Controller
 */
module.exports = {
    // generic callback
    callback: function (req, res, next) {
	return function (err, data) {
	    if (err) {
		return next(err);
	    }

	    req.data = data;
	    next();
	};
    },

    errorHandler:  function (err, req, res, next) {
	res.send({'code': 500, 'errorType': 'UNKNOWN', 'errorMessage': 'An unexpected error has occurred. Please try again later.'});
    },

    sendResult: function (req, res, next) {
	if (req.accepts('application/json')) {
	    res.setHeader('Content-Type', 'application/json');
	    var response = {'code': 200, 'data': req.data};
	} else {
	    res.setHeader('Content-Type', 'application/xml');
	    var response = {'code': 200};
	}
	res.send(response);
    }
};
