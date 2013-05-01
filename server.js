var express = require('express')
    , path = require('path')
    , MongoClient = require('mongodb').MongoClient
    , ObjectId = require('mongodb').ObjectID
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
    db.collection('students').findAndRemove({'_id' : ObjectId(req.query.id)}, [['_id', 'asc']], {'safe' : true},
        function(err, item) {
            res.send(item);
        }
    );
});

app.post('/students/update/', function(req, res) {
    db.collection('students').update({'_id' : ObjectId(req.query.id)}, {'name' : req.query.name},
        {'safe' : true},
        function(err, count) {
            res.send(count.toString());
        }
    );
});

app.get('/students/', function(req, res) {
    db.collection('students').find().toArray(function(err, items) {
        res.send(items);
    });
});

//Also we should store and show attendance, there are next methods for that:
//
//    [POST] /attendance/save/?date=<ISO-format-wihout-time>&present=<student1_id>,<student2_id> (all checked students in list)
//    [GET] /attendance/[?date=<ISO-format-withou-time>] (if no date, will be used current day). Response will be in next format: ["<student1_id>", "<studnet2_id>, …].

app.listen(3000);
