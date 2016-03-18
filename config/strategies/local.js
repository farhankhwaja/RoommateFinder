var passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	User = require('mongoose').model('User');

module.exports = function() {
	passport.use(new LocalStrategy({
		usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },function(req, email, password, done) {
		process.nextTick(function() {
			User.findOne(
				{email: email},
				function(err, user) {
					if (err) {
						return done(err);
					}
					
					// if (user) {
	    //             	return done(null, false, {message:'That email is already taken.'});
	    //         	} 

					if (!user) {
						return done(null, false, {message: 'Unknown user'});
					}

					if (!user.authenticate(password)) {
						return done(null, false, {message: 'Invalid password'});
					}

					return done(null, user);
				}
			);
		});
	}));
};