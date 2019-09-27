const mongoose = require('mongoose');

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

const User = mongoose.model('User', UserSchema);

module.exports = User;
