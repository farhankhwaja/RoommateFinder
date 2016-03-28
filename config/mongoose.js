var config = require('./config'),
	mongoose = require('mongoose');

module.exports = function() {
	var db = mongoose.connect(config.db, function(err) {
		if (err) {
			console.error(' connection error. ', err);
			throw(err);
		} else /*if(process.env.NODE_ENV === 'development')*/{
			console.log(' connected.');
		}
  });
	require('../models/userSchema');
	require('../models/aptInfo');

	return db;
};