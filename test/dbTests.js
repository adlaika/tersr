var should = require('should')
var redis = require('redis')

var Link = require('../models/linksModel')
var db
var links

describe('Model Link', function() {

    before(function(done) {
        db = redis.createClient()
        db.on('connect', function() {
            console.log('redis connected')
        })
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

    //    db.hmset("links", {"id" : "beep"}, redis.print)
    //    db.hgetall("links", function(err, obj) {
    //        console.dir(obj)
    //    })

})
