const express									= require('express')
const mongoose								= require('mongoose')
const passport 								= require('passport')
const TenantDetails 					= require('../../models/TenantDetails')
const User 										= require('../../models/User')
const UserDetails 						= require('../../models/UserDetails')
const Payment 								= require('../../models/Payment')
const Notice 									= require('../../models/SecretaryDetails/Notice')
const router 									= express.Router();
const ObjectId 								= mongoose.Types.ObjectId;


router.get('/', (req, res, next) => {
	res.render('president')
})

router.get('/view-flatowners', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	User.find({}).then((owners) => {
		owners = owners.filter((owner) => {
			return typeof owner.role === 'undefined' || owner.role === '5'
		})
		let ownerDetailsPromises = owners.map((owner) => {
			console.log(owner);
			const { _id: user_id } = owner;
			return UserDetails.findOne({ _userId: user_id })
		})
		Promise.all(ownerDetailsPromises).then((details) => {
			console.log(details)
			details = details.filter(user => user && !user.isApproved)
			res.render('view_owners', {owners: [...details]})
		}).catch(next)
	})
})

router.post('/approve-user', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	const { user_id } = req.body
	UserDetails.findOneAndUpdate({ _id: user_id }, { isApproved: true}, {new: true, upsert: true}).then((approvedUser) => {
		res.status(200).json({msg: 'Success'})
	}).catch(err => {
		res.status(400).json({msg: "Error occured"})
	})
})

router.get('/viewnotices', passport.authenticate('jwt', {session: false}),(req, res, next) => {
	Notice.find({}).then(notices => {
		console.log(notices);
		notices = notices.filter(n => n)
		res.render('view_notices', { notices })
	})
})

router.post('/approve-notice', passport.authenticate('jwt', {session: false}),(req, res, next) => {
	const { id } = req.body 
	Notice.findOneAndUpdate({_id: id}, {isApproved: true}, {new: true, upsert: true }).then(updatedNotice => {
		res.status(200).json({msg: 'Succsess'})
		// Notice.find({}).then(notices => {
		// 	console.log(notices);
		// 	notices = notices.filter(n => n)
		// 	res.render('view_notices', { notices })
		// })
	}).catch(err => {
		res.status(400).json({msg: 'Error occured'})
	})
})


module.exports = router