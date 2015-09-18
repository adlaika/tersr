var db = require('../app').db

var links = db.get('links')

exports.getAll = function(cb) {
    links.find({}, function(err, docs) {
        if (err) return cb(err)
        cb(null, docs)
    })
}