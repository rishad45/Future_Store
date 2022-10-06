const { default: mongoose } = require("mongoose");
const productModel = require("../models/productSchema")
const userModel = require('../models/userSchema')

const cartSchema = new mongoose.Schema({
    products: [ {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'productModel'
        },
        quantity: {
            type: Number,
            default: 1
        },
        orderStatus: {  
            type: String,
            required: true,
            enum: ['created', 'placed', 'pending', 'shipped', 'delivered', 'canceled', 'returned'],
            default: 'created'
        } 
    }
    ],
    userId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userModel.model'
    }
}, { timestamps: true })

module.exports = mongoose.model('cart', cartSchema)