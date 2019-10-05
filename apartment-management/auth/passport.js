const LocalStrategy = require('passport-local').Strategy;

const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');

// Load User Model

const User = require('../models/User');

module.exports = function(passport) {
	passport.use(
		new LocalStrategy(
			{usernameField: 'email'},
			(email, password, done) => {
				// Match user
				User.findOne({ email })
					.then(
						user => {
							if (!user) {
								return done(null, false, {
									message: 'Invalid credentials',
									email,
									password
								});
              }
              
              if (!user.verified) {
                return done(null, false, {
                  message: 'Verify your email/mobile and set your password'
                })
              }
						
						// Match the password
						bcrypt.compare(password,user.password,(err, isMatch) => {
								if (err) throw err;
								if (isMatch) {
									return done(null, user);
								} else {
									return done(null, false, {
										message: 'Invalid credentials',
										email,
										password
									});
								}
						});
					})
					.catch(console.log);
			}
		)
	);
	passport.serializeUser((user, done) => {
		done(null, user.id);
	});

	passport.deserializeUser((id, done) => {
		User.findById(id, (err, user) => {
			done(err, user);
		});
	});
};
