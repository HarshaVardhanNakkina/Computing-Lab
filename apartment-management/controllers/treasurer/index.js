const express									= require('express')
const mongoose								= require('mongoose')
const passport 								= require('passport')
const { ensureAuthenticated} 	= require('../../auth/auth')
const TenantDetails 					= require('../../models/TenantDetails')
const User 										= require('../../models/User')
const UserDetails 						= require('../../models/UserDetails')
const router 									= express.Router();
const ObjectId 								= mongoose.Types.ObjectId;

router.get('/', (req, res, next) => {
  res.render('treasurer')
})

router.get('/view-flatowners', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	User.find({}).then((owners) => {
		owners = owners.filter((owner) => {
			return typeof owner.role === 'undefined' || owner.role === '0'
		})
		let ownerDetailsPromises = owners.map((owner) => {
			const { _id: user_id } = owner;
			return UserDetails.findOne({ _userId: user_id })
		})
		Promise.all(ownerDetailsPromises).then((details) => {
			res.render('show_flatowners', {owners: [...details]})
		}).catch(next)
	})
})


module.exports = router;