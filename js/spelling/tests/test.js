var app = require('../app');
var http = require('http');

var request = require('supertest');
var assert = require('assert');

describe('Test Spelling', function() {
    it('Test if a valid word will return the correct response', function(done) {
	request(app)
	    .get('/spellcheck/test')
	    .set('Content-Type','application/json')
	    .expect(200)
            .end(function(err, res) {
               var result = res.body;
               assert.equal(200, result.code);
               assert.equal(result.data.count, 1);
               done();
            });
    });

    it('Test spelling check returns ', function(done) {
        done()
    });
});

