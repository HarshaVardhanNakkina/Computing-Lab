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

// router.get('/:user_id', (req, res, next) => {
// 	const { user_id } = req.params;
// 	TenantDetails.find({_userId: user_id}).then((data) => {
// 		res.render('list_tenants', { data });
// 	})
// })

// router.post('/add-tenant', ensureAuthenticated, (req, res, next) => {
// 	const { user_id, tenant_id } = req.query
// 	let tenantDet = {...req.body, _userId: ObjectId(user_id)}
// 	TenantDetails.findOneAndUpdate({_userId: user_id}, tenantDet, {new: true, upsert: true}).then((newDetails) => {
// 		req.flash('success_msg', 'updated successfully')
// 		req.flash('user_id', user_id)
// 		res.redirect(`/users/tenants/${user_id}`)
// 	}).catch(next)
// })

router.post('/add-tenant', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	const { _id } = req.user
	let tenantData = { ...req.body, _userId: _id }

	TenantDetails.findOneAndUpdate({ _userId: _id }, tenantData, { new:true, upsert: true }).then((data) => {
		res.render('add_tenant', { ...data, success_msg: 'Successful'} )
	})
})

router.get('/update-tenant', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	const { _id } = req.user

	let tenantData = { ...req.body, _userId: _id }

	TenantDetails.findOne({_userId: _id }).then(data => {
		res.render('add_tenant', {data} )
	})
})

router.post('/update-tenant', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	const { _id } = req.user
	let tenantData = { ...req.body, _userId: _id }

	TenantDetails.findOneAndUpdate({_userId}, tenantData, { new:true, upsert: true }).then((data) => {
		res.render('update-tenant', { ...data, success_msg: 'Successful'} )
	})
})


module.exports = router