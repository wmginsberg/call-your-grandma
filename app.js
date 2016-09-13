
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
console.log("USER " + user);
var port = process.env.PORT || 8080;

// Get a reference to the database service
var database = firebase.database();
var reminders = [];
var firebaseRef = database.ref('/reminders/');
// firebaseRef.once('value', function(snapshot) {
// 		  // code to handle new value.
// 		   snapshot.forEach(function(childSnapshot) {
// 			   var childData = childSnapshot.val();
// 			   reminders.push(childData);
// 			   createCron();
// 			});
// 		});
firebaseRef.once("value").then(function(data) {
		  // code to handle new value.
		   reminders.push(data);
		   console.log([data.val()]);
		   var obj = data.val();
		   var uids = [];
		   for (var prop in obj) {
			  uids.push(prop);
			  console.log(uids);
			}
		   sendNotifications(uids,[obj]);
		   // sending JSON object with uid/key/reminder
		});


function sendNotifications(uids, dataVals) {
	// for (var key in dataVals) {
	 	console.log("data vaaaals" + dataVals);
	 	// comes in as an object, but do have user ids in uids
	// }
	for (var id in uids) {
		console.log(dataVals.id);
	}
	for (var k = 0; k < dataVals.length; k++) {
		keys.push(dataVals[k].key);
		console.log("KEYS!!!      " + keys[k]);
	}
	console.log("hi");
	for( var i = 0; i < dataVals.length; i++ ) {
		console.log("DV " + dataVals[i][0]);
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
		// var cron = "* * " + dayNum + " * *";
		// var textJob = new cronJob( cron, function() {
		// 					var msg = 'Call ' + toCallName + ' at ' + toCallNum + ' today!';
		// 					client.sendMessage( { to:toTextNum, from:'+14243206951', body:msg}, function( err, data ) {});
		// 				},  null, true);

	} 
}

/*

{ HJ27ueByAceDawul3KjLLkUPtxq2: 
   { 
     '-KR_QDcsoX7supOId_Ey': {data},
     '-KR_SNs-yq2lOvdRexni': {data}
    },
  eEuoEgTuXBbnQTIDLUhTpPbcWbi1: 
   { 
     '-KR_SbiCWWyTUfQqXkBO': {data} 
   } 
}


*/
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
