// File System
var express = require("express")
var bodyParser = require('body-parser')
var constants = require('./config/constants').getConstants()

var path = require('path')
var hbs = require('hbs')

var session = require('express-session')
const helmet = require('helmet')
var app = express()

//Helmet helps security
app.use(helmet())

var port = constants.port ? constants.port : '2018'
var ENV = constants.ENV ? constants.ENV : 'DEVELOPMENT'

//initiate the db connection
const pg = require('pg')
var config = require('./config/config').getConfig()
global.pool = new pg.Pool(config)

// view engine setup
app.set('views', path.join(__dirname, 'views'))
hbs.registerPartials(__dirname + '/views/partials')
app.set('view engine', 'hbs')
require("./helper/hbs.js") // HBS Helpers

//Serving static files
app.use(express.static(path.join(__dirname, 'assets')))

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

//quick fix
app.use(function (req, res, next) {
  res.io = io;
  next();
});

// *************************** Firebase Admin CODE START  ***************************
// require('./helper/firebase');
// *************************** Firebase Admin CODE START  ***************************


//session setup
app.use(session({
  secret: 'epixel secret',
  resave: false,
  saveUninitialized: true,
  // cookie: {maxAge: 3600000}
  // cookie: {maxAge: 60000,httpOnly: false}
  cookie: { maxAge: 1800000}
}))

var server = require('http').createServer(app)

server.listen(port, function(){
    console.log('server re-started on port: ', port)
})

// REGISTER OUR ROUTES -------------------------
// all of our routes will be prefixed with /
var myRoutes = require('./route/allRoute')
app.use('/', myRoutes)
app.use('/api', require('./route/apiRoutes'))


// *************************** Socket IO  ***************************
const io = require('socket.io')(server);

io.on('connection', function (socket) {

  console.log("\x1b[32m%s\x1b[0m;", 'socket connected');
  socket.emit('connected');


  // socket.join('1');
  // io.to('1').emit('connected');

  socket.on('disconnect', function () {
    console.log("\x1b[33m%s\x1b[0m;", 'socket disconnected');
  });

  socket.on('error', function (err) {
    console.log('received error from client:', client.id)
    console.log(err)
  })
});
// *************************** Socket IO  ***************************
