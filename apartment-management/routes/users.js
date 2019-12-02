const express = require('express');
const router = express.Router();

// User model
const User = require('../models/User');
const Secretaryschema = require('../models/SecretaryDetails/SecretarySchema')
const Dues = require('../models/SecretaryDetails/Dues')
const Complaint = require('../models/SecretaryDetails/complaint')
const Employee = require('../models/SecretaryDetails/employees')

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

router.use('/tenants', require('../controllers/tenant'));

router.use('/treasurer', require('../controllers/treasurer'))

router.use('/president', require('../controllers/president'))

module.exports = router;
