const mongoose = require('mongoose');
const OTP = require('./OTP');
const Token = require('./Token');

const UserSchema = new mongoose.Schema({
	doornum: {
		type: String,
		required: true,
		unique: true
	},
	email: {
		type: String,
		required: true
	},
  mobile: {
    type: String,
    required: true
  },
	password: {
		type: String,
		default: null
	},
  verified: {
    type: Boolean,
    default: false
	},
	firtTimeLogin: {
		type: Boolean,
		default: true
	},
	detailsGiven: {
		type: Boolean,
		default: false
	}
});

UserSchema.pre('remove', function(next) {
	OTP.remove({_userId: this._id}).exec();
	Token.remove({_userId: this._id}).exec();
	next();
})

const User = mongoose.model('User', UserSchema);

module.exports = User;
