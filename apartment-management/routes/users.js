const express = require('express');
const router = express.Router();

// User model
const User = require('../models/User');

// Login controller
router.use('/login', require('../controllers/login'));

// Logout controller
router.use('/logout', require('../controllers/logout'));

// Registration controller
router.use('/register', require('../controllers/register'));

// OTP confirmation contorller
router.use('/confirmotp', require('../controllers/otp_confirmation'));

// Password setup controller
router.use('/pswdsetup', require('../controllers/pswd_setup'));

router.use('/profile', require('../controllers/profile'));

module.exports = router;
