const express									= require('express')
const mongoose								= require('mongoose')
const passport								= require('passport')
const TenantDetails 					= require('../../models/TenantDetails')
const router 									= express.Router();
const ObjectId 								= mongoose.Types.ObjectId;

router.get('/add-tenant',passport.authenticate('jwt', {session: false}), (req, res, next) => {
	const { _id: user_id } = req.user;
	res.render('add_tenant')
});


router.post('/add-tenant', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	const { _id } = req.user
	let tenantData = { ...req.body, _userId: _id }

	let newTenant = new TenantDetails(tenantData);
	newTenant.save().then(() => {
		res.render('add_tenant', { newTenant, success_msg: 'Successful'} )
	}).catch(next)

	// TenantDetails.findOneAndUpdate({ _id: _id }, tenantData, { new:true, upsert: true }).then((data) => {
	// })
})

router.get('/view-tenants', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	const { _id } = req.user

	TenantDetails.find({_userId: _id }).then(data => {
		res.render('view_tenants', { tenants: data } )
	})
})

router.get('/update-tenant/:id', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	const { id } = req.params
	TenantDetails.findOne({ _id: id }).then(data => {
		res.render('update_tenant', data)
	})
})

router.post('/update-tenant/:id', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	const { id } = req.params
	let tenantData = {...req.body}
	TenantDetails.findOneAndUpdate({ _id: id }, tenantData, {new: true, upsert: true}).then(data => {
		res.render('add_tenant', data)
	}).catch(next)
})





module.exports = router