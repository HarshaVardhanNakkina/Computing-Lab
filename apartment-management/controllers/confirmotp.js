const express = require('express');
const router = express.Router();
const ObjectId = require('mongoose').Types.ObjectId;
const TokenOTP = require('../models/TokenOTP');
const User = require('../models/User');
const sendPswdSetupLink = require('./helpers/sendpswdsetuplink');
// const { ensureAuthenticated } = require('../auth/auth');

router.get('/:id', (req, res) =>
	res.render('confirmotp', {
		errors: [],
		user_id: req.params.id
	})
);
router.post('/:id', (req, res) => {
	const { otp: curOTP } = req.body;
	const { id: user_id } = req.params;
	let errors = [];
	TokenOTP.findOne({ _userId: ObjectId(user_id) })
		.then(tokens => {
			if (!tokens) {
				errors.push({ msg: 'User does not exist' });
				res.render('confirmotp', {
					user_id,
					errors
				});
			} else {
				const { otp, token } = tokens;
				if (otp == curOTP) {
					tokens.otpVerified = true;
					User.findById(user_id)
						.then(user => {
							if (!user) {
								errors.push({
									msg: 'internal server error, please submit again'
								});
								res.render('confirmotp', {
									user_id,
									errors
								});
							} else {
								sendPswdSetupLink(user, token)
									.then(() => {
										console.log('password setup link sent');
										tokens.tokenSent = true;
										tokens
											.save()
											.then(() => {
												res.redirect(`/users/confirmotp/success/${user_id}`);
											})
											.catch(console.log);
									})
									.catch(console.log);
							}
						})
						.catch(console.log);
				} else {
					errors.push({ msg: 'Invalid OTP' });
					res.render('confirmotp', {
						user_id,
						errors
					});
				}
			}
		})
		.catch(console.log);
});

router.get('/success/:id', (req, res) => res.render('linksentsuccess'));

module.exports = router;
