const express = require('express');
const router = express.Router();
const ObjectId = require('mongoose').Types.ObjectId;
const otpMailHandler = require('../helpers/otpmail-handler');
const pswdSetupMailHandler = require('./pswdsetupmail-handler');
const invalidSoRedirect = require('../helpers/invalidsoredirect');

// models
const User = require('../../models/User');
const OTP = require('../../models/OTP');
const Token = require('../../models/Token');

router.get('/:id', (req, res) => {
	//! SERIOUS BUG, IF THE USER HAS ALREADY VERIFIED OTP
	//! THEN DON'T LET SUBMIT ANOTHER
	const { id: user_id } = req.params;
	res.render('confirmotp', { user_id });
});

router.post('/:id', (req, res, next) => {
	const { otp } = req.body;
	const { id: user_id } = req.params;
	let errors = [];
	OTP.findOne({ _userId: ObjectId(user_id) }).then(data => {
			if (!data) 
				invalidSoRedirect(req, res, 'User does not exist / OTP expired', '/');
			else {
				const { otp:storedOTP } = data;
				// match OTPs
				if (otp !== storedOTP) {
					errors.push({ msg: 'Invalid OTP' });
					res.render('confirmotp', { user_id, errors });
				} else {
					data.otpVerified = true;
					User.findById(user_id).then(user => {
							if (!user) {
								const msg = 'internal server error, please submit again'
								errors.push({ msg });
								res.render('confirmotp', { user_id, errors });
							} else {
								data.save().then(() => {
									pswdSetupMailHandler(user, req, res)
								}).catch(next)
							}
						}).catch(next);
				}
			}
		}).catch(next);
});

router.get('/success/:id', (req, res) => {
	res.render('linksentsuccess', { user_id: req.params.id})
});

router.post('/resend-otp/:id', (req, res, next) => {
	const { id:user_id } = req.params;
	OTP.deleteMany({_userId: user_id}).then(() => {
		User.findOne({_id: user_id}).then(user => {
			otpMailHandler(user, req, res);
		}).catch(next)
	}).catch(next)
});

router.post('/resend-link/:id', (req, res, next) => {
	const { id: user_id } = req.params;
	Token.deleteMany({_userId: user_id}).then(()=>{
		User.findOne({_id: user_id}).then(user => {
			pswdSetupMailHandler(user, req, res);
		}).catch(next)
	}).catch(next);
})

module.exports = router;
