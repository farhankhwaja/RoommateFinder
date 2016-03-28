var users = require('../controllers/user.server'),
	passport = require('passport');

module.exports = function(app) {
	app.route('/listing').get(users.readListing);

	app.route('/listing/:userId').put(users.updateListing).delete(users.deleteListing);
};