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
	address: String,
	location: {
      type: { type: String },
      coordinates: []
  },
	password: String,
	originalpassword: String,
	provider: {
		type: String,
		index: true
	},
	providerId: String,
    providerData: {}
},{ 
	timestamps: true
	});

UserSchema.index({ location: '2dsphere' });

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