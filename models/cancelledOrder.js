const { default: mongoose } = require("mongoose");
const orderModel = require("./orderModel");
const productModel = require('./productSchema') 

const cancelledOrders = mongoose.Schema({
    orderId : {
        type: mongoose.Types.ObjectId,
        ref: 'orderModel',
        required: true
    },
    productId: {
        type : mongoose.Types.ObjectId,
        ref : 'orderModel',
        required : true 
    },
    reason: {
        type:  String,
        required : true
    },
    paymentRefundStatus:{
        type: Boolean,
        required : true
    }
})

const cancelledOrdersModel = mongoose.model('cancelledOrdersModel',cancelledOrders) 

module.exports = cancelledOrdersModel