const wishlist = require('../models/userSchema')
module.exports={
    getWishlistCount: async userId=>{ 
        return await wishlist.wishlistModel.find({userId:userId}).count() 
    }
}