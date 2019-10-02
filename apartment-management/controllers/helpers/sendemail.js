// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
// const sgMail = require('@sendgrid/mail');
// sgMail.setApiKey(process.env.SENDGRID_AUTH);

// using mailchimp's mandrill api
// const mandrill = require('mandrill-api/mandrill');
// const mandrill_client = new mandrill.Mandrill(process.env.MANDRILL_API_KEY);

// mailjet
// const mailjet = require('node-mailjet');

// node-mailer
const nodemailer = require('nodemailer');

// node-mailer
// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
	host: 'in-v3.mailjet.com',
	port: 587,
	secure: false, // true for 465, false for other ports
	auth: {
		user: process.env.MAILJET_USER,
		pass: process.env.MAILJET_AUTH
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
		user: process.env.SENDGRID_USER,
		pass: process.env.SENDGRID_AUTH
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
	html:
		'<strong>sendgrid npm and easy to do anywhere, even with Node.js</strong>'
};
sgMail.send(msg);

// const msg = {
//   to: 'ngshvardhan@gmail.com',
//   from: 'test@example.com',
//   subject: 'Testing aparatment management',
//   text: 'and easy to do anywhere, even with Node.js',
//   html: '<strong>and easy to do anywhere, even with Node.js</strong>',
// };
// sgMail.send(msg);
