/**
 * Base Controller
 */
module.exports = {
    errorHandler:  function (err, req, res, next) {
        res.statusCode = 500;
	res.send({'code': 500, 'errorType': 'UNKNOWN', 'errorMessage': 'An unexpected error has occurred. Please try again later.'});
    },

    sendResult: function (req, res, next) {
	if (req.accepts('application/json')) {
	    res.setHeader('Content-Type', 'application/json');
	    var response = {'code': 200, 'data': req.data};
	} else {
            return next('App does not yet support data formats other than json.');
	}
	
        res.send(response);
    }
};
