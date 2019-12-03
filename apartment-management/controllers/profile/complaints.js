const express							= require('express')
const mongoose						= require('mongoose')
const passport						= require('passport')
const ObjectId						= mongoose.Types.ObjectId
const multer							= require('multer')
const GridFsStorage				= require('multer-gridfs-storage')
const Grid 								= require('gridfs-stream')
const cryptoRandomString 	= require('crypto-random-string')
const path 								= require('path')
var mongoXlsx = require('mongo-xlsx');
// Models
const UserDetails 				= require('../../models/UserDetails')
const User 								= require('../../models/User')
const router 							= express.Router()
const Complaints  = require('../../models/SecretaryDetails/complaint')
const Complaint = require('../../models/Complaint')
const Dues  = require('../../models/SecretaryDetails/Dues')
const Employees = require('../../models/SecretaryDetails/employees')
const Notice = require('../../models/SecretaryDetails/Notice')
const Letters = require('../../models/SecretaryDetails/Letters')

router.get('/', passport.authenticate('jwt', {session: false}), (req,res,next) => {
	res.render('add_complaint')
})

router.post('/', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	const { _id } = req.user;
	console.log(req.body)
	let newComplaint = new Complaint(req.body)
	newComplaint.save().then(() => {
		res.render('add_complaint', {...newComplaint, success_msg: "created sucessfully"})
	})
})

module.exports = router