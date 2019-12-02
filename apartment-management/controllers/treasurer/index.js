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

router.post('/create-payment-record', passport.authenticate('jwt', { session: false}), (req, res, next) => {

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

router.get('/view-payments', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	Payment.find({}).then(payments => {
		res.render('view_payments', { payments })
	}).catch(next)
})

router.post('/update-payment-record', passport.authenticate('jwt', { session: false}), (req, res, next) => {
	const { _userId, paymentType, mode, amount } = req.body
	Payment.findOneAndUpdate({_userId}, { paymentType, mode, amount }, {
		new: true,
		upsert: true
	}).then( updatedPayment => {
		console.log("YAY UPDATED");
		res.redirect('/users/treasurer/view-payments/')
	}).catch(next)
})

router.delete('/delete-payment-record', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	const { _userId } = req.body
	Payment.findOneAndDelete({_userId: _userId}).then(() => {
		res.status(200).json({msg: 'Deleted'})//redirect('/users/treasurer/view-payments/')
	}).catch(next)
})

<<<<<<< HEAD
=======
router.get('/consolidated-payments', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	Payment.find({}).then(payments => {
		res.render('consolidated_payments', { payments })
	}).catch(next)
})

>>>>>>> e21797b4ad3c59889c0a52499b620485f40d9f96
module.exports = router;