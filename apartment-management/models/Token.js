const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
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
	tokenSent: {
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

TokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 900 });
const Token = mongoose.model('Token', TokenSchema);
module.exports = Token;
