var express = require('express')
var bodyParser = require('body-parser')
var app = express()

//ENV
exports.env = process.env.NODE_ENV || 'development'

//set up db
var redis = require('redis')
var db = redis.createClient()
db.on('connect', function() {
    console.log('redis connected')
})
//if linkCounter doesn't exist, create it
db.exists('linkCounter', function(error, exists) {
    if(error) {
        console.log('ERROR: ', error);
    }
    //otherwise exists will be available, and we can do something with it
    else if(!exists) {
        db.set('linkCounter', 0);
    };
});
exports.db = db;

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
app.get('/s/*', links.goToUrl)
app.post('/', links.addNewLink)


//start server
app.listen(3000, function() {
    console.log('Listening on port 3000...')
})


