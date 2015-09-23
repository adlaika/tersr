var Link = require('../models/linksModel')
var util = require('../helpers/util.js')

var addNewLink = function(req, res, next) {
    Link.addNewLink(req.body.url, function (err, message, short, url) {
        err ? next(err) : res.render('index', {link: {short: req.header('host') + '/' + short, url: url}})
    })
}

var goToUrl = function(req, res, next) {
    // only go to short url if path is not one of my routes, else hand request to next matching handler
    if (!res.locals.isMyRoute) {
        var short = util.trimSlashes(req.path)
        Link.getLink(short, function (err, linkObj) {
            err ? next(err) : res.redirect(linkObj.url)
        })
    } else next()
}

module.exports = {
    addNewLink: addNewLink,
    goToUrl: goToUrl
}