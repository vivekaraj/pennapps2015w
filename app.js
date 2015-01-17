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

setInterval(function() {
	fs.readFile('data/time.txt', function(err,data) {
		var date = new Date();
		var hours = date.getHours().toString();
		var minutes = date.getMinutes().toString();

		if(hours.length!=2) hours = "0".concat(hours);
		if(minutes.length!=2) minutes = "0".concat(minutes);

		var time = hours.concat(':').concat(minutes);
		var array = data.toString().split("\n");

		console.log(array);

		for(i in array) {
			if(array[i]==time) {
				var fs2 = require('fs');
				fs2.readFile('data/numbers.txt', function(err,data) {
					var array2 = data.toString().split("\n");
					number = "+1".concat(array2[i]);
					client.calls.create({
					    to: number,
					    from: "+18184854928",
					    url: 'http://twimlbin.com/external/37f4e51597e60781' // need better recording
					}, function(err) {
					    console.log(err)
					});
				});
			
				console.log("this has worked");
			}	
		}
	});
}, 60000);

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