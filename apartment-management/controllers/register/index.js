const express = require('express');
const router = express.Router();
const otpMailHandler = require('../helpers/otpmail-handler');

// models
const User = require('../../models/User');

// Register Page
router.get('/', (req, res) => res.render('register'));

// Register Handler
router.post('/', (req, res, next) => {
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
		res.status(400).render('register', {
			errors,
			doornum,
			email,
			mobile
		});
	} else {
		// all validations passed
		User.findOne({ doornum }).then(user => {
			if (user) {
				// Door no. already registered
				errors.push({ msg: 'Door number is already registered' });
				res.status(400).render('register', {
					errors,
					doornum,
					email,
					mobile
				});
			} 
			else {
				
				const newUser = new User({ doornum, email, mobile });
				newUser.save()
					.then(user => otpMailHandler(user, req, res))
					.catch(next);
			}
		}).catch(next)
	}
});

module.exports = router;
