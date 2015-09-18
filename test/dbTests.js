var should = require('should')
var monk = require('monk')

var Link = require('../models/linksModel')
var db
var links

describe('Model Link', function() {

    before(function(done) {
        db = monk('mongodb://localhost:27017/tersr');
        done()
    })

    beforeEach(function(done) {
        links = db.get('links')
        links.insert({boop: 'beep'})
        done()
    })

    after(function (done) {
        links.drop()
        db.close(done)
    })

    it('db should exist', function(done) {
        should.exists(db)
        done()
    })

    it('db should have links collection', function(done) {
        db.collections.should.have.property('links')
        done()
    })
})
