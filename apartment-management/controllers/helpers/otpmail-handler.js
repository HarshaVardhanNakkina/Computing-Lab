const TokenOTP = require('../../models/TokenOTP');
const cryptoRandomString = require('crypto-random-string');
const generateOTP = require('./otp-generator');
const sendOTP = require('./send-otp');

module.exports = function otpMailHandler(user, req, res) {
	
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
}