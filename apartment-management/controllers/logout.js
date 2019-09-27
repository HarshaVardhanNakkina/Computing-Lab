const express = require('express');
const router = express.Router();
const { ensureAuthenticated }= require('../auth/auth');


// Logout
router.get('/', ensureAuthenticated, (req, res) => {
	req.logout();
	req.flash('success_msg', 'You are logged out');
	res.redirect('/users/login');
});

module.exports = router;