const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/', (req, res, next) => {
  res.send("password reset is happening");
  console.log('password reset is happening'); 
})

module.exports = router;