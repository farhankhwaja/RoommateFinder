exports.render = function(req, res) {
    res.render('index', {
    	title: 'Roommate Finder',
    	user: req.user ? req.user.username : ''
    });
};