var should = require('should')
var redis = require('redis')
var hippie = require('hippie')

var Link = require('../server/models/linksModel')
var util = require('../server/helpers/util.js')
var app = require('../server/app.js')

var db

describe('Database Tests', function() {
    describe('Link Model', function() {
        before(function(done) {
            // create new db client connect to ensure no interference from main app
            db = redis.createClient()
            db.on('connect', function() {
                console.log('       redis connected')
            })
            db.flushdb()
            db.set('foo', 'bar')
            done()
        })

        beforeEach(function(done) {
            done()
        })

        after(function (done) {
            db.flushdb()
            db.end();
            done()
        })

        it('db should exist', function(done) {
            should.exists(db)
            done()
        })

        it('key foo should be bar', function(done) {
            db.get('foo', function(err, reply) {
                reply.should.equal('bar')
                reply.should.not.equal('barr')
                done()
            })
        })

        it('Link.set should save key to db', function(done) {
            Link.set('foo2', 'bar2', function(message) {
                message.should.equal('OK')
                db.get('foo2', function(err, reply) {
                    reply.should.equal('bar2')
                    reply.should.not.equal('barr2')
                    done()
                })
            })
        })

        it('Link.getUniqueId should get unique id', function(done) {
            Link.getUniqueId(function(err, id) {
                id.should.equal(1)
                id.should.not.equal(2)
                done()
            })
        })

        it('Link.addNewLink should add a link with an incremented id', function(done) {
            Link.addNewLink('www.google.com', function(err, message, short, url) {
                message.should.equal('OK')
                short.should.equal('2')
                url.should.equal('www.google.com')
                var id = (2).toString(10)
                var linkKey = 'link:' + id
                db.hgetall(linkKey, function(err, obj) {
                    obj.should.deepEqual(obj, { url: 'www.google.com', id: '2' })
                    done()
                })
            })
        })

        it('Link.getLink should return a previously added link', function(done) {
            Link.getLink('2', function(err, linkObj) {
                linkObj.should.deepEqual(linkObj, { url: 'www.google.com', id: '2' })
                done()
            })
        })
    })
})

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

describe('API Tests', function() {
    it('GET to // should return 404', function(done) {
        api()
            .get('//')
            .expectStatus(404)
            .end(function(err, res, body) {
                if (err) throw err
                done()
            })
    })
    it('GET to non-extant short link should 404', function(done) {
        api()
            .get('/dfsdlfjs3353lgflj33')
            .expectStatus(404)
            .end(function(err, res, body) {
                if (err) throw err
                done()
            })
    })
    it('PUT to / should add a link', function() {
        api()
            .put('/')
            .expectStatus(201)
            .end(function(err, res, body) {
                if (err) throw err
                done()
            })
    })
})

function api() {
    return hippie()
        .base(app.HOST)
}
