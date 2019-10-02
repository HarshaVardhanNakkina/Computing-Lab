const mongoose = require('mongoose');

const TokenOTPSchema = new mongoose.Schema({
  _userId:{
    type: mongoose.Schema.Types.ObjectId, 
    required: true,
    ref: 'User',
  },
  token: {
		sent: {
			type: Boolean,
			default: false
		},
    type: String,
    required: true,
    createdAt:{
      type: Date,
      required: true,
      default: Date.now,
      expires: 900
    }
	},
	otp: {
		sent: {
			type: Boolean,
			default: false
		},
		type: String,
		required: true,
		verified: {
			type: Boolean,
			default: false
		},
		createdAt: {
			type: Date,
			required: true,
			default: Date.now,
			expires: 900
		}
	}
});

const TokenOTP = mongoose.model('TokenOTP', TokenOTPSchema);
module.exports = TokenOTP;