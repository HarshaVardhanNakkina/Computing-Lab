const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const TokenOTP = require('../models/TokenOTP');
// const { ensureAuthenticated } = require('../auth/auth');

router.get('/:id', (req, res) => res.render('confirmotp',{
	errors:[],
	user_id: req.params.id
}))
router.post('/:id', (req, res) => {
	const { otp: curOTP } = req.body;
	const { id:user_id } = req.params;
	let errors = [];
	TokenOTP
		.findOne({_userId: mongoose.Types.ObjectId(user_id)})
		.then(tokens => {
			if(!tokens) {
				errors.push({msg: 'User does not exist'});
				res.render('confirmotp', {
					user_id:req.params.id,
					errors
				})
			}else {
				const { otp } = tokens;
				console.log(curOTP, typeof curOTP);
				console.log(otp, typeof otp);
				if(otp == curOTP) {
					res.redirect('/users/pswdsetup');
				}else {
					errors.push({msg: 'Invalid OTP'})
					res.render('confirmotp',{
						user_id
					})
				}
			}
		})
		.catch(console.log)
})

module.exports = router;