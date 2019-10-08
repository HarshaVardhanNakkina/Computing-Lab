const cryptoRandomString = require('crypto-random-string');
const sendOTP = require('../helpers/send-otp');
const sendPswdSetupLink = require('./send-pswd-setup-link');

// models
const Token = require('../../models/Token');
const User = require('../../models/User');

module.exports = function pswdSetupMailHandler(user, req, res) {

	const {_id:user_id} = user;
	
	const newToken = new Token({
		_userId: user_id,
		token: cryptoRandomString({ length: 64, type: 'url-safe' })
	});

	newToken.save().then(data => {
		sendPswdSetupLink(user, data).then(response => {
			data.tokenSent = true;
			data.save().then(()=>{
				res.redirect(`/users/confirmotp/success/${user_id}`);
			}).catch(console.log);
		}).catch(console.log);
	}).catch(console.log);
}