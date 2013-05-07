var express = require('express') //use express (web-framework) module
  , path = require('path') //use path (provides methods to work with file and url paths) module
  , MongoClient = require('mongodb').MongoClient
  , ObjectID = require('mongodb').ObjectID
  , app = express() //create application object
  , db; //create db variable to store db connection

MongoClient.connect('mongodb://localhost:27017/wiat', function (err, conn) {
    //initialize db connection via connection string
    if (err) {
      //if error log it to console, throw it and close
      console.log(err);
      throw err;
    }
    //if no error, store connection to db variable
    db = conn;
  }
);

app.use(express.bodyParser()); //use express.bodyParser() middleware to parse POST-requests body
app.use(express.static(path.join(__dirname, 'client'))); //use express.static() middleware to serve static files
//path.join(__dirname, 'client') is static-files directory, which is equal to subdir 'client' of current directory

app.post('/students/insert/', function(req, res) {
  //add POST-request '/students/insert' handler
  db.collection('students').insert({ name : req.body.name }, { safe : true }, function(err, items) {
    //if safe is false (default) callback (function(err, items)) is fired immediately and thus doesn’t make much sense
    res.send(items[0]);
  });
});

app.post('/students/remove/', function(req, res) {
  db.collection('students').findAndRemove({ _id : new ObjectID(req.body.id) }, [['_id', 'asc']], { safe : true },
    //[['_id', 'asc']] is field and sort method
    function(err, item) {
      res.send(item);
    }
  );
});

app.post('/students/update/', function(req, res) {
  db.collection('students').update({ _id : new ObjectID(req.body.id) }, { name : req.body.name },
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
    //create attendance object
    _id : req.body.date,
    present : []
  };
  if (req.body.present) {
    //if present argument persist (not null and not undefined) and not empty
    var splitted_present = req.body.present.split(',');
    for (var i = 0; i < splitted_present.length; ++i) {
      attendance.present.push(new ObjectID(splitted_present[i]));
    }
  }
  db.collection('attendance').save(attendance, { safe : true }, function(err, items) {
    res.send(items.toString());
  });
});

app.get('/attendance/', function(req, res) {
  db.collection('attendance').findOne({ _id : req.query.date }, function(err, item) {
    res.send(item || { present : [] }); //if there is no attendance info, return dummy object with empty present array
  });
});

app.listen(8000); //start server on 8000 port