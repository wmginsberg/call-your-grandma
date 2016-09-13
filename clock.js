
var client = require('./node_modules/twilio')('ACff1ac681b33572df5f79ebfe345cc371', 'd1e91c6aabb4864a8a4d5bb7f1994ee1');
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
//var reminders = [];

var firebaseRef = database.ref('/reminders/-KRKZ7UN1ICCSN0Rg4Nc');

firebaseRef.once("value").then(function(data) {
		  // code to handle new value.
		   reminders.push(data);
		   console.log(data);
		   console.log(data.val());
		   sendNotifications([data.val()]);
		});


function sendNotifications(dataVals) {
	console.log("hi");
	for( var i = 0; i < dataVals.length; i++ ) {
		console.log("DV " + dataVals[i]);
		var today = new Date();
		var dayNum = dataVals[i].dayNum;//reminders[i]['dayNum'];
		console.log("element day number " + dayNum);
		console.log("today's date " + today.getDate());
		console.log("dataVals " + dataVals[i]);
		if (dayNum == today.getDate()) {
			var toCallName = dataVals[i].toCallName;//reminders[i]['toCallName'];
			var toCallNum = dataVals[i].toCallNum;//reminders[i]['toCallNum'];
			var toTextNum = dataVals[i].label;//reminders[i]['label'];
			console.log(toTextNum);
			var msg = 'Call ' + toCallName + ' at ' + toCallNum + ' today!';
			console.log(msg);
			client.sendMessage( { to:toTextNum, from:'+14243206951', body:msg}, function( err, data ) {});			
		}

	} 
}
