const LocalStrategy	=	require('passport-local').Strategy
const mongoose			=	require('mongoose')
const bcrypt				=	require('bcryptjs')
const JWTStrategy		=	require('passport-jwt').Strategy
const ExtractJWT		= require('passport-jwt').ExtractJwt
// Load User Model

const User = require('../models/User');

module.exports = function(passport) {
	passport.use('login', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password'
	}, (email, password, done) => {
		console.log("ENTERED THE LOGIN");
		const user = User.findOne({ email }).then((user) => {
			if (!user)
				return done(null, false, {message:'Invalid credentials', email, password})
			if (!user.verified)
				return done(null, false, { message: 'Verify your email/mobile and set your password'})
			bcrypt.compare(password, user.password, (err, isMatch) => {
						if (err) throw err;
						if (isMatch) {
							return done(null, user, { message: 'Logged in successfully'});
						} else {
							return done(null, false, {
								message: 'Invalid credentials',
								email,
								password
							});
						}
				});
		})
	}))

	passport.use(new JWTStrategy({
		secretOrKey		:	'hymn_for_the_weekend',
		jwtFromRequest:	ExtractJWT.fromAuthHeaderAsBearerToken()
	}, async (token, done) => {
		try {
			return done(null,token.user)
		} catch (error) {
			done(error)
		}
	}))
	// passport.use(
	// 	new LocalStrategy(
	// 		{usernameField: 'email'},
	// 		(email, password, done) => {
	// 			// Match user
	// 			User.findOne({ email })
	// 				.then(
	// 					user => {
	// 						if (!user) {
	// 							return done(null, false, {
	// 								message: 'Invalid credentials',
	// 								email,
	// 								password
	// 							});
  //             }
              
  //             if (!user.verified) {
  //               return done(null, false, {
  //                 message: 'Verify your email/mobile and set your password'
  //               })
  //             }
						
	// 					// Match the password
	// 					bcrypt.compare(password,user.password,(err, isMatch) => {
	// 							if (err) throw err;
	// 							if (isMatch) {
	// 								return done(null, user);
	// 							} else {
	// 								return done(null, false, {
	// 									message: 'Invalid credentials',
	// 									email,
	// 									password
	// 								});
	// 							}
	// 					});
	// 				})
	// 				.catch(console.log);
	// 		}
	// 	)
	// );
};
