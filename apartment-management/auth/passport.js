const LocalStrategy	=	require('passport-local').Strategy
const mongoose			=	require('mongoose')
const bcrypt				=	require('bcryptjs')
const JWTStrategy		=	require('passport-jwt').Strategy
const ExtractJWT		= require('passport-jwt').ExtractJwt

// Load User Model
const User = require('../models/User');

const cookieExtractor = function(req) {
	let token = null;
	// console.log("COOKIE EXTRACTOR");
	const { jwt_cookie } = req.cookies;
	if(req && req.cookies) token = jwt_cookie
	return token
}

module.exports = function(passport) {
	passport.use('login', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password'
	}, (email, password, done) => {
		console.log("ENTERED THE LOGIN");
		// console.log(email + password);
		const user = User.findOne({ email }).then((user) => {
			// console.log(user)
			if (!user){
				console.log("NOT USER CONDITION")
				return done(null, false, {message:'Invalid credentials'})
			}
			if (!user.verified)
				//console.log("NOT VERIFIED CONDITION")

				return done(null, false, { message: 'Verify your email/mobile and set your password'})
			bcrypt.compare(password, user.password, (err, isMatch) => {
						if (err) throw err;
						if (isMatch) {
							return done(null, user, { message: 'Logged in successfully'});
						} else {
							return done(null, false, {message: 'Invalid credentials'});
						}
				});
		})
	}))

	passport.use(new JWTStrategy({
		secretOrKey		:	'hymn_for_the_weekend',
		jwtFromRequest:	cookieExtractor
	}, (token, done) => {
		// console.log("ENTERED JWT AUTH")
		const { user } = token;
		User.findOne({_id: user._id}).then(user => {
			if(user)
				return done(null, {_id: user._id})
			return done(null, false);
		}).catch(err => done(err))
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
