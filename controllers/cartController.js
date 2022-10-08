const cartRepo = require('../repository/cart')
const cartSchema = require('../models/cartSchema')
const adminRepository = require('../repository/adminRepository')


module.exports = {
    // get the cart for user
    getCartForUser: async (req, res) => {
        // -------------------------------
        const counts = req.counts
        const cartCount = counts.cartLength
        const wishlistCount = counts.wishlistLength
        // -------------------------------  
        let coupDiscPer = 0
        let coupon = null
        let couponStatus = false
        const user = req.session.user
        const userId = req.session.user._id
        const loggedIn = req.session.login

        const cart = await cartRepo.getCartById(userId)
        const cartTotal = await cartRepo.getCartTotal(userId)
        const cartLength = await cartRepo.getCartCount(userId)

        const categories = await adminRepository.getAllCategories()

        if (req.session.coupon) {
            coupon = req.session.coupon
            coupDiscPer = coupon.discPercentage
            couponStatus = true
        }
        let discountAmount = (cartTotal / 100) * coupDiscPer
        let totalPayable = cartTotal - discountAmount
        console.log("total", totalPayable);

        if (cart) {
            if (cartLength != 0) {
                res.render('users/cart', { cart, user, loggedIn, cartTotal, cartLength, coupDiscPer, coupon, totalPayable, couponStatus,cartCount,wishlistCount,categories })
            } else {
                res.render('users/empty',{cartCount,wishlistCount,categories})
            }

        } else {
            res.render('users/empty',{cartCount,wishlistCount,categories})
        }
    },
    // add product to cart
    addToCart: async (req, res) => {
        if (req.session.login) {
            const userId = req.session.user._id
            const productId = req.params.id
            // const productId = req.body.productId
            const cart = await cartRepo.getCartById(userId)
            if (cart) { 
                // check the product is exist in users cart or not 
                try {
                    const index = await cartRepo.checkCartForPrdctIndex(userId, productId)
                    console.log(index)
                    // const product = await cartRepo.checkCartForProduct(userId, productId)
                    if (index != -1) {
                        // product exist in users cart
                        // so increment the cart quantity && total will be price*quantity 
                        await cartRepo.incrementTheIndex(userId, productId)
                        res.redirect('/cart') 
                    } else {
                        // product is not in cart 
                        // get the product details && push item to cart
                        const prod = await cartRepo.getProductById(productId)
                        // push productId into product array
                        await cartRepo.pushProduct(userId, productId)
                        res.redirect('/cart');
                    }
                } catch (err) {
                    console.log(err);
                }
            } else {
                // user have no cart .... so create one with the new product
                try {
                    await cartRepo.createCart(productId, userId)
                    res.redirect('/cart') 
                } catch (err) {
                    res.send("can't create a cart because of " + err)
                }
            }
        } else {
            res.redirect('/login')
        }

    },

    removeProduct: async (req, res) => {
        await cartRepo.removeProduct(req.body.cart, req.body.product)
    },
    changeProductQty: async (req, res) => {
        await cartRepo.changeProductQty(req.body.cart, req.body.product, req.body.count)
    }
}