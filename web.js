var express = require('express')
  , fs = require('fs');

var app = express.createServer(express.logger());
app.use(express.static(__dirname + '/assets'));

app.get('/', function (req, res) {
  // async is always better
  fs.readFile('index.html', function (err, text) {
    res.setHeader('Content-Type', 'text/html');
    res.end(text);
  });
});

var port = process.env.PORT || 8080;
app.listen(port, function () {
  console.log("Listening on %s...", port);
});
