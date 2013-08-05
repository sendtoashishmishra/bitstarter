var express = require('express');
var app = express();
express.logger();

var fs = require('fs');

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
