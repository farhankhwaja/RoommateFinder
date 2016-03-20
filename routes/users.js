var users = require('../controllers/user.server'),
	passport = require('passport');

module.exports = function(app) {
	app.route('/users').post(users.create).get(users.list);

	app.route('/users/:userId').get(users.read).put(users.update).delete(users.delete);

	app.param('userId', users.userByID);

	app.route('/register')
		.post(users.register);

	app.route('/signin')
		.post(function(req, res, next){
			passport.authenticate('local',
				function(err, user, info){
					if (err) { 
						return next(err);
					}else if (!user) { // Redirect if it fails
						return res.sendStatus(500);
					}else{
						req.login(user, function(err) {
							if (err) { return next(err); }
							// Redirect if it succeeds
							return res.status(200).json(user);
						});
					}
				})(req, res, next);
			}
		);

	app.route('/signout')
		.get(users.logout);

	app.route('/query/')
		.post(users.searchUser);

	app.get('/oauth/facebook', passport.authenticate('facebook', {
		failureRedirect: '/login',
		scope:['email']
	}));

	app.get('/user/loggedin', function(req, res) {
		if(req.isAuthenticated())
			res.send(req.user);
		else
			res.send(null);
	});

	app.get('/oauth/facebook/callback', passport.authenticate('facebook', {
		failureRedirect: '/login',
		successRedirect: '/profile',
		scope:['email']
	}));

	app.get('/oauth/twitter', passport.authenticate('twitter', {
		failureRedirect: '/login'
	}));

	app.get('/oauth/twitter/callback', passport.authenticate('twitter', {
		failureRedirect: '/login',
		successRedirect: '/profile'
	}));

	app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.email    = undefined;
        user.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });
};

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}