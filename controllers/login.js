var loginModel = require('../models/login');


module.exports.index = function (req, res, next) {
	// console.log("Host :", req)
	// console.log("Client Host :", req.headers.origin)
	// console.log("Ip : ", req.connection.remoteAddress);

	var data = { title: 'NodeJS' };
	if (req.header.error_msg) {
		data.error_msg = true;
		req.header.error_msg = false;
	}

	if (req.session.auth == true) {
		res.redirect('/dashboard');
		return;
	}

	//req.session.auth = false; //reset the auth user
	//req.session.username = ''; //reset the auth user

	//reset the all session variable
	req.session.regenerate(function (err) {
		// will have a new session here
	})

	if (req.session.auth) {
		data.auth = true;
	}
	//setting layout
	data.layout = 'blankLayout.hbs'
	res.render('index', data);
}

module.exports.login = function(req, res,next){
	console.log('Login Controller Accessed! ', req.body);
  	if(req.method == 'GET'){
			res.send('Can\'t get /login');
			res.end();
  	}else{
		var username = req.body.username;
		var password = req.body.password;

		if (!username || !password) {
			req.header.error_msg = true;
			res.redirect('/');
			return;
		}

		loginModel.login(username, password, function (error, response) {
			if (error) {
				req.header.error_msg = true;
				res.redirect('/');
				return;
			}

			if (response) {
				res.cookie('username', username)
				req.session.auth = true;
				console.log("Suscess fully login")
				// req.header.username = username;
				req.session.username = username;
				res.redirect('/dashboard');
			} else {
				req.header.error_msg = true;
				// res.status(400);
				res.redirect('/');
			}
		});
  	}	
}

module.exports.home = function(req, res,next){
	var data = {}
	// data.layout =  'newLayout'
	// console.log("Home Controller")
	// console.log(req.session.username)
	data.name = req.session.username
	res.render('home',data)
}

module.exports.dashboard = function (req, res, next) {
	var data = {}
	console.log("dashboard Controller")
	data.name = req.session.username
	res.render('dashboard', data);

	// loginModel.dashboardData(function (error, response) {
	// 	// if (Object.keys(response).length) {
	// 		data.response = response;
	// 		// console.log("ctrl dashboard:  ",data)
	// 		res.render('dashboard', data);
	// 	// }
	// });

	// console.log("dashboard", data)
	// res.end(req.session.username)
}


module.exports.logout = function (req, res, next) {
	req.session.regenerate(function (err) {
		// will have a new session here
	})
	res.redirect('/');
}

module.exports.checkAuthentication = function (req, res, next) {
	console.log('checkAuthentication Middleware ', req.session.auth);
	if (req.session.auth != true) {
		res.redirect('/');
		return;
	}else{
		next()
	}
}


module.exports.logout = function (req, res, next) {
	req.session.regenerate(function (err) {
		// will have a new session here
	})
	res.redirect('/');
}


/* ----------------------------------------------------------- 
*  List all events 
---------------------------------------------------------------*/
module.exports.addNewEvents = function (req, res, next) {
  // var pro_id = (req.params.pro_id)
  var data = {}
  console.log("Admin Conf Controller")
  loginModel.allUsers(function (error, response) { 
  	data.users = response
	  data.title = "Add events"
	  console.log(data)

	  res.render('productConf', data)
  })

}


module.exports.eventConfSave = function (req, res, next) {
  var data = {}
  console.log("req.body 5444: ", req.body);

  var start_time = req.body.start_time;
  var end_time = req.body.end_time;
  var uids = req.body.user_list;

  // Check Users already availbale or not
    loginModel.usersAvailbale(req.body, function (error, response) { 
    		console.log("+--------------156------", response[0]["exist"])
    		if (response[0]["exist"] == true) {
    			req.header.status = "warning"
	        req.header.message = "already scheduled a event"
	        req.session.auth = true;
	        console.log("already scheduled a event")
	        res.redirect('/add-events')
    		} else {
    			console.log("--------------164------")
    		loginModel.insertNewMeeting(req.body, function (error, response) {  
    			console.log("16555-------------", response)
    		})

    		}


    })




  // if (!pro_id || !product_name) {
  //   res.redirect('/dashboard');
  //   return;
  // }
  // if (req.body.pro_id) {
  //   console.log("111111111111111111111")
  //   // Update
  //   productModel.ProductUpdate(req.body, function (error, response) {
  //     console.log("apiKeyUpdate Controler---------")
  //     if (error) {
  //       console.log(error)
  //       req.header.status = "danger"
  //       req.header.message = "an error occured, Please try again later"
  //       res.redirect('/')
  //       return
  //     }
  //     // console.log("-----------response-----------------",response);

  //     if (response) {
  //       req.header.status = "success"
  //       req.header.message = "Successfully Saved"
  //       req.session.auth = true;
  //       console.log("Suscess fully Updated")
  //       res.redirect('/products')
  //     } else {
  //       req.header.status = "danger"
  //       req.header.message = "an error occured, Please try again later"
  //       res.redirect('/products')
  //     }
  //   });
  // } else {
  //   // Insert new one
  //   console.log("------------------------93------------")
  //   productModel.productAdd(req.body, function (error, response) {
  //     console.log("Configuration Controller---------")
  //     if (error) {
  //       req.header.status = "danger"
  //       req.header.message = "an error occured, Please try again later"
  //       res.redirect('/admin/api-add')
  //       return
  //     }
  //     if (response) {
  //       req.header.status = "success"
  //       req.header.message = "Successfully Saved"
  //       req.session.auth = true;
  //       res.redirect('/products')
  //     } else {
  //       req.header.status = "danger"
  //       req.header.message = "an error occured, Please try again later"
  //       res.redirect('/products')
  //     }
  //   });
  // }

  console.log("Admin api conf save")
}

