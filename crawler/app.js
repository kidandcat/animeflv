var childProcess = require('child_process');
var phantomjs = require('phantomjs');
var binPath = phantomjs.path;
var http = require('http');


http.createServer(function (req, res) {
  var animes = childProcess.execFileSync(binPath, ['./crawler.js', 'http://animeflv.net/'], {encoding: 'utf8'});
  res.writeHead(200, {'Content-Type': 'text/json'});
  res.end(animes.split('RETURN:')[1]);
}).listen(88);

http.createServer(function (req, res) {
  var animes = childProcess.execFileSync(binPath, ['./crawlerStars.js', 'http://animeflv.net/'], {encoding: 'utf8'});
  res.writeHead(200, {'Content-Type': 'text/json'});
  res.end(animes.split('RETURN:')[1]);
}).listen(89);