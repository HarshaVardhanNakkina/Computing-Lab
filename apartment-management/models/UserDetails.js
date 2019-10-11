const mongoose = require('mongoose');

const UserDetailsSchema = new mongoose.Schema({
  _userId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'User'
	},
	flatnum: {
		type: String,
		required: true,
		unique: true
	},
	profilepic: {
    type: String,
    default:''
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
	commaddress: {
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
