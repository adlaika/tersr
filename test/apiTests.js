var should = require('should')
var hippie = require('hippie')

var app = require('../server/app.js')

function api() {
    return hippie()
        .base(app.HOST)
}

describe('API Tests', function() {
    it('path // should return 404', function(done) {
        api()
            .get('//')
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