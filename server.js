// server.js
var config = require('./config_key/conf.json');

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var session  = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var app      = express();
var port     = process.env.PORT || 8080;

var passport = require('passport');
var flash    = require('connect-flash');

// Database
var mysql    = require('mysql');
var dbconfig = require('./config/database');
var connection = mysql.createConnection(dbconfig.connection);

connection.connect(function(err) {
  if (err) throw err
  console.log('Looks Good! You are now connected...')
})


// configuration ===============================================================
// connect to our database
require('./config/passport')(passport); // pass passport for configuration


// set up our express application
app.use(morgan('dev')); // log every request to the console

// to support JSON-encoded bodies
app.use(cookieParser()); // read cookies (needed for auth)

 // to support URL-encoded bodies
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
	secret: config.session_secret,
	resave: true,
	saveUninitialized: true
 } )); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


/* -------------------------------------------
	API
------------------------------------------- */
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport


// launch ======================================================================
//app.listen(port);
var server = app.listen(port, "127.0.0.1", function () {

  let host = server.address().address
  let port = server.address().port

  console.log("Server started: Shipping CA listening at http://%s:%s", host, port)

});












