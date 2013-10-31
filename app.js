var express = require('express') // use express (web-framework) module
  , path = require('path') // use path (provides methods to work with file and url paths) module
  , MongoClient = require('mongodb').MongoClient
  , ObjectID = require('mongodb').ObjectID
  , app = express() // create application object
  , db; // create db variable to store db connection

/**
 * Initializes database connection via connection string
 * @param {Error} err Error object, persists if there is an error occurred, while connecting to database
 * @param {Object} conn Connection object, persists if there is no error
 */
MongoClient.connect('mongodb://localhost:27017/wiat', function (err, conn) {
    if (err) { // if error throw it and close
      throw err;
    } else {
      db = conn;
    }
  }
);

app.use(express.bodyParser()); // use express.bodyParser() middleware to parse POST-requests body
app.use(express.static(path.join(__dirname, 'client'))); // use express.static() middleware to serve static files
// path.join(__dirname, 'client') is static-files directory, which is equal to subdir 'client' of current directory

/**
 * POST-request to url /students/insert/ handler
 * @param {Object} req Express.js request object
 * @param {Object} res Express.js response object
 */
app.post('/students/insert/', function(req, res) {
  db.collection('students').insert({ name : req.body.name }, function(err, items) {
    res.json(items[0]);
  });
});

/**
 * POST-request to url /students/remove/ handler
 * @param {Object} req Express.js request object
 * @param {Object} res Express.js response object
 */
app.post('/students/remove/', function(req, res) {
  db.collection('students').remove({ _id : new ObjectID(req.body.id) }, function(err, count) {
    res.json(count);
  });
});

/**
 * POST-request to url /students/update/ handler
 * @param {Object} req Express.js request object
 * @param {Object} res Express.js response object
 */
app.post('/students/update/', function(req, res) {
  db.collection('students').update({ _id : new ObjectID(req.body.id) }, { name : req.body.name }, function(err, count) {
    res.json(count);
  });
});

/**
 * GET-request to url /students/ handler
 * @param {Object} req Express.js request object
 * @param {Object} res Express.js response object
 */
app.get('/students/', function(req, res) {
  db.collection('students').find().toArray(function(err, items) {
    res.json(items);
  });
});

/**
 * POST-request to url /attendance/save/ handler
 * @param {Object} req Express.js request object
 * @param {Object} res Express.js response object
 */
app.post('/attendance/save/', function(req, res) {
  var attendance = {
    // create attendance object
    _id : req.body.date,
    present : []
  };
  if (req.body.present instanceof Array) {
    req.body.present.forEach(function (studentId) {
      attendance.present.push(new ObjectID(studentId));
    });
  }
  db.collection('attendance').save(attendance, function(err, item) {
    res.json(item);
  });
});

/**
 * GET-request to url /attendance/ handler
 * @param {Object} req Express.js request object
 * @param {Object} res Express.js response object
 */
app.get('/attendance/', function(req, res) {
  db.collection('attendance').findOne({ _id : req.query.date }, function(err, item) {
    res.json(item || { present : [] }); // if there is no attendance info, return dummy object with empty present array
  });
});

app.listen(8000); // start server on 8000 port