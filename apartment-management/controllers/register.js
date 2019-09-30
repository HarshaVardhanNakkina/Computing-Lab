const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');	
const nodemailer = require("nodemailer");

// User model
const User = require('../models/User');

// Sendgrid mail function
const sendPasswordSetupLink = require('./helpers/pswdresetupmail');

// Register Page
router.get('/', (req, res) => res.render('register'));

// Register Handler
router.post('/', (req, res) => {
	// const { doornum, email, mobile, password, password2 } = req.body;
	const { doornum, email, mobile} = req.body;
	let errors = [];

	// check required fields
  // if (!doornum || !(email || mobile) || !password || !password2)
	if (!doornum || !(email || mobile))
    errors.push({ msg: 'Please fill in the required fields' });

	// check passwords match
	// if (password !== password2) errors.push({ msg: 'Passwords do not match' });

	// check password length
	// if (password.length < 6)
  //   errors.push({ msg: 'Password should be atleast 6 characters' });
  
  // check for email or mobile
  if(!(email || mobile)) 
    errors.push({msg: 'Email or Mobile number is required'});

  // door number regex check
  if(!doornum.match(/^\d\-[A-Z]{1}\-\d{2}\-\d{3}\/\d$/g))
    errors.push({msg: 'Door number format is not correct'});

  // mobile number regex
  if (mobile.length > 0 && !mobile.match(/^\d{10}$/g))
    errors.push({ msg: 'Enter a valid mobile number' });

	if (errors.length > 0) {
		res.render('register', {
			errors,
			doornum,
      email,
      mobile
		});
	} else {
		// Validation passed
		User.findOne({ doornum: doornum }).then(user => {
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
				const newUser = new User({
          doornum,
          email,
          mobile
        });
        newUser
          .save()
          .then(user => {
						// send a mail verifications mail
						console.log("sending the verification mail");
						sendPasswordSetupLink(user)
							.then((response) => {
								console.log("verification mail has been sent");
								req.flash('success_msg', 'Verify your email/mobile and set your password');
								res.redirect('/users/login');
							})
							.catch(err => {
								console.log(err);
							})
          })
          .catch(console.log);

				// Hash Password
        /*
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
        */
			}
		});
	}
});


module.exports = router;