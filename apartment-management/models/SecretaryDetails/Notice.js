const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')

const NoticeSchema = new mongoose.Schema({
    refno:{
        type: String
    },
    date :{
        type : Date
    },
    from :{
        type: String
    },
    to:{
        type: String
    },
    title:{
        type: String
    },
    msg:{
        type: String
		},
		isApproved: {
			type: Boolean,
			default: false
		}
})

const Notice = mongoose.model('Notices',NoticeSchema)

module.exports = Notice ;
