var should = require('should');
var redis = require('redis');
var hippie = require('hippie');

var Link = require('../server/models/linksModel');
var util = require('../server/helpers/util.js');
var app = require('../server/app.js');

var db;

describe('Tersr', function() {

    before(function (done) {
        // create new db client connect to ensure no interference from main app
        db = redis.createClient();
        db.on('connect', function () {
            console.log('       redis connected')
        });
        db.flushdb();
        db.set('foo', 'bar');
        done();
    });

    after(function (done) {
        db.flushdb();
        db.end();
        done();
    });


    describe('Database Tests', function () {
        describe('Link Model', function () {

            it('db exists', function (done) {
                should.exists(db);
                done()
            });

            it('get foo returns bar', function (done) {
                db.get('foo', function (err, reply) {
                    reply.should.equal('bar');
                    reply.should.not.equal('barr');
                    done()
                })
            });

            it('Link.set saves key to db', function (done) {
                Link.set('foo2', 'bar2', function (message) {
                    message.should.equal('OK');
                    db.get('foo2', function (err, reply) {
                        reply.should.equal('bar2');
                        reply.should.not.equal('barr2');
                        done()
                    })
                })
            });

            it('Link.getUniqueId gets unique id', function (done) {
                Link.getUniqueId(function (err, id) {
                    id.should.equal(1);
                    id.should.not.equal(2);
                    done()
                })
            });

            it('Link.addNewLink adds a link with an incremented id', function (done) {
                Link.addNewLink('www.google.com', function (err, message, short, url) {
                    message.should.equal('OK');
                    short.should.equal('2');
                    url.should.equal('www.google.com');
                    var id = (2).toString(10);
                    var linkKey = 'link:' + id;
                    db.hgetall(linkKey, function (err, obj) {
                        obj.should.deepEqual(obj, {url: 'www.google.com', id: '2'});
                        done()
                    })
                })
            });

            it('Link.getLink returns a previously added link', function (done) {
                Link.getLink('2', function (err, linkObj) {
                    linkObj.should.deepEqual(linkObj, {url: 'www.google.com', id: '2'});
                    done();
                });
            });
        });
    });

    describe('Utility Tests', function () {
        describe('trimSlashes', function () {
            it('throws an error if argument is not a string', function () {
                (function () {
                    util.trimSlashes(null)
                }).should.throw();
                (function () {
                    util.trimSlashes(true)
                }).should.throw();
                (function () {
                    util.trimSlashes(2)
                }).should.throw();
            });
            it('returns the same path if it contains no slashes', function () {
                util.trimSlashes('foo').should.equal('foo')
            });
            it('returns the path minus trailing and/or leading slashes', function () {
                util.trimSlashes('/foo/').should.equal('foo');
                util.trimSlashes('/foo').should.equal('foo');
                util.trimSlashes('foo/').should.equal('foo')
            });
            it('does not remove interstitial slashes', function () {
                util.trimSlashes('foo/bar').should.equal('foo/bar');
                util.trimSlashes('/foo/bar/').should.equal('foo/bar');
                util.trimSlashes('/foo/bar').should.equal('foo/bar');
                util.trimSlashes('foo/bar/').should.equal('foo/bar')
            });
        });
    });

    describe('Route Tests', function () {
        it('GET to // returns 404', function (done) {
            api()
                .get('//')
                .expectStatus(404)
                .end(function (err, res, body) {
                    if (err) throw err;
                    done()
                });
        });
        it('GET to non-extant short link returns 404', function (done) {
            api()
                .get('/foobar123')
                .expectStatus(404)
                .end(function (err, res, body) {
                    if (err) throw err;
                    done()
                });
        });
        it('POST form to / returns 200', function (done) {
            api()
                .form()
                .method('POST')
                .send({url: 'http://www.reddit.com'})
                .expectStatus(200)
                .end(function (err, res, body) {
                    if (err) throw err;
                    done()
                });
        });
        it('GET to last added shortUrl should redirect', function (done) {
            api()
                .get('/3')
                .expectStatus(302)
                .end(function (err, res, body) {
                    if (err) throw err;
                    done()
                });
        });
    });

    describe('API Tests', function() {
        it('POST to /api/link/add returns shortURL', function() {
            api()
                .url('/api/link/add')
                .json()
                .method('POST')
                .send({ "url": "http://www.reddit.com" })
                .expectStatus(201)
                .expectValue('short', app.HOST + '/3')
                .expectValue("url", "http://www.reddit.com")
                .end(function (err, res, body) {
                    if (err) throw err;
                    done();
                });
        });
    });
});

function api() {
    return hippie()
        .base(app.HOST);
};

