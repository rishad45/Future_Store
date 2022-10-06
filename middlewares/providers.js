const cartSchema = require('../models/cartSchema')
const wishlist = require('../models/userSchema')
module.exports = {
    giveCartLength: async (req, res, next) => {
        let count = null
        let cart = null 
        try {
            cart = await cartSchema.findOne({ userId: req.session.user._id })
        } catch (err) {
            console.error(err); 
        }
        if (cart) {
            count = cart.products.length
            console.log("cart count", count) 
        }else{
            count = 0 
        }

        let wishlistCount = null
        try {
            wishlistCount = await wishlist.wishlistModel.findOne({ userId: req.session.user._id }).count()
        } catch (err) {
            console.error(err); 
        }

        const obj = {}
        obj.cartLength = count
        obj.wishlistLength = wishlistCount
        req.counts = obj 
        next()
    }
}