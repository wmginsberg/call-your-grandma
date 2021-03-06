
var client = require('./node_modules/twilio')('ACff1ac681b33572df5f79ebfe345cc371', 'd1e91c6aabb4864a8a4d5bb7f1994ee1');
var cronJob = require('cron').CronJob;
var express = require('express');
var bodyParser = require('body-parser');
var favicon = require('static-favicon');

var app = express();
app.use(express.static(__dirname + '/'));
app.use(favicon('favicon.ico'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  			extended: true
		}));


var firebase = require('firebase');
var config = {
		apiKey: "AIzaSyDfdhSOjvOuBu30RoxUT-wLEm9Sko_XMGQ",
		authDomain: "callyourgrandma-88bcd.firebaseapp.com",
		databaseURL: "https://callyourgrandma-88bcd.firebaseio.com/",
		storageBucket: ""
		};
firebase.initializeApp(config);

var user = firebase.auth().currentUser;
var port = process.env.PORT || 8080;

// Get a reference to the database service
var database = firebase.database();
var reminders = [];
var firebaseRef = database.ref('/reminders/');

// firebaseRef.on("value", function(data) {
//   // code to handle new value.
//    var today = new Date();
//    var obj = data.val();
//    var uids = [];
//    for (var prop in obj) {
// 	  uids.push(prop);
// 	  for (var o in obj[prop]) {
// 	    if (obj[prop][o]['dayNum'] == today.getDate()) {
// 	    	sendNotification(obj[prop][o]);

// 	    }
// 	  }
// 	}
// });

function sendTodaysTexts() {
	firebaseRef.once("value").then(function(data) {
	  // code to handle new value.
	   var today = new Date();
	   var obj = data.val();
	   var uids = [];
	   for (var prop in obj) {
		  uids.push(prop);
		  for (var o in obj[prop]) {
		    if (obj[prop][o]['dayNum'] == today.getDate()) {
		    	sendNotification(obj[prop][o]);
		    }
		  }
		}
	});
}


function sendNotification(data) {
	console.log("sendNotifications");
	var isActive = data['isActive'];
	// if (!isActive) {
		var toCallName = data['toCallName'];//reminders[i]['toCallName'];
		var toCallNum = data['toCallNum'];//reminders[i]['toCallNum'];
		var toTextNum = data['label'];//reminders[i]['label'];
		console.log(toTextNum);
		var msg = 'Call ' + toCallName + ' at ' + toCallNum + ' today!';
		console.log(msg);
		client.sendMessage( { to:toTextNum, from:'+14243206951', body:msg}, function( err, data ) {});			
	//}
}


function createMyCron(data) {
//	for( var i = 0; i < reminders.length; i++ ) {
		var dayNum = data.dayNum;//reminders[i]['dayNum'];
		var toCallName =  data.toCallName;//reminders[i]['toCallName'];
		var toCallNum = data.toCallNum;//reminders[i]['toCallNum'];
		var toTextNum = data.label;//reminders[i]['label'];
		var cron = "* * " + dayNum + " * *";
		var textJob = new cronJob( cron, function() {
							var msg = 'Call ' + toCallName + ' at ' + toCallNum + ' today!';
							client.sendMessage( { to:toTextNum, from:'+14243206951', body:msg}, function( err, data ) {});
						},  null, true);

//	} 
}

app.get('/', function (req, res) {
  res.render("index.html");
});

var server = app.listen(port /*3000*/, function() {
  console.log('Listening on port '+ port || 8085);//server.address().port);
});

sendTodaysTexts();
