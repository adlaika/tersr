var db = require('../app').db;

var set = function(key, value, cb) {
    if (typeof cb !== 'function') throw new TypeError(cb + ' is not a function!');
    db.set(key, value, function(err, message) {
        cb(message);
    });
};

var getUniqueId = function(cb) {
    if (typeof cb !== 'function') throw new TypeError(cb + ' is not a function!');
    db.incr('linkCounter', function(err, reply) {
        cb(err, reply);
    });
};

var addNewLink = function(url, cb) {
    if (typeof url !== 'string') throw new TypeError(cb + ' is not a string (url)!');
    if (typeof cb !== 'function') throw new TypeError(cb + ' is not a function!');
    getUniqueId(function(err, id) {
        if (id) {
            //set key as "link:" + id to differentiate from other types, like "users"
            var linkKey = 'link:' + id;
            //save hashmap of link obj
            db.hmset(linkKey, {
                'url': url,
                'id': id
            }, function(err, message){
                //convert id to base36--this will be our short url
                var short = id.toString(36);
                cb(err, message, short, url);
            })
        }
    })
};

var getLink = function(short, cb) {
    if (typeof cb !== 'function') throw new TypeError(cb + ' is not a function!');
    //convert base36 back to base10 so we can retrieve record at id
    var linkId = parseInt(short, 36);
    var linkKey = 'link:' + linkId;
    db.hgetall(linkKey, function(err, linkObj) {
        cb(err, linkObj);
    });
};

module.exports = {
    set: set,
    getUniqueId: getUniqueId,
    addNewLink: addNewLink,
    getLink: getLink
};