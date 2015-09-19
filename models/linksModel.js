var db = require('../app').db

exports.add = function(url, cb) {
    var linkId
    //redis.incr allows multiple db clients to incr without fear of collision, good for scalability
    db.incr('linkCounter', function(err, id) {
        linkId = id
    })
    //set key as "link:" + id to differentiate from other types, like "users"
    var linkKey = 'link:' + linkId
    //set hashmap, return cb with values added
    db.hmset(linkKey, {
        'url': url,
        'id': linkId
    }, function(err, message) {
        //convert id to base36--this will be our short url
        var short = linkId.toString(36)
        cb(err, message, short, url)
    })
}

exports.get = function(short, cb) {

}

exports.getAll = function(cb) {

}
