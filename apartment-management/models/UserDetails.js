const mongoose = require('mongoose');

const UserDetailsSchema = new mongoose.Schema({
	flatnum: {
		type: String,
		required: true,
		unique: true
	},
	profilepic: {
		type: String,
		required: true
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
	comaddress: {
		type: String,
		required: true
	},
	permaddress:{
		type: String,
		required: true
	}
});

const UserDetails = mongoose.model('UserDetails', UserDetailsSchema);

module.exports = UserDetails;
