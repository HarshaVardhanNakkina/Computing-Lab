const express = require('express')
const router = express.Router();
const mongooose = require('mongoose')

const complaint = new mongooose.Schema({
    
    against:{
        type:String,
        required: true
    },
    cause:{
        type:String,
        required: true
    },
    approved:{
        type: String
    }
})

const Complaint = mongooose.model('complaint',complaint);
module.exports = Complaint;