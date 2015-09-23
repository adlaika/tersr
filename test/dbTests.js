var should = require('should')
var redis = require('redis')

var Link = require('../server/models/linksModel')
var db

describe('Database Interaction Tests', function() {
    describe('Model - Link', function() {
        before(function(done) {
            db = redis.createClient()
            db.on('connect', function() {
                console.log('redis connected')
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
