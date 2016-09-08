
var client = require('./node_modules/twilio')('ACff1ac681b33572df5f79ebfe345cc371', 'd1e91c6aabb4864a8a4d5bb7f1994ee1');
var cronJob = require('cron').CronJob;
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
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

// Get a reference to the database service
var database = firebase.database();
// var numbers = ['+15165034558'];
var reminders = [];

var firebaseRef = database.ref('/reminders/');
firebaseRef.once('value', function(snapshot) {
		  // code to handle new value.
		   snapshot.forEach(function(childSnapshot) {
			    // key will be "fred" the first time and "barney" the second time
			    // childData will be the actual contents of the child
			   var childData = childSnapshot.val();
			   reminders.push(childData);
			   // console.log(reminders);
			   // console.log("Call " + childData['toCallName'] + ' at ' + childData['toCallNum'] + ' on ' + childData['date']);
			  // sendSMS('+15165034558',childData.toCallName,childData.toCallNum);
			  createCron();
			});
		});

// function createCron() {
// console.log(reminders);
// 	for( var i = 0; i < reminders.length; i++ ) {
// 		console.log("inside reminders loop");
// 		var cronArray = ['*','*','*','*','*','*']; 
// 		var date = reminders[i]['date'];
// 		var datePieces = date.split(' ');

// 		var time = reminders[i]['time'];
// 		var ampm = time.substring(time.length-2,time.length);
// 		var timePieces = time.substr(0,time.length-2).split(':');
// 		var hour = timePieces[0];
// 		var mins = timePieces[1].replace(/\s/g, '');;
// 		var ap = ampm.slice(0,1)
		
// 		if (ap.localeCompare("P") == 0) {			
// 			hour = parseInt(hour) + 12; 
// 			timePieces[0] = hour.toString();
// 		}

// 		cronArray[5] = datePieces[2]; //year
// 	  //cronArray[4] = staying as * because day of week is not being counted 	
// 		cronArray[3] = datePieces[0].slice(0,3); //month 
// 		cronArray[2] = datePieces[1].slice(0,datePieces[1].length-1); //day of month
// 		cronArray[1] = timePieces[0]; // hour
// 		cronArray[0] = mins; // minutes

// 		var cronCode = cronArray.join(' ');
// 		console.log(">>> CRON CODE " + cronCode);
// 		var textJob = new cronJob( cronCode, function() {
// 							var msg = 'Call ' + reminders[i]['toCallName'] + ' at ' + reminders[i]['toCallNum'] + ' today!';
// 							  client.sendMessage( { to:numbers[0], from:'+14243206951', body:msg}, function( err, data ) {
// 							    console.log( data.body );
// 							  });
// 						},  null, true);

// 	} 
// }

function createCron() {
console.log(reminders);
	for( var i = 0; i < reminders.length; i++ ) {
		var dayNum = reminders[i]['dayNum'];
		var toCallName = reminders[i]['toCallName'];
		var toCallNum = reminders[i]['toCallNum'];
		var toTextNum = reminders[i]['label'];
		var cron = "* * " + dayNum + " * *";
		var textJob = new cronJob( cron, function() {
							var msg = 'Call ' + toCallName + ' at ' + toCallNum + ' today!';
							client.sendMessage( { to:toTextNum, from:'+14243206951', body:msg}, function( err, data ) {});
						},  null, true);

	} 
}




var server = app.listen(3000, function() {
  console.log('Listening on port %d', server.address().port);
});
