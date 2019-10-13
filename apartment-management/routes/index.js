const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../auth/auth');

// Welcome Page
router.get('/', (req, res) => {
	// res.setHeader('Cache-Control', 'public, max-age=86400000');
	const { user }= req;
	if(user)
		res.render('home', { user_id: user._id});
	else
		res.render('home');
});

module.exports = router;
