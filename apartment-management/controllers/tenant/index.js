const express		= require('express')
const mongoose	= require('mongoose')
const { ensureAuthenticated} = require('../../auth/auth')
const router = express.Router();

router.use('/:id', ensureAuthenticated, (req, res, next) => {
	const { user_id } = req.params;
	res.render('tenant', {
		user_id
	})
})

module.exports = router