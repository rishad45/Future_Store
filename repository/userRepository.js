// requiring models
const cartSchema = require('../models/cartSchema')
const userSchema = require('../models/userSchema')
const orderModel = require('../models/orderModel')
const productModel = require('../models/productSchema')
const couponsModel = require('../models/couponSchema')
const cancelledOrdersModel = require('../models/cancelledOrder')
// requiring razorPay
const Razorpay = require('razorpay');

// other requirements
const { resolve, reject } = require('promise');
const { default: mongoose, model } = require('mongoose');
const { subCategoryModel, vendorModel } = require('../models/productSchema');
const { json } = require('body-parser')

// creating instance 
let instance = new Razorpay({
    key_id: 'rzp_test_jwDTlUJaAFAea0',
    key_secret: 'SwH1rXBc8WNdtlqeEY9fwkk1',
});
module.exports = {
    saveAddress: async (data, userId) => {
        try {
            const address = {
                fullname: data.fullName,
                mobile: data.mobile,
                email: data.email,
                locality: data.locality,
                address: data.address,
                city: data.city,
                state: data.state,
                landmark: data.landmark,
                pincode: data.pincode,
                alternatePhone: data.altPhone,
                addressType: data.addType
            }
            await userSchema.model.updateOne({ _id: userId }, { $push: { address: address } })
        } catch (err) {
            console.error(err)
        }
    },

    placeOrder: async (data, products, total, sub, couponStatus, coupon) => {
        console.log("data in placeorder => ", data)
        try {
            return await orderModel.create({
                userId: data.userId,
                products: products,
                paymentMethod: data.paymentMethod,
                paymentStatus: 'pending',
                subTotal: sub,
                GrandTotal: total,
                userAddress: data.address
            }).then(async (res) => {
                return res._id
            })

        } catch (err) {
            console.error(err);
        }
    },

    // get address for checkout
    getAddress: async userId => {
        try {
            const addresses = await userSchema.model.findOne({ _id: userId }, { address: 1, _id: 0 }).lean().exec()
            return addresses
        } catch (err) {
            console.error(err);
        }
    },

    // remove address 
    removeAddress: async (userId, addressId) => {
        console.log("here also");
        try {
            await userSchema.model.updateOne({ _id: userId },
                {
                    $pull:
                    {
                        address:
                            { _id: addressId }
                    }
                }
            ).exec()
        } catch (err) {
            console.error(err);
        }
    },
    // get cart
    getCartByUser: async userId => {
        const cart = await cartSchema.aggregate(
            [
                {
                    '$match': {
                        userId: userId
                    }
                }, {
                    '$project': {
                        '_id': 0,
                        'products.productId': 1,
                        'products.quantity': 1,
                        'products.orderStatus': 1
                    }
                }
            ]
        ).exec()
        return cart
    },
    genereateRazorPay: async (orderId, total) => {
        try {
            let test
            await instance.orders.create({
                amount: total * 100,
                currency: "INR",
                receipt: orderId,
            },
                (err, order) => {
                    if (err) {
                        console.error(err);
                    } else {
                        console.log("generating razzor pay now created order is => ", order)
                        test = order
                        // return order
                    }
                })
            // console.log("test", test)

            return test
        } catch (err) {
            console.log(err);
        }
    },
    changeOrderStatus: async orderId => {
        try {
            console.log(orderId);
            await orderModel.updateMany({ _id: orderId, "products.orderStatus": 'created' }, { $set: { paymentStatus: 'fulfilled', "products.$.orderStatus": 'placed' } })

            return true
        } catch (err) {
            console.log(err);
        }
    },
    changeName: async data => {
        try {
            const filter = { _id: data.id }
            const update = { username: data.newName }
            const doc = await userSchema.model.findOneAndUpdate(filter, update, {
                new: true
            })
            return doc
        } catch (err) {
            console.error(err)
        }

    },
    changeEmail: async data => {
        try {
            const filter = { _id: data.id }
            const update = { email: data.newEmail }
            const doc = await userSchema.model.findOneAndUpdate(filter, update, {
                new: true
            })
            return doc
        } catch (err) {
            console.error(err)
        }

    },

    changeMobile: async data => {
        try {
            const filter = { _id: data.id }
            const update = { mobile: data.newMobile }
            const doc = await userSchema.model.findOneAndUpdate(filter, update, {
                new: true
            })
            return doc
        } catch (err) {
            console.error(err)
        }

    },

    findUserById: async id => {
        await userSchema.model.findById(id)
    },

    // get orders of the user
    getOrders: async id => {
        return await orderModel.aggregate(
            [
                {
                    '$match': {
                        'userId': id
                    }
                }, {
                    '$unwind': {
                        'path': '$products'
                    }
                }, {
                    '$lookup': {
                        'from': 'productmodels',
                        'localField': 'products.productId',
                        'foreignField': '_id',
                        'as': 'productDetail'
                    }
                },
                {
                    '$project': {
                        'userId': 1,
                        'userAddress': 1,
                        'products': 1,
                        'createdAt': 1,
                        'updatedAt': 1,
                        'productDetail.productTitle': 1,
                        'productDetail.coverImage': 1,
                        'productDetail.price': 1,
                        'total': {
                            '$multiply': ['$products.quantity', { '$arrayElemAt': ['$productDetail.price', 0] }]
                        }
                    }
                },
                {
                    '$sort': {
                        'createdAt': -1
                    }
                }
            ]
        ).exec()
    },
    //get single order
    getSingleOrder: async id => {
        return await orderModel.aggregate(
            [
                {
                    '$match': {
                        'products._id': mongoose.Types.ObjectId(id)
                    }
                }, {
                    '$unwind': {
                        'path': '$products'
                    }
                }, {
                    '$match': {
                        'products._id': mongoose.Types.ObjectId(id)
                    }
                }, {
                    '$lookup': {
                        'from': 'productmodels',
                        'localField': 'products.productId',
                        'foreignField': '_id',
                        'as': 'productDetail'
                    }
                }, {
                    '$project': {
                        'userId': 1,
                        'userAddress': 1,
                        'products': 1,
                        'createdAt': 1,
                        'updatedAt': 1,
                        'productDetail.productTitle': 1,
                        'productDetail.coverImage': 1,
                        'productDetail.price': 1,
                        'couponsDiscount': 1,
                        'paymentMethod': 1,
                        'paymentStatus': 1,
                        'total': {
                            '$multiply': [
                                '$products.quantity', {
                                    '$arrayElemAt': [
                                        '$productDetail.price', 0
                                    ]
                                }
                            ]
                        }
                    }
                }, {
                    '$lookup': {
                        'from': 'usermodels',
                        'localField': 'userAddress',
                        'foreignField': 'address._id',
                        'as': 'Address'
                    }
                }
            ]
        )
    },
    cancelOrder: async (id, order, reason) => {
        try {
            await orderModel.updateOne({ $and: [{ _id: order }, { 'products._id': id }] }, { $set: { 'products.$.orderStatus': 'canceled' ,'paymentStatus': 'refunded'} }).then((res) => {
                console.log(res)
            })
            console.log(id, order, reason)
            await cancelledOrdersModel.create({
                orderId: order,
                productId: id,
                reason: reason,
                paymentRefundStatus: false
            })
        } catch (err) {
            console.error(err);
        }
    },

    // get all order statuses
    getAllStatuses: async () => {
        return await orderModel.distinct('products.orderStatus')
    },

    getSubCats: async cats => {
        return await subCategoryModel.find({ categoryId: cats }).lean().exec()
    },
    getCategoryByName: async name => {
        return await productModel.CategoriesModel.findOne({ categoryTitle: 'Headset' }).lean().exec()
    },
    getAllVendors: async () => {
        return await vendorModel.find({}).lean().exec()
    },
    getAllProducts: async (catId) => {
        return await productModel.productModel.find({ categoryId: catId }).lean().exec()
    },
    getAllCoupons: async userId => {
        try {
            //    let couponIds = Array.prototype.slice.call(await userSchema.model.find({_id : userId},{coupons : 1}) ,0)
            //    .map(element=> element.coupons.map( element => { 
            //        return element.couponId;
            //      }));

            //     let coupons = await couponsModel.find({_id : {$in : couponIds[0]}}) 
            //     console.log("abc", coupons); 
            //     let last = await userSchema.model.aggregate
            //     return coupons
            return await userSchema.model.aggregate(
                [
                    {
                        '$match': {
                            '_id': userId
                        }
                    }, {
                        '$unwind': {
                            'path': '$coupons'
                        }
                    }, {
                        '$lookup': {
                            'from': 'coupons',
                            'localField': 'coupons.couponId',
                            'foreignField': '_id',
                            'as': 'couponDetails'
                        }
                    }, 
                    {
                        '$project': {
                            'couponDetails': 1,
                            'coupons':1
                        }
                    },
                    {
                        $unwind:{
                            path:'$couponDetails'
                        } 
                    }
                ]
            ); 

        }
        catch (e) {
            return e;
        }
    }
}