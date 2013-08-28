var SpellCheck = require('spellcheck'),
    delimeter = (process.platform === 'win32' ? '\\' : '/'),
    basedir = __dirname + delimeter + ".." + delimeter + "dictionaries" + delimeter,
    spell = new SpellCheck(basedir + 'en_US.aff', basedir + 'en_US.dic');

exports.spellCheck = function(req, res, next) {
    spell.check(req.params.word, function(err, correct, suggestions) {
        if (err) {
            return next(err);
        }
        else {
            if (typeof suggestions == 'undefined') {
                suggestions = [];
            }

            req.data = {'suggestions': suggestions, 'correct': correct};
            next();
        }
    });
};
