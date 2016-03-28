var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var AptInfo = new Schema ({
	user_id: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        index: true,
        unique: true
    }],
	location: {
      type: { type: 'String' },
      coordinates: []
	},
	address: String,
    type: String,
    isFor: String,
	rent: String,
	pool: Number,
	rooftop: Number,
	laundry: Number,
    ac_heater: Number,
    no_rooms: Number,
    sq_ft: Number,
    baths: Number,
    fridge: Number,
    microwave: Number,
    floor: String,
    beds: Number,
    parking_area: Number,
    pet_friendly: Number,
    smoking: Number,
    guys_only: Number,
    girls_only: Number,
    utilities_included: Number
  });

AptInfo.set('autoIndex', process.env.NODE_ENV == 'development' ? true : false);
AptInfo.index({ location: '2dsphere' });

// AptInfo.static('findByUserId', function (user_id, callback) {
//   return this.find({ user_id: user_id }, callback);
// });

mongoose.model('AptInfo', AptInfo);