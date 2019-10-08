const mongoose = require('mongoose');

const OTPSchema = new mongoose.Schema({
	_userId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'User'
	},
	otp: {
		type: String,
		index: { expires: 900 },
		required: true,
	},
	otpSent: {
		type: Boolean,
		default: false
	},
	otpVerified: {
		type: Boolean,
		default: false
	},
	createdAt: {
		type: Date,
		required: true,
		default: Date.now
	}
});

OTPSchema.index({ createdAt: 1 }, { expireAfterSeconds: 900 });
const OTP = mongoose.model('OTP', OTPSchema);
module.exports = OTP;
