var Link = require('../models/linksModel')

var addNewLink = function(req, res, next) {
    Link.addNewLink(req.body.url, function (err, message, short, url) {
        err ? next(err) : res.render('index', {link: {short: req.header('host') + '/' + short, url: url}})
    })
}

var goToUrl = function(req, res, next) {
    // only go to short url if path is not one of my routes, else hand request to next matching handler
    if (!res.locals.isMyRoute) {
        var short = trimSlashes(req.path)
        Link.getLink(short, function (err, linkObj) {
            err ? next(err) : res.redirect(linkObj.url)
        })
    } else next()
}

function trimSlashes (path) {
    if (path[path.length - 1] === '/') {
        path = path.substring(0, path.length - 1)
    }
    if (path[0] === '/') {
        path = path.substring(1)
    }
    return path
}

module.exports = {
    addNewLink: addNewLink,
    goToUrl: goToUrl
}