var base = require('./base');

exports.spellCheck = function(req, res, next) {
    return base.callback(req, res, next)(null, {'results': [], count: 0});
};
