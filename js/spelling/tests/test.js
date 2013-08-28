var app = require('../app');
var http = require('http');

var request = require('supertest');
var assert = require('assert');

function call_done_after_n(n, done) {
    var iterations = 0;
    return function () {
        iterations += 1;
        if (iterations == n) {
            done();
        }
    }
}

describe('Test Spelling', function() {
    it('Test if valid words return correct', function(done) {
        var test_words = ['test', 'happy', 'lucky'];
        done = call_done_after_n(test_words.length, done);

        test_words.forEach(function (word) {
	    request(app)
	        .get('/spellcheck/' + word)
	        .set('Accept','application/json')
	        .expect(200)
                .end(function(err, res) {
                    var result = res.body;
                    assert.equal(200, result.code);
                    assert.equal(true, result.data.correct);
                    assert.equal(result.data.suggestions.length, 0);
                    done();
                });
        });
    });

    it('Test if incorrect spelling returns correct false', function(done) {
        
        var test_words = ['tesf', 'happf', 'luckf'];
        done = call_done_after_n(test_words.length, done);
        
        test_words.forEach(function (word) {
	    request(app)
	        .get('/spellcheck/' + word)
	        .set('Accept','application/json')
	        .expect(200)
                .end(function(err, res) {
                    var result = res.body;
                    assert.equal(200, result.code);
                    assert.equal(false, result.data.correct);
                    done();
                });
        });
    });

    it('Test if blatantly incorrect word produces no suggestions', function(done) {
	request(app)
	    .get('/spellcheck/supercalifragilisticexpialadocious')
	    .set('Accept','application/json')
	    .expect(200)
            .end(function(err, res) {
               var result = res.body;
               assert.equal(200, result.code);
               assert.equal(false, result.data.correct);
               assert.equal(result.data.suggestions.length, 0);
               done();
            });
    });

    it('Test if non ascii characters throws an error', function(done) {
	request(app)
	    .get('/spellcheck/œŁ好')
	    .set('Accept','application/json')
	    .expect(200)
            .end(function(err, res) {
               var result = res.body;
               assert.equal(200, result.code);
               assert.equal(false, result.data.correct);
               done();
            });
    });

    it('Test if non json content type throws an error', function(done) {
	request(app)
	    .get('/spellcheck/hello')
            .set('Accept', 'application/xml')
            .expect(500, done);
    });

});
