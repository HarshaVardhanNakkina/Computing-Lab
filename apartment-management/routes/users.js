const express = require('express');
const router = express.Router();

// User model
const User = require('../models/User');

// Password reset controllers
router.use('/pswdsetup', require('../controllers/pswdsetup'));

// Login controllers
router.use('/login', require('../controllers/login'));

// Logout controllers
router.use('/logout', require('../controllers/logout'));

// Registration controllers
router.use('/register', require('../controllers/register'));

// OTP confirmation contorller
router.use('/confirmotp', require('../controllers/confirmotp'));

module.exports = router;
