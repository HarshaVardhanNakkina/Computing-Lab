const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const ObjectId = require('mongoose').Types.ObjectId;

// models required
const User = require('../../models/User');
const TokenOTP = require('../../models/TokenOTP');

const invalidSoRedirect = require('../helpers/invalidsoredirect');

router.get('/', (req, res, next) => {
	const { user_id, token } = req.query;
	console.log(req.query);
	// check if user_id is valid or not
	TokenOTP.findOne({ _userId: user_id })
		.then(user => {
			if (!user) invalidSoRedirect(req, res, 'Invaid user account', '/');
			else if(user.tokenVerified) invalidSoRedirect(req, res, 'Already verified', '/');
			else res.render('pswdsetup', { user_id, token });
		})
		.catch(console.log);
});

router.post('/', (req, res, next) => {
	const { user_id, token } = req.query;
	const { pswd, confpswd } = req.body;
	let errors = [];

	// check password length
	if (pswd.length < 6)
		errors.push({ msg: 'Password should be atleast 6 characters' });

	// match passwords
	if (pswd !== confpswd) errors.push({ msg: 'Passwords do not match' });

	// TODO: password constraints check
	// if (!pswd.match(/[A-Z]+\d+/g))
	// errors.push({ msg: 'password should contain blah blah blah' });

	if (errors.length > 0) {
		res.render('pswdsetup', {
			errors,
			user_id,
			token,
			pswd,
			confpswd
		});
	} else {
		// no errors, all good
		TokenOTP.findOne({ _userId: user_id })
			.then(tokens => {
				if (!tokens) invalidSoRedirect(req, res, 'Invalid user account', '/');
				else {
					const { token: storedToken } = tokens;
					if (token !== storedToken) 
						invalidSoRedirect(req, res, 'Invalid user account', '/');
					else {
						// tokens match, so, Hash Password, set passwords
						bcrypt.genSalt(10, (err, salt) =>
							bcrypt.hash(pswd, salt, (err, hash) => {
								if (err) throw err;

								// Set password to hashed password
								let promises = [
									User.updateOne(
										{ _id: ObjectId(user_id) },
										{ $set: { password: hash, verified: true } },
										{multi: true}
									),
									TokenOTP.updateMany(
										{ _userId: ObjectId(user_id) },
										{ $set: { tokenVerified: true } },
										{multi: true}
									)
								];
								
								Promise.all(promises).then(() => {
									req.flash(
										'success_msg',
										'Password is created, you can login'
									);
									res.redirect('/users/login');
								}).catch(console.log);
							})
						);
					}
				}
			})
			.catch(console.log);
	}
});

module.exports = router;
