const { default: mongoose } = require('mongoose')
const couponSchema = require('../models/couponSchema')
const userModel = require('../models/userSchema')
module.exports = {
    createCoupon: async data => {
        await couponSchema.create({
            couponName: data.couponName,
            couponCode: data.couponCode,
            description: data.desc,
            discPercentage: data.discountPercentage,
            expiryDate: data.expiryDate,
            minimumSpend: data.minAmount
        }).then(async (res) => {
            try {
                console.log("1");
                console.log("id is", res._id);
                let newCoupon = {}
                newCoupon.couponId = res._id

                await userModel.model.updateMany({}, { $push: { coupons: newCoupon } })
            } catch (err) {
                console.error(err)
            }
        })
    },
    getAllCoupons: async () => {
        return await couponSchema.find({}).lean().exec()
    },

    // check coupon availblity
    checkCoupon: async (data, user) => {
        console.log("data is ", data);
        let couponId = await couponSchema.find({ couponCode: data }).lean().exec()
        console.log("id", couponId);
        return await userModel.model.findOne({ _id: user, coupons: { $elemMatch: { couponId: couponId } } })

    },

    // Apply coupon
    applyCoupon: async (couponCode, user) => {
        try {
            console.log("1");
            let couponId = await couponSchema.findOne({ couponCode: couponCode }, { _id: 1 })
            
            return await userModel.model.aggregate(
                [
                    {
                        '$unwind': { 
                            'path': '$coupons'
                        }
                    }, {
                        '$lookup': {
                            'from': 'coupons',
                            'localField': 'coupons.couponId',
                            'foreignField': '_id',
                            'as': 'couponsArray'
                        }
                    }, {
                        '$match': {
                            'couponsArray._id': mongoose.Types.ObjectId(couponId)    
                        }
                    },{
                        '$project':{
                            'coupons.redeemed': 1,
                            'couponsArray':1
                        }
                    }
                ]
            ).exec()  
        } catch (err) {
            console.error(err);
        }
    }
}