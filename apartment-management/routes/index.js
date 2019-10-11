const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../auth/auth');

// Welcome Page
router.get('/', (req, res) => {
	res.setHeader('Cache-Control', 'public, max-age=86400000');
	res.render('home', { user: req.user });
});

module.exports = router;
