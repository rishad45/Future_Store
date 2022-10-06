const { default: mongoose } = require("mongoose");
// required models 
const userModel = require('../models/userSchema')
const productModel = require('../models/productSchema')

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'userModel.model'
    },
    products: [ { 
        productId: { type: mongoose.Types.ObjectId, ref: 'productModel' },
        quantity: Number, 
        orderStatus: {  
            type: String,
            required: true,
            enum: ['created', 'placed', 'pending', 'shipped', 'delivered', 'canceled', 'returned']
        },
        expectedDate:{
            type: Date,
            default: () => new Date(+new Date() + 10*24*60*60*1000)  
        }
    }],
    paymentMethod: {
        type: String,
        enum: ['COD', 'RAZOR', 'PAYPAL']
    },
    paymentId: {
        type: String
    },
    paymentStatus: {
        type: String,
        required: true,
        enum: ['pending', 'fulfilled', 'failed','refunded'] 
    },
    subTotal: {
        type: Number,
        required: true
    },
    couponsDiscount: {
        type: Number,
        default: 0
    },
    metacoinsAdded: {
        type: Number,
        default: 0
    },
    GrandTotal: {
        type: Number,
        required: true
    }, 
    userAddress: {
        type: mongoose.Types.ObjectId,
        ref: 'usermodels'
    }
}, { timestamps: true })

module.exports = mongoose.model('order', orderSchema) 