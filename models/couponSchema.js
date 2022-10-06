const { default: mongoose } = require('mongoose')
const userModel = require('../models/userSchema')

const couponSchema = new mongoose.Schema({
    couponName:{
        type:String,
        required: true
    },
    couponCode:{
        type: String,
        required: true
    },
    discPercentage:{
        type: Number,
        min: 1,
        max: 70,
        required: true
    },
    expiryDate:{
        type:Date,
        required: true
    }, 
    minimumSpend:{ 
        type: Number,
        required : true
    }, 
    description: String,
    usedCount:{
        type: Number,
        default : 0
    },
    totalRedeemed:{
        type: Number,
        default : 0
    } 
},{timestamps:true});

const coupons = mongoose.model('coupons',couponSchema)
module.exports = coupons