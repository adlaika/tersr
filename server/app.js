// TODO: MOST IMPORTANT: ERROR CHECKING / REPORTING

var express = require('express')
var bodyParser = require('body-parser')
var app = express()

//ENV
var DB_HOST
var env = process.env.NODE_ENV || 'development'
if (env === 'production') {
    DB_HOST = 'tersr.5n3dcl.ng.0001.usw2.cache.amazonaws.com'
} else {
    DB_HOST = '127.0.0.1'
}

//set up db
var redis = require('redis')
var db = redis.createClient(6379, DB_HOST)
console.log('redis attempting to connect to ' + DB_HOST)
db.on('connect', function() {
    console.log('redis connected')
})
module.exports = {
    db: db,
    env: env
}

//set up Jade templating
app.engine('jade', require('jade').__express)
app.set('view engine', 'jade')

//set up views for error / 404s
app.set('views', __dirname + '/views')

// serve static files
app.use(express.static(__dirname + '/public'))

// parse request bodies (req.body)
app.use(bodyParser.urlencoded({ extended: true }))

//now that db is init, can access controllers and models
var links = require('./controllers/linksController')

//general
app.get('/', function(req, res) {
    res.render('index')
})

//link routes
// TODO: use this rule: if incoming route contains > 1 '/', it's one of my routes. Otherwise, it's a short URL and should be redirected to. NOTE: express routing can use regexp
app.get('/s/*', links.goToUrl)
app.post('/', links.addNewLink)

//404s
app.use('/*', function(req, res) {
    res.sendStatus(404)
})

//start server
var server = app.listen(3000, function () {
    var port = server.address().port;
    console.log('Server listening on port ' + port);
});


