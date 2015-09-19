var Link = require('../models/linksModel')

exports.viewAll = function(req, res) {
    Link.getAll(function(err, result) {
        res.render('index', {links: result})
    })
}

exports.add = function(req, res) {
    Link.add(req.body.url, function(err, message, short, url) {
        console.log(short)
        res.render('index', {link: {short: short, url: url}})
    })
}

exports.redirect = function(req, res) {
    var short = req.path.substring(3)
    Link.get(function(err, url) {
        res.redirect(url)
    })
}