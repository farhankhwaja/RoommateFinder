var User = require('mongoose').model('User'),
	AptInfo = require('mongoose').model('AptInfo'),
	passport = require('passport'),
	path = require('path');

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
	// console.log("Register");
	var user = new User(req.body);
	// console.log("User", user);
	var message = null;
	user.provider = 'local';
	user.save(function(err) {
		if (err) {
			return res.send(err);
		}
		
		req.login(user, function(err) {
			if (err)
				return next(err);
			return res.json(user);
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
	var	female = req.body.female;
	var	male = req.body.male;

	var lat = parseFloat(req.body.latitude);
	var lng = parseFloat(req.body.longitude);

	console.log(male, female);
	var result = {
		users: {},
		aptInfo : {}
	};

	var query = AptInfo.find()
				.populate({
					path: 'user_id',
					match: {
						gender : {
							$in: [male, female]
						}
					}
				});

	if(distance){
		query = query.where('location').near({center: {type: 'Point', coordinates: [lng, lat]},
			maxDistance: distance * 1609.34, spherical: true});
	}

	query.exec(function(err, apt){
		if(err)
			res.send(err);
		else
			res.json(apt);
	});
};

exports.createListing = function(req, res, next) {
	var apt = new AptInfo(req.body);
	apt.save(function(err) {
		if (err) {
			return next(err);
		}
		else {
			res.sendStatus(200);
		}
	});
};

exports.updateListing = function(req, res, next) {
	AptInfo.findOneAndUpdate({user_id: req.body.user_id}, req.body, {upsert: true}, function(err, apt) {
		if (err) {
			// console.log("Error");
			return next(err);
		}
		else {
			res.json(apt);
		}
	});
};

exports.readListing = function(req, res) {
	// console.log("request",req);
	AptInfo.findOne({_id: req.params.id}, function(err, apt){
		if(err) {
			return next(err);
		}else{
			res.json(apt);
		}
	});
};

exports.deleteListing = function(req, res, next) {
	AptInfo.findOneAndRemove({user_id: req.user.id}, function(err, apt) {
		if (err) {
			return next(err);
		}
		else {
			res.status(200);
		}
	});
};