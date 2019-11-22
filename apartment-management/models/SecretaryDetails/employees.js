const express = require('express')
const mongoose = require('mongoose')
const router = express.Router();

const Employee = new mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    occupation:{
        type: String,
        required : true
    },
    Dutytime:{
        type: String,
        required: true
    },
    shift:{
        type:String,
        required: true
    },
    Datefrom:{
        type: Date,
        required: true
    },
    Dateto:{
        type: Date,
        required: true
    },
    approved:{
        type: String
    }
})

const employee = mongoose.model('employee',Employee);
module.exports = employee;