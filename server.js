var express = require('express')
    , path = require('path')
    , MongoClient = require('mongodb').MongoClient
    , app = express()
    , db;

MongoClient.connect('mongodb://localhost:27017/wiat', function (err, conn) {
        if (err) {
            console.log(err);
            throw err;
        }
        db = conn;
    }
);

app.use(express.static(path.join(__dirname, 'client')));

app.post('/students/insert/', function(req, res) {
    db.collection('students').insert({'name' : req.query.name}, {'safe' : true}, function(err, items) {
        res.send(items[0]);
    });
});

app.post('/students/remove/', function(req, res) {
    db.collection('students').findAndRemove({'_id' : req.query.id}, [['_id', 'asc']], function(err, items) {
        res.send(items[0]);
    });
});

app.post('/students/update/', function(req, res) {
    db.collection('students').update({'_id' : req.query.id}, {'name' : req.query.name}, function(err, count){
        res.send(count);
    });
});

app.get('/students/', function(req, res) {
    db.collection('students').find().toArray(function(err, items) {
        res.send(items);
    });
});

app.listen(3000);
