var blah;
var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var app = express();
var engine = require('ejs-locals');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');

app.set('port', process.env.PORT || 3000);
app.engine('ejs', engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended : true
}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());
http.createServer(app).listen(app.get('port'), function() {
          console.log('Open browser to http://localhost:'
              + app.get('port'));
});
app.use(session({
  secret : 'sup'
}));

app.use('/', routes);


/*
var path = require('path');
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('cookie-session');
var app = express();
var t = require('twilio');
// var readline = require('readline');
var fs = require('fs');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');
app.set('port', process.env.PORT || 3000);

app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({secret: 'codeweekend'}));
app.use(express.static(path.join(__dirname, 'public')));

var routes = require('./routes');
app.use('/', routes);

var accountSid = 'ACb2bb038c0b235b0dba5555aedd76d312';
var authToken = '3754198e5cc4d0231ef4ba57ea9ee06d';
var client = require('twilio')(accountSid, authToken);



app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Handle any errors by rendering the error page
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    errorMessage: err.message,
    error: app.get('env') === 'development' ? err : {}
  });
});

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
*/