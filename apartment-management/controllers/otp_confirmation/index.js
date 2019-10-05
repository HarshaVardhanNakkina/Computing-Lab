const express = require('express');
const router = express.Router();
const ObjectId = require('mongoose').Types.ObjectId;
const cryptoRandomString = require('crypto-random-string');

// models
const TokenOTP = require('../../models/TokenOTP');
const User = require('../../models/User');

const generateOTP = require('./otp-generator');
const sendOTP = require('./send-otp');
const sendPswdSetupLink = require('./send-pswd-setup-link');
const invalidSoRedirect = require('../helpers/invalidsoredirect');

router.get('/:id', (req, res) => {
	const { id: user_id } = req.params;
	res.render('confirmotp', { user_id });

	// remove previous tokens if any exist
	TokenOTP.remove({ _userId: user_id });

	let tokens = new TokenOTP({
		_userId: user_id,
		token: cryptoRandomString({ length: 64, type: 'url-safe' }),
		otp: generateOTP()
	});

	// save otp and token
	tokens.save().then(tokenotp => {
			// send the otp
			User.findOne({_id: user_id}).then(user => {
				console.log('sending the otp mail');
				sendOTP(user, tokens)
					.then(response => {
						console.log('verification mail has been sent');
						tokens.otpSent = true;
						tokens.save().then().catch(console.log);
					}).catch(console.log);
			}).catch(console.log);
		})
		.catch(console.log);
});


router.post('/:id', (req, res) => {
	const { otp } = req.body;
	const { id: user_id } = req.params;
	let errors = [];
	TokenOTP.findOne({ _userId: ObjectId(user_id) }).then(tokens => {
			if (!tokens) 
				invalidSoRedirect(req, res, 'User does not exist', '/');
			else {
				const { otp:storedOTP, token } = tokens;
				// match OTPs
				if (otp !== storedOTP) {
					errors.push({ msg: 'Invalid OTP' });
					res.render('confirmotp', { user_id, errors });
				} else {
					tokens.otpVerified = true;
					User.findById(user_id).then(user => {
							if (!user) {	
								const msg = 'internal server error, please submit again'
								errors.push({ msg });
								res.render('confirmotp', { user_id,errors});
							} else {
								sendPswdSetupLink(user, token).then(() => {
										console.log('password setup link sent');
										tokens.tokenSent = true;
										tokens.save().then(() => {
												res.redirect(`/users/confirmotp/success/${user_id}`);
											}).catch(console.log);
									}).catch(console.log);
							}
						}).catch(console.log);
				}
			}
		})
		.catch(console.log);
});

router.get('/success/:id', (req, res) => res.render('linksentsuccess'));

module.exports = router;
