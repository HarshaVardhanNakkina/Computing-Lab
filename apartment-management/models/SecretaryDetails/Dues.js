const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')

const DueSchema = new mongoose.Schema({

    amount:{
        type : String,
        required : true
    },
    duemonth:{
        type: String,
        requitred: true
    },
    duename:{
        type:String,
        required: true
    },
    approved:{
        type: String
    }
    
})

const Dues = mongoose.model('dues',DueSchema);
module.exports = Dues;