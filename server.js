// require necessary packages
var express = require('express');
// var anyDB = require('any-db');
var firebase = require('firebase');
var app = express();
//var my_app = firebase.initializeApp({});

//require the Twilio module and create a REST client
var client = require('./node_modules/twilio')('ACff1ac681b33572df5f79ebfe345cc371', 'd1e91c6aabb4864a8a4d5bb7f1994ee1');

//load pages and body parser for express
app.use(express.static(__dirname + '/'));
var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

// connect the db
// var conn = anyDB.createConnection('sqlite3://callyourgrandma.db');

// Set the configuration for your app
// TODO: Replace with your project's config object
var config = {
		apiKey: "AIzaSyDfdhSOjvOuBu30RoxUT-wLEm9Sko_XMGQ",
		authDomain: "callyourgrandma-88bcd.firebaseapp.com",
		databaseURL: "https://callyourgrandma-88bcd.firebaseio.com/",
		storageBucket: ""
		};
firebase.initializeApp(config);

// Get a reference to the database service
var database = firebase.database();

var firebaseRef = database.ref();


firebaseRef.on('value', function(snapshot) {
  // code to handle new value.
   snapshot.forEach(function(childSnapshot) {
	    // key will be "fred" the first time and "barney" the second time
	   var key = childSnapshot.key();
	    // childData will be the actual contents of the child
	   var childData = childSnapshot.val();
	   sendSMS('+15165034558',childData.toCallName,childData.toCallNum);
   });
});

// database.ref().push({
// 	label: 'Call Grandma',
// 	isActive: true,
// 	isEditable: false,
// 	toCallName: 'Grandma',
// 	toCallNum: '15165034558'
// });





// // Render index
// app.get('/', function (req, res) {
//   res.render("index.html");
// });

// app.get('/view1', function (req, res) {
//   res.render("index.html");
// });

// app.get('/view2', function (req, res) {
//   var sql = 'SELECT to_text, to_call_name, to_call_num, to_call_freq FROM CallerInfo';
//   var to_text, to_call_name, to_call_num, to_call_freq;
//   var reminders = [];
//   conn.query(sql)
//   .on('row',function(row) {
//   	to_text = row.to_text;
//     to_call_name = row.to_call_name;
//     to_call_num = row.to_call_num;
//     to_call_freq = row.to_call_freq;
//   	reminders.push([to_text,to_call_name,to_call_num,to_call_freq]);
//   })
//   .on('end', function(res) {
//   	res.json(reminders);
//   });
// });


// //Send an SMS text message on submit
// app.post('/submit', function (req, res) {
// 	// res.send("Hello! " + req.body.phone);
// 	//res.send(req.body.toText + " " + req.body.toCallName + " " + req.body.toCallNum + " " + req.body.toCallFreq);

// 	// var insertQuery = conn.query('INSERT INTO CallerInfo VALUES (NULL, $1, $2, $3, $4);',[req.body.toText, req.body.toCallName, req.body.toCallNum, "3"]);
// 	// sendSMS(req.body.toText, req.body.toCallName, req.body.toCallNum);
// 	// insertQuery.on('end', function() {});

// 	database.ref().push({
// 		label: req.body.label,
// 		isActive: req.body.isActive,
// 		isEditable: req.body.isEditable,
// 		toCallName: req.body.toCallName,
// 		toCallNum: req.body.toCallNum
// 	});	

// });

// Listen on the port
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

// Send object
function sendSMS(toText,toCallName,toCallNum) {
	var msg = 'Call ' + toCallName + ' at ' + toCallNum + ' today!'; 
	client.sendMessage({
	    to: toText, // Any number Twilio can deliver to
	    from: '+14243206951', // A number you bought from Twilio and can use for outbound communication
	    body: msg// body of the SMS message

	}, function(err, responseData) { //this function is executed when a response is received from Twilio
	    if (!err) { // "err" is an error received during the request, if any
	        // "responseData" is a JavaScript object containing data received from Twilio.
	        // A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
	        // http://www.twilio.com/docs/api/rest/sending-sms#example-1
	        console.log(responseData.from); // outputs "+14506667788"
	        console.log(responseData.body); // outputs "word to your mother."
	    }
	    else {
	    	console.log(err);
	    }
	});
}
