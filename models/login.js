
var helpModel = require('../models/helperModel');
var helpFunc = require('../helper/helperFunctions');
const constants = global.constants;


console.log('core model loaded');

// ################################################################
// ########## 	Get User address and address list 	###############
// ################################################################
module.exports.login = function (user_name, password, callback) {

	console.log("Login Model")
	
	var response = false;
	var crypted_pass = helpFunc.md5Encryption(password)
	console.log(crypted_pass)
	
	var query = "SELECT id from users where username = '" + user_name + "' AND password = '" + crypted_pass +"'";
	

	console.log(query)
	helpModel.selectQuery("login", query).then(results => {
		console.log("results : ",results)
		if (results.length > 0) {
			console.log(results)
			// Assigning the values according to the address type
			// Return true
			response = true;
		}
		callback(null, response);
	}).catch(error => {
		callback(error, null);
	});
	
};


module.exports.registration = function (data, callback) {
	console.log('registration model');
	var datetime = helpFunc.getDateTime()
	var table = "users"
	let results_len = 0
	var fields = new Array()
	fields["username"] = data.uname
	fields["app_pin"] = helpFunc.md5Encryption(data.password)
	fields["email"] = data.email
	fields["mobile_number"] = data.mobile
	fields["created"] = datetime
	fields["updated"] = datetime

	// Check username already taken or not
	let query = "SELECT username from users where username = '"+ fields.username +"'"
	helpModel.selectQuery("registration", query).then(results => {
		console.log("results : ", results)
		results_len = results.length
		if (results_len == 0) {
			// Insert into users table
			return helpModel.insertQuery("registration", table, fields, "uid")
		}
	}).then(results1 => {
		if (results_len > 0) {
			callback("Username Already Existed", null);
		}else{
			callback(null, results1);
		}
	}).catch(error => {
		callback(error, null);
	});

}

module.exports.dashboardData = function (callback) {
	console.log("Dashboard Model ------------");
	var results = {}

	date = helpFunc.getDateTime	()
	console.log("date1 :  ", date);
	var today = new Date();
	var in_a_week = new Date().setDate(today.getDate('yyyy: mm: ') - 1);

	console.log("weeek", in_a_week / 1000 | 0);
	



}

module.exports.allUsers = function (callback) { 
	var query = "SELECT id,username from  users where is_active='true'"

  helpModel.selectQuery("allUsers", query).then(results => {
        callback(null, results);
  
  }).catch(error => {
    callback(error, null);
  });

}


module.exports.usersAvailbale = function (data, callback) { 
	var start_time = data.start_time;
  var end_time = data.end_time;
  var uids = data.user_list


	var query = "SELECT count(meetting.id) > 0 as exist FROM meetting right join meeting_users on meetting.id =meeting_users.meeting_id WHERE ( meetting.start_time between '"+start_time+" ' AND ' "+end_time+" ') or (meetting.end_time between '"+end_time+"' AND ' "+start_time+" ') AND meeting_users.user_id IN (" + uids + ")"

	console.log(query)
  helpModel.selectQuery("usersAvailbale", query).then(results => {
        console.log("-108--------------")


        console.log(results)
        callback(null, results);
  
  }).catch(error => {
    callback(error, null);
  });

}

module.exports.insertNewMeeting = function (data, callback) { 
	var start_time = data.start_time;	
  var end_time = data.end_time;
  var uids = data.user_list


	fields["title"] = "insert1"
  fields["description"] = "insert2"
  fields["created_by"] = 1
  fields["start_time"] = data.start_time;
  fields["end_time"] = data.end_time

  // Insert into api_data table
  helpModel.insertQuery("insertNewMeeting", "meetting", fields, "id").then(results => {
    callback(null, results);
  }).catch(error => {
    callback(error, null);
  });
}

