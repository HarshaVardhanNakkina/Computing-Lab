const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');	

// User model
const User = require('../models/User');

// Login Page
router.get('/login', (req, res) => res.render('login'));

// Register Page
router.get('/register', (req, res) => res.render('register'));

// Register Handler
router.post('/register', (req, res) => {
	const { doornum, email, mobile, password, password2 } = req.body;
	let errors = [];

	// check required fields
	if (!doornum || !(email || mobile) || !password || !password2)
		errors.push({ msg: 'Please fill in the required fields' });

	// check passwords match
	if (password !== password2) errors.push({ msg: 'Passwords do not match' });

	// check password length
	if (password.length < 6)
    errors.push({ msg: 'Password should be atleast 6 characters' });
  
  // check for email or mobile
  if(!(email || mobile)) 
    errors.push({msg: 'Email or Mobile number is required'});

  // door number regex check
  if(!doornum.match(/^\d\-[A-Za-z]{1}\-\d{2}\-\d{3}\/\d$/g))
    errors.push({msg: 'Door number format is not correct'});

  // mobile number regex
  if (!mobile.match(/^\d{10}$/g))
    errors.push({ msg: 'Enter a valid mobile number' });

	if (errors.length > 0) {
		res.render('register', {
			errors,
			doornum,
      email,
      mobile,
			password,
			password2
		});
	} else {
		// Validation passed
		User.findOne({ doornum: doornum }).then(user => {
			if (user) {
				// Email already registered
				errors.push({ msg: 'Email is already registered' });
				res.render("register", {
          errors,
          doornum,
          email,
          mobile,
          password,
          password2
        });
			} else {
				const newUser = new User({
          doornum,
          email,
          mobile,
          password
        });

				// Hash Password
				bcrypt.genSalt(10, (err, salt) =>
					bcrypt.hash(newUser.password, salt, (err, hash) => {
						if (err) throw err;
						// Set password to hashed password
						newUser.password = hash;
						newUser
							.save()
							.then(user => {
								req.flash(
									'success_msg',
									'You are now registered and can login'
								);
								res.redirect('/users/login');
							})
							.catch(console.log);
					})
				);
			}
		});
	}
});


// Login Handle
router.post('/login', (req, res, next) => {
	passport.authenticate('local', {
		successRedirect: '/profile',
		failureRedirect: '/users/login',
		failureFlash: true
	})(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
	req.logout();
	req.flash('success_msg', 'You are logged out');
	res.redirect('/users/login');
});

module.exports = router;
