#! /app/bin/node

var client = require('./node_modules/twilio')('ACff1ac681b33572df5f79ebfe345cc371', 'd1e91c6aabb4864a8a4d5bb7f1994ee1');
var firebase = require('firebase');
var config = {
		apiKey: "AIzaSyDfdhSOjvOuBu30RoxUT-wLEm9Sko_XMGQ",
		authDomain: "callyourgrandma-88bcd.firebaseapp.com",
		databaseURL: "https://callyourgrandma-88bcd.firebaseio.com/",
		storageBucket: ""
		};
firebase.initializeApp(config);

var user = firebase.auth().currentUser;

// Get a reference to the database service
var database = firebase.database();
var firebaseRef = database.ref('/reminders/');

function sendTodaysTexts() {
	console.log("STT-" + firebaseRef);
	firebaseRef.once("value").then(function(data) {
	  // code to handle new value.
	   console.log("inside fb call");
	   var today = new Date();
	   var obj = data.val();
	   var uids = [];
	   for (var prop in obj) {
		  uids.push(prop);
		  console.log("uid " + uids);
		  for (var o in obj[prop]) {
		  	console.log("today's date " + today.getDate());
		    if (obj[prop][o]['dayNum'] == today.getDate()) {
		    	console.log('found one for today');
		    	sendNotification(obj[prop][o]);
		    }
		  }
		}
	}, 
	function(error) {
		console.error(error);
	});
	console.log("errrrrror");
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


function sayHello() {
  console.log('Hello');
  sendTodaysTexts();
  console.log('Goodbye');
}

sayHello();


process.exit();