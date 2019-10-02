const mongoose = require('mongoose');
const TokenOTP = require('./TokenOTP');

const UserSchema = new mongoose.Schema({
	doornum: {
		type: String,
		required: true
	},
	email: {
    type: String,
    default: null
  },
  mobile: {
    type: String,
    default: null
  },
  verified: {
    type: Boolean,
    default: false
  }
});

UserSchema.pre('remove', function(next) {
	TokenOTP.remove({_userId: this._id}).exec();
	next();
})

const User = mongoose.model('User', UserSchema);

module.exports = User;
