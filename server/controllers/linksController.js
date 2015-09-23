var Link = require('../models/linksModel')
var util = require('../helpers/util.js')

function goToUrl(req, res, next) {
    // only go to short url if path is not one of my routes, else hand request to next matching handler
    if (!res.locals.isMyRoute) {
        var short = util.trimSlashes(req.path)
        Link.getLink(short, function (err, linkObj) {
            if (err) next(err)
            else if (linkObj) res.redirect(linkObj.url)
            else next()
        })
    } else next()
}

function addNewLink(req, res, next) {
    Link.addNewLink(req.body.url, function (err, message, short, url) {
        err ? next(err) : res.render('index', {link: {short: req.header('host') + '/' + short, url: url}})
    })
}

module.exports = {
    addNewLink: addNewLink,
    goToUrl: goToUrl
}