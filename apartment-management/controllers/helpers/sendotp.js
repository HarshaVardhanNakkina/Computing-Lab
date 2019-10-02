async function sendOTP(user, tokenotp) {
	const { email, mobile } = user;
	const { otp } = tokenotp;
	// console.log(email, mobile, otp);

	// mailjet
	const mailjet = require('node-mailjet').connect(
		process.env.MAILJET_USER,
		process.env.MAILJET_AUTH
	);
	// const request = 
	return mailjet.post('send', { version: 'v3.1' }).request({
		Messages: [
			{
				From: {
					Email: 'ngshvardhan@gmail.com',
					Name: 'Apartment Management'
				},
				To: [
					{
						Email: email,
						Name: email
					},
				],
				TemplateID: 1024854,
				TemplateLanguage: true,
				Subject:'Verify your account',
				Variables: {
					otp
				}
			}
		]
	});
	// request
	// 	.then(result => {
	// 		console.log(result.body);
	// 	})
	// 	.catch(err => {
	// 		console.log(err.statusCode);
	// 	});
}


module.exports = sendOTP;
