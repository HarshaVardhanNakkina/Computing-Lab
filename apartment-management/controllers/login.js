const express = require('express');
const router = express.Router();
const passport = require('passport');

// Login Page
router.get('/', (req, res) => res.render('login'));

// Login Handle
router.post('/', (req, res, next) => {
	passport.authenticate('local', {
		successRedirect: '/profile',
		failureRedirect: '/users/login',
		failureFlash: true
	})(req, res, next);
});

module.exports = router;