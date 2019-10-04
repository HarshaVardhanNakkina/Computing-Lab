const mongoose = require('mongoose');

const TokenOTPSchema = new mongoose.Schema({
	_userId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'User'
	},
	token: {
		type: String,
		index: { expires: 900 },
		required: true,
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
	tokenSent: {
		type: Boolean,
		default: false
	},
	otpVerified: {
		type: Boolean,
		default: false
	},
	tokenVerified: {
		type: Boolean,
		default: false
	},
	createdAt: {
		type: Date,
		required: true,
		default: Date.now
	}
});

TokenOTPSchema.index({ createdAt: 1 }, { expireAfterSeconds: 900 });
const TokenOTP = mongoose.model('TokenOTP', TokenOTPSchema);
module.exports = TokenOTP;
