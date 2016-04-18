var users = require('../controllers/user.server'),
	passport = require('passport'),
	multer = require('multer');

var storage = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
            cb(null, 'public/uploads/');
        },
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            cb(null, req.user._id + '-' + file.originalname);
        }
    });

var upload = multer({ //multer settings
                    storage: storage
                }).any();

module.exports = function(app) {
	app.route('/listing').get(users.userListings);
    app.route('/listing/:id').put(users.updateListing).delete(users.deleteListing).get(users.readListing);


	/** API path that will upload the files */
    app.post('/listing/uploads', function(req, res){
        upload(req, res, function(err) {
            if(err){
                return res.send("Error uploading file.");
            }
            res.send("File Uploaded!");
        });
    });
};