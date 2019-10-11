module.exports = {
	ensureAuthenticated: function(req, res, next) {

		if(req.isAuthenticated()) {
			return next();
		} else{
			req.flash('error_msg', 'You need to be logged in first');
			res.redirect('/users/login');
		}
	}
};