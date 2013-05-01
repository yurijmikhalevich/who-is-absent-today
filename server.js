var express = require('express')
    , app = express()
    , path = require('path');


app.use(express.static(path.join(__dirname, 'client')));

app.get('/', function(req, res) {
    res.send('Hello, World!');
});

app.listen(3000);
