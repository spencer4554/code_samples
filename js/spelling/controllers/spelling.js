var SpellCheck = require('spellcheck'),
    basedir = __dirname + '/../dictionaries/',
    spell = new SpellCheck(basedir + 'en_US.aff', basedir + 'en_US.dic');

exports.spellCheck = function(req, res, next) {
    spell.check(req.params.word, function(err, correct, suggestions) {
        if (err) {
            return next(err);
        }
        else {
            // If we don't do this, suggestions will not appear in the result if 
            // there are no suggestions
            if (typeof suggestions == 'undefined') {
                suggestions = [];
            }

            req.data = {'suggestions': suggestions, 'correct': correct};
            next();
        }
    });
};
