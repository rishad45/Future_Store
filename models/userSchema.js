const mongoose = require('mongoose')
const productModel = require('./productSchema')
const couponsModel = require('../models/couponSchema')


const addressSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    mobile: {
        type: Number,
        required: true,
        maxLength: 10
    },
    email: {
        type: String,
        required: true
    },
    locality: {
        type: String
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String
    },
    state: String,
    landmark: {
        type: String
    },
    pincode: {
        type: Number,
        required: true
    },
    alternatePhone: {
        type: Number
    },
    addressType: {
        type: String
    }
})

const couponIdModel = new mongoose.Schema({
    couponId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: couponsModel 
    },
    redeemed : {
        type: Boolean,
        default : false 
    } 
})

// schema for users cart

// basic schema for the user
const userschema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    mobile: {
        type: Number,
        required: true,
        unique: true
    },
    banned: {
        type: Boolean,
        default: 0
    },
    address: [addressSchema],
    coupons: [couponIdModel]


}, { timestamps: true },
    {
        collection: 'Users'
    }
);






// .......schema for wishlist
// <- =========WISHLIST============== ->
const wishlistSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'model'
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: productModel.productModel
    }
}, { timestamps: true })




const model = mongoose.model('userModel', userschema)
const wishlistModel = mongoose.model('wishlistModel', wishlistSchema)

module.exports = { model, wishlistModel }

