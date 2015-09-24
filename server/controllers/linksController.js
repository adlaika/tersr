var Link = require('../models/linksModel');
var util = require('../helpers/util.js');

function goToUrl(req, res, next) {
    // only go to short url if path is not one of my routes, else hand request to next matching handler
    if (!res.locals.isMyRoute) {
        var short = util.trimSlashes(req.path);
        Link.getLink(short, function (err, linkObj) {
            // pass err OR redirect to short link OR pass to next route handler
            if (err) next(err);
            else if (linkObj) res.redirect(linkObj.url);
            else next()
        })
    } else next()
}
//adds new link and saves to res.locals. DOES NOT SEND RESPONSE.
function addNewLink(req, res, next) {
    var short = req.header('host') + '/' + short;
    Link.addNewLink(req.body.url, function (err, message, short, url) {
        if (err) next(err);
        else {
            res.locals.newLink = {'short': req.header('host') + '/' + short, 'url': url};
            next();
        }
    });
}
function renderNewLink (req, res) {
    res.render('index', { link: res.locals.newLink })
}
function returnNewLink (req, res) {
    res.send(res.locals.newLink);
}
module.exports = {
    addNewLink: addNewLink,
    goToUrl: goToUrl,
    renderNewLink: renderNewLink,
    returnNewLink: returnNewLink
};