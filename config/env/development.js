var port = 1337;

module.exports = {
	port: port,
	db: 'mongodb://localhost:27017/MovInDev',
	facebookAuth : {
		'clientID' 		: 'your-secret-clientID-here', // your App ID
		'clientSecret' 	: 'your-client-secret-here', // your App Secret
		'callbackURL' 	: 'http://localhost:1337/auth/facebook/callback'
	},

	twitterAuth : {
		'consumerKey' 		: 'your-consumer-key-here',
		'consumerSecret' 	: 'your-client-secret-here',
		'callbackURL' 		: 'http://localhost:1337/auth/twitter/callback'
	},

	googleAuth : {
		'clientID' 		: 'your-secret-clientID-here',
		'clientSecret' 	: 'your-client-secret-here',
		'callbackURL' 	: 'http://localhost:1337/auth/google/callback'
	}
};