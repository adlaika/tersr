var Link = require('../models/linksModel')

exports.add = function(req, res) {
    Link.add(req.body.url, function(err, message, short, url) {
        res.render('index', {link: {short: short, url: url}})
    })
}

exports.redirect = function(req, res) {
    var short = req.path.substring(3)
    Link.get(short, function(err, linkObj) {
        console.log("linkObj: ", linkObj)
        res.redirect(linkObj.url)
    })
}