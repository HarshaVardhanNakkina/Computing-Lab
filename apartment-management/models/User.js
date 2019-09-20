const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
	doornum: {
		type: String,
		required: true
	},
	email: {
		type: String
	},
	password: {
		type: String,
	},
	date: {
		type: Date,
		default: Date.now
	}
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
