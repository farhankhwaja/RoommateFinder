var config = require('./config'),
	express = require('express'),
	bodyParser = require('body-parser'),
	passport = require('passport'),
	session = require('express-session'),
	path = require('path');

module.exports = function() {
	var app = express();
	var sess = {
		saveUninitialized: true,
		resave: false,
		secret: 'HGST72H7823GKOL',
		cookie: { }
	}

	app.use(bodyParser.urlencoded({
		extended: true
	}));
	
	app.use(bodyParser.json());

	app.use(express.static('./public'));
	app.set('trust proxy', 1) // trust first proxy

	if (app.get('env') === 'production') {
		app.set('trust proxy', 1) // trust first proxy
		sess.cookie.secure = true // serve secure cookies
	}
	
	app.use(session(sess));

	// view engine setup
	app.set('views', './views');
	app.set('view engine', 'ejs');
	
	app.use(passport.initialize());
	app.use(passport.session());

	require('../routes/index.js')(app, passport);
	require('../routes/users.js')(app, passport);

	return app;
};