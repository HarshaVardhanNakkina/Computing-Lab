const express		= require('express')
const mongoose	= require('mongoose')
const { ensureAuthenticated} = require('../../auth/auth')
const TenantDetails = require('../../models/TenantDetails')
const router = express.Router();
const ObjectId = mongoose.Types.ObjectId;

router.get('/', (req, res, next) => {
  res.render('treasurer')
})


module.exports = router;