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

module.exports = router