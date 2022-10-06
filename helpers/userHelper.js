const Products = require('../models/productSchema') 
const Admin = require('../models/adminSchema')
const User = require('../models/userSchema')


module.exports={
    checkWishlist:async(proId)=>{
        let exists = await User.wishlistModel.countDocuments({productId:proId},{limit:1}) 
    },
    hello:()=>{
        let str = 'Rishad'
        console.log(Buffer.from(str).toString('base64'))
        
    }
}