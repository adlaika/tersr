var should = require('should')
var util = require('../server/helpers/util.js')

describe('Utility Tests', function() {
    describe('trimSlashes', function() {
        it('should throw an error if argument is not a string', function() {
            (function() { util.trimSlashes(null) }).should.throw();
            (function() { util.trimSlashes(true) }).should.throw();
            (function() { util.trimSlashes(2) }).should.throw();
        })
        it('should return the same path if it contains no slashes', function() {
            util.trimSlashes('foo').should.equal('foo')
        })
        it('should return the path minus trailing and/or leading slashes', function() {
            util.trimSlashes('/foo/').should.equal('foo')
            util.trimSlashes('/foo').should.equal('foo')
            util.trimSlashes('foo/').should.equal('foo')
        })
        it('should not remove interstitial slashes', function() {
            util.trimSlashes('foo/bar').should.equal('foo/bar')
            util.trimSlashes('/foo/bar/').should.equal('foo/bar')
            util.trimSlashes('/foo/bar').should.equal('foo/bar')
            util.trimSlashes('foo/bar/').should.equal('foo/bar')
        })
    })
})