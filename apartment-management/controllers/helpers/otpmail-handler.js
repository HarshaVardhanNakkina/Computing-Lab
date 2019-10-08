const OTP = require('../../models/OTP');
const generateOTP = require('./otp-generator');
const sendOTP = require('./send-otp');

module.exports = function otpMailHandler(user, req, res) {
	
	const newOTP = new OTP({
		_userId: user._id,
		otp: generateOTP()
	});

	newOTP.save().then(data => {
		console.log('sending an otp email');
		sendOTP(user, data).then(response => {
			console.log('verification mail has been sent');
			data.otpSent = true;
			data.save().then(()=>{
				req.flash('success_msg', 'A mail with OTP will be sent for verification');
				res.redirect(`/users/confirmotp/${user._id}`);
			}).catch(console.log);
		}).catch(console.log);
	}).catch(console.log);
}