const cartSchema = require('../models/cartSchema')
const productSchema = require('../models/productSchema')
module.exports = {
    getCartById: async (userId) => {
        const isHave = await cartSchema.findOne({ userId: userId }).lean().exec()
        if (isHave) {
            console.log("have cart");
            const allProducts = await cartSchema.aggregate(
                [
                    {
                        '$match': {
                            'userId': userId
                        }
                    },
                    {
                        '$unwind': "$products"
                    },
                    {
                        '$project': {
                            'products.productId': 1,
                            'products.quantity': 1,
                            'discountPercentage':1 
                        }
                    },
                    {
                        '$lookup': {
                            'from': 'productmodels',
                            'localField': 'products.productId',
                            'foreignField': '_id',
                            'as': 'product'
                        }
                    },
                    {
                        '$project': {
                            'products.productId': 1,
                            'products.quantity': 1,
                            'discountPercentage':1 ,
                            'product': { $arrayElemAt: ['$product', 0] }
                        }
                    }
                ]
            ).exec() 
            return allProducts
        }

    },
    createCart: async (proId, userId) => {
        await cartSchema.create({
            userId: userId,
            products: [{ 
                productId: proId
            }]
        }) 
    },
    // check whether the users cart have the specified product or not
    checkCartForPrdctIndex: async (userId, prodId) => {
        const cart = await cartSchema.findOne({ userId: userId }) 
        const index = cart.products.findIndex(products => products.productId == prodId) 
        return index
    },
    // increment quantity when user clicks add to cart for existing product 
    incrementTheIndex: async (userId, prodId) => {
        await cartSchema.updateOne({ userId: userId, "products.productId": prodId },
            { $inc: { "products.$.quantity": 1 } } 
        )
    },
    checkCartForProduct: async (userId, prodId) => {
        const pr = await cartSchema.findOne({ $and: [{ userId: userId }, { "products.productId": prodId }] }).lean().exec()
        return pr
    },
    // get the product with the product id
    getProductById: async productId => {
        const pr = await productSchema.productModel.findOne({ _id: productId })
        return pr
    },
    // push product into product array of the user
    pushProduct: async (usrId, prdId) => {
        console.log("pushing ...");
        const obj = {
            productId: prdId,
            quantity: 1
        }
        await cartSchema.updateOne({ userId: usrId }, { $push: { products: obj } })
    },
    // get cart count 
    getCartCount: async userId => { 
        let cart = null
        let count = null
        cart = await cartSchema.findOne({ userId: userId })
        if (cart) {
            count = cart.products.length
        }
        return count
    },
    // change product quantity
    changeProductQty: async (cartId, prodId, count) => {
        try {
            await cartSchema.updateOne({ _id: cartId, "products.productId": prodId },
                { $inc: { "products.$.quantity": count } }  
            ).exec()  
        } catch (err) {
            console.log(err) 
        }
    },

    // remove product from cart
    removeProduct: async (cartId, productId) => {
        try {
            await cartSchema.updateOne({ _id: cartId } 
                , {
                    $pull:
                    {
                        products:
                            { productId: productId }

                    }
                })
        } catch (err) {
            console.log(err);
        }
    },
    // get total cart amount 
    getCartTotal: async userId => { 
        const cartTotal = await cartSchema.aggregate(
            [
                {
                    '$match': {
                        'userId': userId
                    }
                },
                {
                    '$unwind': "$products"
                },
                {
                    '$project': {
                        'products.productId': 1,
                        'products.quantity': 1,
                        'discountPercentage':1
                    }
                },
                {
                    '$lookup': {
                        'from': 'productmodels',
                        'localField': 'products.productId',
                        'foreignField': '_id',
                        'as': 'product'
                    }
                },
                {
                    '$project': {
                        'products.productId': 1,
                        'products.quantity': 1,
                        'discountPercentage':1,
                        'product': { $arrayElemAt: ['$product', 0] }
                    }
                },
                {
                    '$project': {
                        'total': { '$multiply': ["$products.quantity", "$product.price"] },
                        'discountPercentage':1

                    }
                }
            ]
        ).exec() 

        let GrandTotal = 0
        cartTotal.forEach(function (item) {
            GrandTotal = GrandTotal + item.total
        }) 
        
        return GrandTotal

    },
    // delete cart by userid
    deleteCartByUser:async userId=>{
        try{
            await cartSchema.deleteOne({userId:userId})
        }catch(err){
            console.error(err); 
        }
        
    }

}