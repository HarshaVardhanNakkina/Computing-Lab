const mongoose = require('mongoose');

const TenantDetailsSchema = new mongoose.Schema({
  _userId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'User'
	},
	name: {
		type: String,
		required: true
	},
	fathername: {
		type: String,
		required: true
	},
	mothername: {
		type: String,
		required: true
	},
	occupation: {
		type: String,
		default: null
	},
	permaddress:{
		type: String,
		required: true
	},
	mobile: {
		type: String, 
		required: true
	},
	email: {
		type: String,
		required: true
	},
	vehicleType: {
		type: String,
		default: ''
	},
	vehicleRegNum: {
		type: String,
		default: ''
	}
});

const TenantDetails = mongoose.model('TenantDetails', TenantDetailsSchema);

module.exports = TenantDetails;
