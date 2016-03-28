var users = require('../controllers/user.server'),
	passport = require('passport');

module.exports = function(app) {
	app.route('/users/:userId').put(users.update).delete(users.delete);

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
						return res.status(200).json({success: false, message: "User Not Found"});
					}else{
						req.login(user, function(err) {
							if (err) { return next(err); }
							// Redirect if it succeeds
							return res.status(200).json({success: true});
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
		if(req.isAuthenticated()){
			res.send(req.user);
		}else{
			res.send(null);
		}
	});
};

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}