const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../auth/auth');

// Welcome Page
router.get('/', (req, res) => res.render('home'));


// profile
router.get('/profile', ensureAuthenticated,
	(req, res) => res.render('profile', {user: req.user})
);

module.exports = router;
