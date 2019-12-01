const express = require('express')
const mongoose = require ('mongoose')
const router = express.Router();

const LetterSchema = new mongoose.Schema({
    refno:{
        type : String
    },
    date :{
        type : Date
    },
    from :{
        type: String,
        
    },
    to:{
        type: String
    },
    Subject :{
        type: String
    },
    dear :{
        type: String,
        default : "Dear Sir/Madam"
    },
    matter :{
        type: String
    }

})

const Letter = mongoose.model('Letters',LetterSchema)
module.exports = Letter ;