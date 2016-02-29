var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var http = require('http');
var fs = require('fs');
var https = require('https');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var toobusy = require('toobusy-js');
var routes = require('./routes/index');

var privateKey = fs.readFileSync('/etc/letsencrypt/live/galax.be/privkey.pem', 'utf8');
var certificate = fs.readFileSync('/etc/letsencrypt/live/galax.be/cert.pem', 'utf8');
var credentials = {key: privateKey, cert: certificate};

var app = express();

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

//httpServer.listen(80);
httpsServer.listen(443);

//toobusy.maxLag(40);
//toobusy.interval(700);
app.use(function(req, res, next) {
  if (toobusy()) {
    res.send(503, "I'm busy right now, sorry.");
  } else {
    next();
  } 
});

app.use(function(req, res, next) {
  if (req.protocol != 'https') {
    res.redirect(301, "https://" + req.headers["host"] + req.url);
  } else {
    next();
  } 
});


// view engine setup
/*app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');*/

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.sendFile(__dirname + 'public/html/error.html');
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.sendFile(__dirname + '/public/html/error.html');
});

module.exports = app;
