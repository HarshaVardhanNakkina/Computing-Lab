const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');	
const nodemailer = require("nodemailer");

// User model
const User = require('../models/User');

// Verification email
async function sendVerficationMail() {
  console.log('I am sending...')
    
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 25,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "jude.kilback48@ethereal.email",
      pass: "F2n5Mt6KGy9X1EWnB3"
    }
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: "bar@example.com, baz@example.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>" // html body
  });

  console.log('Message sent: %s', info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}




// Register Page
router.get('/', (req, res) => {
  sendVerficationMail().catch(err => {
    console.log('caught')
    console.error(err);
  });
  res.render('register')
});

// Register Handler
router.post('/', (req, res) => {
	// const { doornum, email, mobile, password, password2 } = req.body;
	const { doornum, email, mobile} = req.body;
	let errors = [];

	// check required fields
  // if (!doornum || !(email || mobile) || !password || !password2)
	if (!doornum || !(email || mobile))
    errors.push({ msg: 'Please fill in the required fields' });

	// check passwords match
	// if (password !== password2) errors.push({ msg: 'Passwords do not match' });

	// check password length
	// if (password.length < 6)
  //   errors.push({ msg: 'Password should be atleast 6 characters' });
  
  // check for email or mobile
  if(!(email || mobile)) 
    errors.push({msg: 'Email or Mobile number is required'});

  // door number regex check
  if(!doornum.match(/^\d\-[A-Z]{1}\-\d{2}\-\d{3}\/\d$/g))
    errors.push({msg: 'Door number format is not correct'});

  // mobile number regex
  if (mobile.length > 0 && !mobile.match(/^\d{10}$/g))
    errors.push({ msg: 'Enter a valid mobile number' });

	if (errors.length > 0) {
		res.render('register', {
			errors,
			doornum,
      email,
      mobile
		});
	} else {
		// Validation passed
		User.findOne({ doornum: doornum }).then(user => {
			if (user) {
				// Email already registered
				errors.push({ msg: 'Email is already registered' });
				res.render('register', {
          errors,
          doornum,
          email,
          mobile
        });
			} else {
				const newUser = new User({
          doornum,
          email,
          mobile
        });
        newUser
          .save()
          .then(user => {
            req.flash('success_msg', 'Verify your email/mobile and set your password');
            res.redirect('/users/login');
          })
          .catch(console.log);

				// Hash Password
        /*
          bcrypt.genSalt(10, (err, salt) =>
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              // Set password to hashed password
              newUser.password = hash;
              newUser
                .save()
                .then(user => {
                  req.flash(
                    'success_msg',
                    'You are now registered and can login'
                  );
                  res.redirect('/users/login');
                })
                .catch(console.log);
            })
          );
        */
			}
		});
	}
});


module.exports = router;