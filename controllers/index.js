exports.render = function(req, res) {
    res.render('index', {
    	title: 'MovIn',
    	user: req.user ? req.user.username : ''
    });
};