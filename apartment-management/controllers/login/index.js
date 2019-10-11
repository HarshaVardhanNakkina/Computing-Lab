const express = require('express');
const router = express.Router();
const passport = require('passport');

// Login Page
function checkBeforeRendering(req, res, next){
	if(req.isAuthenticated()) next();
	else res.render('login')
}
router.get('/', checkBeforeRendering, (req, res) => {
	res.redirect('/');
});

// Login Handle
router.post('/', passport.authenticate('local', {
		failureRedirect: '/users/login',
		failureFlash: true
	}),
	function (req, res, next) {
		// res.render('profile', { user: req.user });
		res.redirect('/')
	}
);

module.exports = router;