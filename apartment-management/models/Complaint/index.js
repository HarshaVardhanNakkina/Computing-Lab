const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
  against: {
    type: String,
    required: true
  },
	cause: {
		type: String,
		required: true
	},
	approved:{
		type: String,
		default :"Not approved"
	}
});

const Complaint = mongoose.model('Complaint', ComplaintSchema);

module.exports = Complaint;
