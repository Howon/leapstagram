var path = require("path");
var express = require('express');
var app = express();

app.get('/', function (req, res) {
  //res.send('Hello World!');
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(3000, function () {
  console.log('InstaLeap listening on port 3000!');
});
