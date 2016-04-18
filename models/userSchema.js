var mongoose = require('mongoose'),
	crypto = require('crypto'),
	Schema = mongoose.Schema,
	algorithm = 'aes-256-ctr',
	algoPassword = 'd6F3Efeq';

var UserSchema = new Schema({
	name: String,
	email: {
		type: String,
		unique: true,
		index: true
	},
	username: {
		type: String
	},
	gender : {
		type: String
	},
	age: {
		type: Number
	},
	password: String,
	originalpassword: String,
	provider: String,
    geek: Number,
	gamer: Number,
	vegan: Number,
	fitness: Number,
	athlete: Number,
	artist: Number,
	early_riser: Number,
	night_owl: Number,
	foodie: Number,
	live_sports: Number,
	bookworm: Number,
	musician: Number,
	party: Number,
	redditor: Number,
	shopaholic: Number,
	isVerified: {
		type: Number,
		default: 0
	},
    twitter: {},
    facebook: {},
    google: {},
    tumblr: {},
    img_url: [String],
    profileImg_url: String,
    search: [String]
},{
	timestamps: true
	});


// Define Index
UserSchema.set('autoIndex', process.env.NODE_ENV == 'development' ? true : false);
UserSchema.index({ 'twitter.id': 1 });
UserSchema.index({ 'facebook.id': 1 });
UserSchema.index({ 'google.id': 1 });
UserSchema.index({ search: 1 });

function encrypt(text){
  var cipher = crypto.createCipher(algorithm,algoPassword);
  var crypted = cipher.update(text,'utf8','hex');
  crypted += cipher.final('hex');
  return crypted;
}

UserSchema.pre('save',
	function(next) {
		if (this.password) {
			this.password = encrypt(this.password);
		}
		next();
	}
);

UserSchema.methods.authenticate = function(password) {
	var cipher = crypto.createCipher(algorithm,algoPassword);
	var crypted = cipher.update(password,'utf8','hex');
	crypted += cipher.final('hex');

	return this.password === crypted;
};

UserSchema.methods.decrypt = function(text){
  var decipher = crypto.createDecipher(algorithm,algoPassword);
  var dec = decipher.update(text,'hex','utf8');
  dec += decipher.final('utf8');
  return dec;
};

UserSchema.statics.findUniqueUsername = function(username, suffix, callback) {
	var _this = this;
	var possibleUsername = username + (suffix || '');

	_this.findOne(
		{username: possibleUsername},
		function(err, user) {
			if (!err) {
				if (!user) {
					callback(possibleUsername);
				}
				else {
					return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
				}
			}
			else {
				callback(null);
			}
		}
	);
};


mongoose.model('User', UserSchema);