var User = require('mongoose').model('User'),
	passport = require('passport'),
	path = require('path'),
	dateTime = new Date();

var getErrorMessage = function(err) {
	var message = '';
	if (err.code) {
		switch (err.code) {
			case 11000:
			case 11001:
				message = 'Email already exists';
				break;
			default:
				message = 'Something went wrong';
		}
	}
	else {
		for (var errName in err.errors) {
			if (err.errors[errName].message)
				message = err.errors[errName].message;
		}
	}

	return message;
};

exports.register = function(req, res, next) {
	var user = new User(req.body);
	var message = null;
	user.provider = 'local';
	user.save(function(err) {
		if (err) {
			return res.send(err);
		}
		req.login(user, function(err) {
			if (err)
				return next(err);
			return res.redirect('/');
		});
	});
};

exports.logout = function(req, res) {
	req.logOut();
	req.session.destroy(function (err) {
		if (err) { return next(err); }
		// The response should indicate that the user is no longer authenticated.
		return res.sendStatus(200);
	});
};

exports.saveOAuthUserProfile = function(req, profile, done) {
	User.findOne({
			provider: profile.provider,
			providerId: profile.providerId
		},
		function(err, user) {
			if (err) {
				return done(err);
			}
			else {
				if (!user) {
					var possibleUsername = profile.username || ((profile.email) ? profile.email.split('@')[0] : '');
					User.findUniqueUsername(possibleUsername, null, function(availableUsername) {
						profile.username = availableUsername;
						user = new User(profile);

						user.save(function(err) {
							if (err) {
								var message = _this.getErrorMessage(err);
								req.flash('error', message);
								return res.redirect('/signup');
							}

							return done(err, user);
						});
					});
				}
				else {
					return done(err, user);
				}
			}
		}
	);
};



exports.create = function(req, res, next) {	
	var user = new User(req.body);
	user.save(function(err) {
		if (err) {
			return next(err);
		}
		else {
			res.json(user);
		}
	});
};

exports.list = function(req, res, next) {
	User.find({}, function(err, users) {
		if (err) {
			return next(err);
		}
		else {
			res.json(users);
		}
	});
};

exports.read = function(req, res) {
	res.json(req.user);
};

exports.userByID = function(req, res, next, id) {
	User.findOne({
			_id: id
		}, 
		function(err, user) {
			if (err) {
				return next(err);
			}
			else {
				req.user = user;
				next();
			}
		}
	);
};

exports.update = function(req, res, next) {
	User.findByIdAndUpdate(req.user.id, req.body, function(err, user) {
		if (err) {
			return next(err);
		}
		else {
			res.json(user);
		}
	});
};

exports.delete = function(req, res, next) {
	req.user.remove(function(err) {
		if (err) {
			return next(err);
		}
		else {
			res.json(req.user);
		}
	});
};

exports.searchUser = function(req, res){

	//Grab all search terms
	var distance = req.body.distance;
	var male = req.body.male;
	var female = req.body.female;
	var lat = parseFloat(req.body.latitude);
	var lng = parseFloat(req.body.longitude);

	var query = User.find({});

	if(distance){
		query = query.where('location').near({center: {type: 'Point', coordinates: [lng, lat]},
			maxDistance: distance * 1609.34, spherical: true});
	}

	if(male || female){
		query.or([{'gender': male}, {'gender': female}]);
	}

	query.exec(function(err, users){
		if(err)
			res.send(err);
		else
			res.json(users);
	});
};