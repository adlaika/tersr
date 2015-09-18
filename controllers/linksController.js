var db = require('../app').db

var Link = require('../models/linksModel')

exports.view = function(req, res) {
    Link.getAll(function(err, result) {
        res.render('index', {links: result})
    })
}


exports.create = function(req, res) {
    res.send('created')
}