var users = require('../controllers/user.server'),
	passport = require('passport');

module.exports = function(app) {
	app.route('/users').post(users.create).get(users.list);

	app.route('/users/:userId').get(users.read).put(users.update).delete(users.delete);

	app.param('userId', users.userByID);

	app.route('/signup')
		.get(users.renderRegister)
		.post(users.register);

	app.route('/login')
		.get(users.renderLogin)
		.post(passport.authenticate('local', {
			successRedirect: '/profile',
			failureRedirect: '/login',
			failureFlash: true
		}));

	app.route('/profile')
		.get(users.renderProfile);

	app.get('/logout', users.logout);

	app.get('/oauth/facebook', passport.authenticate('facebook', {
		failureRedirect: '/login',
		scope:['email']
	}));

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