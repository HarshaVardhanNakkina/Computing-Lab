const express = require('express');
const router = express.Router();
const TokenOTP = require('../models/TokenOTP');
// const { ensureAuthenticated } = require('../auth/auth');

router.get('/:id', (req, res) => res.render('confirmotp',{
	user_id: req.params.id
}))
router.post('/:id', (req, res) => {
	const { otp: curOTP } = req.body;
	const { user_id } = req.params;
	let errors = [];
	TokenOTP
		.findOne({_userId: user_id})
		.then(tokens => {
			if(!tokens) {
				errors.push({msg: 'User does not exist'});
				res.render('confirmotp', {
					errors,
					user_id,
				})
			}else {
				const { otp } = tokens;
			}
		})
		.catch(console.log())
})

module.exports = router;