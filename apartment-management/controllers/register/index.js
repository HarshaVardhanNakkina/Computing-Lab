const express = require('express');
const router = express.Router();
const cryptoRandomString = require('crypto-random-string');
const generateOTP = require('./otp-generator');
const sendOTP = require('./send-otp');

// models
const User = require('../../models/User');
const TokenOTP = require('../../models/TokenOTP');

// Register Page
router.get('/', (req, res) => res.render('register'));

// Register Handler
router.post('/', (req, res) => {

	const { doornum, email, mobile } = req.body;
	let errors = [];

	if (!doornum || !email || !mobile)
		errors.push({ msg: 'Please fill in the required fields' });

	// pattern 1-N-12-799/29
	if (!doornum.match(/^\d\-[A-Z]{1}\-\d{2}\-\d{3}\/\d{2}$/g))
		errors.push({ msg: 'Door number format is not correct' });

	// mobile number regex
	if (!mobile.match(/^\d{10}$/g))
		errors.push({ msg: 'Enter a valid mobile number' });

	if (errors.length > 0) {
		res.render('register', {
			errors,
			doornum,
			email,
			mobile
		});
	} else {
		// all validations passed
		User.findOne({ doornum }).then(user => {
			if (user) {
				// Email already registered
				errors.push({ msg: 'Email is already registered' });
				res.render('register', {
					errors,
					doornum,
					email,
					mobile
				});
			} else {
				const newUser = new User({ doornum, email, mobile });

				newUser.save().then(user => {

					const newTokens = new TokenOTP({
						_userId: user._id,
						token: cryptoRandomString({ length: 64, type: 'url-safe' }),
						otp: generateOTP()
					});

					newTokens.save().then(tokens => {
						console.log('sending an otp email');
						sendOTP(user, tokens).then(response => {
							console.log('verification mail has been sent');
							tokens.otpSent = true;
							tokens.save().then(()=>{
								req.flash('success_msg', 'A mail with OTP will be sent for verification');
								res.redirect(`/users/confirmotp/${user._id}`);
							}).catch(console.log);
						}).catch(console.log);
					}).catch(console.log);
				}).catch(console.log);
			}
		});
	}
});

module.exports = router;
