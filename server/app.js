var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var util = require('./helpers/util.js');
var fs = require('fs');
var morgan = require('morgan');

// ENV
var HOST;
var DB_HOST;
var env = process.env.NODE_ENV || 'development';
if (env === 'production') {
    // TODO: outsource these to env variables...in CircleCI, maybe?
    DB_HOST = 'tersr.5n3dcl.ng.0001.usw2.cache.amazonaws.com';
    HOST = 'http://52.27.205.191:3000/'
} else {
    DB_HOST = '127.0.0.1';
    HOST = 'http://localhost:3000/'
}

// set up db
var redis = require('redis');
var db = redis.createClient(6379, DB_HOST);
console.log('redis attempting to connect to ' + DB_HOST);
db.on('connect', function() {
    console.log('redis connected')
});
module.exports = {
    db: db,
    env: env,
    DB_HOST: DB_HOST,
    HOST: HOST
};

// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(__dirname + '/access.log', {flags: 'a'});

// setup the logger
app.use(morgan('combined', {stream: accessLogStream}));

// set up Jade templating
app.engine('jade', require('jade').__express);
app.set('view engine', 'jade');

// set up views
app.set('views', __dirname + '/views');

// serve static files
app.use(express.static(__dirname + '/public'));

// parse request bodies (req.body)
app.use(bodyParser.urlencoded({ extended: true }));

//now that db is init, can access controllers and models
var links = require('./controllers/linksController');

function isMyRoute (req, res, next) {
    // takes incoming route and returns true if more than one '/' present
    // for instance, '/api/addLink' -> true; /dsf3rf -> false
    var path = util.trimSlashes(req.path);
    // check for any remaining /s and attach boolean to res.locals
    // (which is automatically scoped to life of current request) before calling next matching route handler
    res.locals.isMyRoute = !!path.match('/');
    next()
}

// default index
app.get('/', function(req, res) {
    res.render('index')
});

// link logic routes
// if incoming route contains non-leading, non-trailing /s, it's one of my routes.
// Otherwise, it's a short URL and should be redirected to.
app.get('/*', isMyRoute, links.goToUrl);
app.post('/', links.addNewLink, links.renderNewLink);

// api routes
app.post('/api/link/add', debug, links.addNewLink)

//404s
app.get('/*', function(req, res) {
    res.sendStatus(404)
});

// the error handler is placed below routes; if it
// were above it would not receive errors from app.get() etc
// when passing errors, use next(new Error('error message'))
app.use(error);

// error handling middleware have an arity of 4 instead of the typical (req, res, next),
// otherwise they behave exactly like regular middleware, you may have several of them,
// in different orders etc.
function error(err, req, res, next) {
    // log it
    console.error(err.stack);

    // respond with 500 "Internal Server Error".
    res.sendStatus(500);
}

//start server
var server = app.listen(3000, function () {
    var port = server.address().port;
    console.log('Server listening on port ' + port);
});


