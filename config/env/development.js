var port = 1337;

module.exports = {
	port: port,
	db: 'mongodb://localhost:27017/MovInDev',
	facebook: {
		clientID: '513828288756645',
		clientSecret: '2d7cc991efddb864e9af61f307980b9a',
		callbackURL: 'http://localhost:3000/oauth/facebook/callback'
	},
	twitter: {
		clientID: 'yFntGKkvMZkDKL47XGtzLNdRA',
		clientSecret: 'EAiPTjPYLX5nrkpRtxYQflbWpRTqqLwwBHRLh7WpdQ1P69Tre6',
		callbackURL: 'http://localhost:3000/oauth/twitter/callback'
	}
};