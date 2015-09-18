var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var dbUri = 'mongodb://localhost:27017/tersr'
var monk = require('monk')

//set up Jade templating
app.engine('jade', require('jade').__express)
app.set('view engine', 'jade')

//set up views for error / 404s
app.set('views', __dirname + '/views')

// serve static files
app.use(express.static(__dirname + '/public'))

// parse request bodies (req.body)
app.use(bodyParser.urlencoded({ extended: true }))

//connect to MongoDb
var db = monk(dbUri)
//export must occur before route registration
module.exports = {
    db: db
}

////test data
var coll = db.get('links')
coll.drop()
coll.insert({name: 'bob'})
coll.insert({name: 'jim'})
coll.insert({name: 'terry'})
coll.insert({name: 'giorno'})
coll.find({}, function(err, docs) {
    console.log(docs)
})

//now that db is init, can access controllers and models
var links = require('./controllers/linksController')

//general
app.get('/', function(req, res) {
    res.redirect('/links')
})

//link routes
app.get('/links', links.view)
app.post('/links', links.create)


//start server
app.listen(3000, function() {
    console.log('Listening on port 3000...')
})


