var Link = require('../models/linksModel')

var addNewLink = function(req, res) {
    Link.addNewLink(req.body.url, function(err, message, short, url) {
        res.render('index', {link: {short: short, url: url}})
    })
}

var goToUrl = function(req, res) {
    var short = req.path.substring(3)
    Link.getLink(short, function(err, linkObj) {
        console.log("linkObj: ", linkObj)
        res.redirect(linkObj.url)
    })
}

module.exports = {
    addNewLink: addNewLink,
    goToUrl: goToUrl
}