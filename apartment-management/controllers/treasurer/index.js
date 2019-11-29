const express									= require('express')
const mongoose								= require('mongoose')
const passport 								= require('passport')
const TenantDetails 					= require('../../models/TenantDetails')
const User 										= require('../../models/User')
const UserDetails 						= require('../../models/UserDetails')
const Payment 								= require('../../models/Payment')
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

router.get('/create-payment-record/:id', passport.authenticate('jwt', { session: false}), (req, res, next) => {
	
	const { ownerId } = req.params
	const { user_id } = req.user
	
	res.render('payment_record')

})

router.post('/create-payment-record/:id', passport.authenticate('jwt', { session: false}), (req, res, next) => {
	
	const { ownerId } = req.params
	const { user_id } = req.user

	let paymentDetails = req.body
	const { _userId } = paymentDetails

	UserDetails.findOne({ _userId }).then((data) => {
		const { flatnum, name } = data
		const madeBy = { flatnum, name } 
		paymentDetails = {...paymentDetails, flatnum, madeBy }
		paymentRec = new Payment(paymentDetails)
		paymentRec.save().then((r) => {
			res.status(200).json({msg: 'Created successfully'})
		}).catch((err) => {
			console.log(err);
			res.status(500).json({msg: 'An error occured'})
		})
	}).catch(next)


})


module.exports = router;