const  express = require('express')
const mongoose = require('mongoose')

const SecretarySchema = new mongoose.Schema({
    _userId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'User'
    },
    name: {
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
	}
})

const SecretaryModel = mongoose.model('Secretary',SecretarySchema);

module.exports = SecretaryModel;