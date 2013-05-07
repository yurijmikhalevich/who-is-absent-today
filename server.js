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

app.use(express.bodyParser());
app.use(express.static(path.join(__dirname, 'client')));

app.post('/students/insert/', function(req, res) {
  db.collection('students').insert({ name : req.body.name }, { safe : true }, function(err, items) {
    res.send(items[0]);
  });
});

app.post('/students/remove/', function(req, res) {
  db.collection('students').findAndRemove({ _id : new ObjectId(req.body.id) }, [['_id', 'asc']], { safe : true },
    function(err, item) {
      res.send(item);
    }
  );
});

app.post('/students/update/', function(req, res) {
  db.collection('students').update({ _id : new ObjectId(req.body.id) }, { name : req.query.name },
    { safe : true },
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

app.post('/attendance/save/', function(req, res) {
  var attendance = {
    _id : req.body.date,
    present : []
  };
  var splitted_present = req.body.present.split(',');
  for (var i = 0; i < splitted_present.length; ++i) {
    attendance.present.push(new ObjectId(splitted_present[i]));
  }
  db.collection('attendance').save(attendance, { safe : true }, function(err, items) {
    res.send(items.toString());
  });
});

app.get('/attendance/', function(req, res) {
  db.collection('attendance').findOne({ _id : req.query.date }, function(err, item) {
    res.send(item || { present : [] });
  });
});

app.listen(8000);