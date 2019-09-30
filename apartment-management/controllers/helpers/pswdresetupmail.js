// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// using mailchimp's mandrill api
// const mandrill = require('mandrill-api/mandrill');
// const mandrill_client = new mandrill.Mandrill(process.env.MANDRILL_API_KEY);

// mailjet
// const mailjet = require('node-mailjet');

// node-mailer
const nodemailer = require('nodemailer');

async function sendPasswordSetupLink(user) {
	const { email, mobile } = user;
	console.log(email, mobile);
	if (email.length > 0) {
		// node-mailer
		// create reusable transporter object using the default SMTP transport
		let transporter = nodemailer.createTransport({
			host: 'in-v3.mailjet.com',
			port: 587,
			secure: false, // true for 465, false for other ports
			auth: {
				user: 'a554548476b4b96453fdd3b60f825d65',
				pass: '4a0da2600955fe0e354799fa94672cb7'
			}
		});

		// send mail with defined transport object
		let info = await transporter.sendMail({
			from: '"Fred Foo 👻" <ngshvardhan@gmail.com>', // sender address
			to: 'harshavardhan.n@yahoo.com', // list of receivers
			subject: 'Mailjet nodemailer', // Subject line
			text: 'Mailjet nodemailer', // plain text body
			html: '<b>Mailjet nodemailer</b>' // html body
		});

		console.log('Message sent: %s', info.messageId);

		transporter = nodemailer.createTransport({
			host: 'smtp.sendgrid.net',
			port: 587,
			secure: false, // true for 465, false for other ports
			auth: {
				user: 'apikey',
				pass: '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'
			}
		});

		// send mail with defined transport object
		info = await transporter.sendMail({
			from: '"Fred Foo 👻" <harshavardhan.n@yahoo.com>', // sender address
			to: 'harshavardhan.n@yahoo.com ngshvardhan@gmail.com', // list of receivers
			subject: 'sendgrid nodemailer', // Subject line
			text: 'sendgrid nodemailer', // plain text body
			html: '<b>sendgrid nodemailer</b>' // html body
		});

		console.log('Message sent: %s', info.messageId);

		// send-grid
		const msg = {
			to: 'harshavardhan.n@yahoo.com',
			from: 'ngshvardhan@gmail.com',
			subject: 'sendgrid npm Sending with Twilio SendGrid is Fun',
			text: 'sendgrid npm and easy to do anywhere, even with Node.js',
			html: '<strong>sendgrid npm and easy to do anywhere, even with Node.js</strong>'
		};
		sgMail.send(msg);

		// mailjet
		const mailjet = require('node-mailjet').connect(
			'a554548476b4b96453fdd3b60f825d65',
			'4a0da2600955fe0e354799fa94672cb7'
		);
		const request = mailjet.post('send', { version: 'v3.1' }).request({
			Messages: [
				{
					From: {
						Email: 'ngshvardhan@gmail.com',
						Name: 'Harshavardhan'
					},
					To: [
						{
							Email: 'harshavardhan.n@yahoo.com',
							Name: 'Harshavardhan'
						},
						{
							Email: 'ngshvardhan@gmail.com',
							Name: 'Harshavardhan'
						}
					],
					Subject: 'mailjet npm',
					TextPart: 'mailjet npm',
					HTMLPart:
						"<h3>Dear passenger 1, welcome to <a href='https://www.mailjet.com/'>Mailjet</a>!</h3><br />May the delivery force be with you!",
					CustomID: 'AppGettingStartedTest'
				}
			]
		});
		request
			.then(result => {
				console.log(result.body);
			})
			.catch(err => {
				console.log(err.statusCode);
			});
	} else {
		// TODO: send a OTP or something to the mobile
	}
}
// const msg = {
//   to: 'ngshvardhan@gmail.com',
//   from: 'test@example.com',
//   subject: 'Testing aparatment management',
//   text: 'and easy to do anywhere, even with Node.js',
//   html: '<strong>and easy to do anywhere, even with Node.js</strong>',
// };
// sgMail.send(msg);

module.exports = sendPasswordSetupLink;
