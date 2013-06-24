var http = require('http');
var mongoose = require('mongoose');
var express = require('express');

var app = express();
var db;

var config = {
	"USER" : "",
	"PASS" : "",
	"HOST" : "127.0.0.1",
	"PORT" : "27017",
	"DATABASE" : "mydb"
};

var dbPath = "mongodb://" + config.USER + ":" + config.PASS + "@" + config.HOST + ":" + config.PORT + "/" + config.DATABASE;

var standardGreeting = 'Hello World!';

var greetingSchema = new mongoose.Schema({
	sentence : String
});

var Greeting = mongoose.model('Greeting', greetingSchema);

db = mongoose.connect(dbPath);

function isEmptyObject(obj) {
	return !Object.keys(obj).length;
}

mongoose.connection.once('open', function() {
	var greeting;
	Greeting.count({}, function(err, c) {
		console.log('A. Count is ' + c);
	});

	Greeting.find(function(err, greetings) {
		//console.log('greetings :' + greetings);
		//console.log('!greetings :' + !greetings);
		//console.log('isEmptyObject(greetings) :' + isEmptyObject(greetings) );
		
//		if (!greetings) {      -  Commented because empty object returned as true
		if (isEmptyObject(greetings)) {
			greeting = new Greeting({
				sentence : standardGreeting
			});
			greeting.save();
			console.log('New Greeting saved');
		} else {
			console.log('Greeting found');
		}
	});
	
	Greeting.count({}, function(err, c) {
		console.log('B. Count is ' + c);
	});
	
});

app.get('/', function(req, res) {
	Greeting.findOne(function(err, greeting) {
		if (err) {
			console.log('Error: ' + err);
		}
		if (greeting) {
			res.send(greeting.sentence);
		} else {
			res.send('Not Found');
		}
	});
});

app.use(function(err, req, res, next) {
	if (req.xhr) {
		res.send(500, 'Something went wrong!');
	} else {
		next(err);
	}
});

console.log('Starting the Express (NodeJS) Web Server');
app.listen(8080);
console.log('Listening on port 8080');