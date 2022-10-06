// schema requirements
const userBase = require('../models/userSchema')
let ProductMdl = require('../models/productSchema')

// repositories
const userRepo = require('../repository/userRepository')
const cartRepo = require('../repository/cart')
const couponRepo = require('../repository/couponRepository')
// const wishlistRepo = require('../repository/wishlistRepository')

// helpers
const razorpayHelper = require('../helpers/razorPayHelper')
const paypalHelper = require('../helpers/paypalHelper')

// Controllers
const OTP = require('./authController')

// other requirements
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');
const { default: mongoose } = require('mongoose');
// const { response, response } = require('../app');
const e = require('express');
const wishlistRepository = require('../repository/wishlistRepository')
const adminController = require('./adminController')
const adminRepository = require('../repository/adminRepository')
const orderModel = require('../models/orderModel')
const cartSchema = require('../models/cartSchema')
const bannerManagementModel = require('../models/bannerModel')




// FUNCTION FOR GETTING PRODUCTS WHEN GIVING CATEGORY TITLE
function getProducts(data) {

    let products = ProductMdl.productModel.aggregate([
        {
            '$match': {
                'status': true
            }
        }, {
            '$lookup': {
                'from': 'categoriesmodels',
                'localField': 'categoryId',
                'foreignField': '_id',
                'as': 'Lookresult'
            }
        }, {
            '$match': {
                'Lookresult.categoryTitle': data
            }
        }
    ])
    return products;
};


// FUNCTION FOR GETTING SUBCATEGORIES WHEN GIVING CATEGORY TITLE
function getSubCats(data) {
    let subCat = ProductMdl.subCategoryModel.aggregate(
        [
            {
                '$match': {
                    'status': true
                }
            }, {
                '$lookup': {
                    'from': 'categoriesmodels',
                    'localField': 'categoryId',
                    'foreignField': '_id',
                    'as': 'test'
                }
            }, {
                '$match': {
                    'test.categoryTitle': data
                }
            }, {
                '$project': {
                    'subCatTitle': 1
                }
            }
        ]
    )
    return subCat
};

// FUNCTION FOR GETTING PRODUCTS WHEN GIVING SUBCATEGORYID
function getSubProducts(prod) {
    let data = ProductMdl.productModel.aggregate(
        [
            {
                '$match': {
                    'status': true
                }
            }, {
                '$lookup': {
                    'from': 'subcategorymodels',
                    'localField': 'subCatId',
                    'foreignField': '_id',
                    'as': 'result'
                }
            }, {
                '$match': {
                    'result.subCatTitle': prod
                }
            }
        ]
    )
    return data
}




// user sign in
module.exports = {
    userSignin: async (req, res, next) => {
        let user = await userBase.model.findOne({ email: req.body.email })
        if (!user) {
            req.session.errorMsg = "Entered Email is incorrect"
            res.redirect('/login') //check 1
        } else {
            if (user.banned == true) {
                // console.log(user.banned);
                res.send("your account is temporarily banned");
            } else {
                bcrypt.compare(req.body.password, user.password, (err, match) => {
                    if (match) {
                        req.session.login = true;
                        req.session.user = user
                        res.redirect('/')
                    } else {
                        req.session.login = false;
                        res.redirect('/login')
                    }
                })
            }
        }
    },


    getUserbyMobile: async (mobile) => {
        const user = await userBase.model.findOne({ mobile: mobile })
        console.log(user);
        return user
    },
    // =================== GET user H O M E P A G E 
    getHome: async (req, res, next) => {
        const categories = await adminRepository.getAllCategories()
        console.log(categories);
        let user = null;
        // -------------------------------
        const counts = req.counts
        const cartCount = counts.cartLength
        const wishlistCount = counts.wishlistLength
        // -------------------------------
        const loggedIn = req.session.login;
        if (loggedIn) {
            user = req.session.user
        }
        // Banners.................................
        const arr = await bannerManagementModel.findOne({}, { heroSliders: 1, _id: 0 })
        const arr2 = await bannerManagementModel.findOne({}, { categoryBanner: 1, _id: 0 })
        const arr3 = await bannerManagementModel.findOne({}, { shopBanner: 1, _id: 0 })
        const sliders = arr.heroSliders
        const categoryBanners = arr2.categoryBanner
        const shopBanners = arr3.shopBanner
        // New arrivals..............................
        const newArrivals = await userRepo.newArrivals()
        console.log("newArrivals", newArrivals);
        // best sellers ..............................
        const bestSellers = await userRepo.bestSellers()
        console.log("best sellers", bestSellers); 

        res.render('users/home', { loggedIn, user, categories, cartCount, wishlistCount, sliders, categoryBanners, shopBanners, newArrivals, bestSellers}) 
    },

    // get Headsets
    getHeadsets: async (req, res) => {
        const user = req.session.user
        const loggedIn = req.session.login;
        let subCats = await getSubCats('Headset')
        const categories = await adminRepository.getAllCategories()
        let id = req.params.id
        // -------------------------------
        const counts = req.counts
        const cartCount = counts.cartLength
        const wishlistCount = counts.wishlistLength
        // ------------------------------- 
        if (id == 1) {
            const temp = 1;
            let products = await getProducts('Headset')
            res.render('users/headsets', { products, subCats, temp, loggedIn, user, categories, cartCount, wishlistCount })
        } else {
            let subId = req.params.id
            let sub = await ProductMdl.subCategoryModel.findById(subId).lean().exec()
            let product = await getSubProducts(sub.subCatTitle)
            res.render('users/headsets', { product, subCats, loggedIn, user, categories, cartCount, wishlistCount })
        }

    },
    // get accessories
    getAccessories: async (req, res) => {
        // -------------------------------
        const counts = req.counts
        const cartCount = counts.cartLength
        const wishlistCount = counts.wishlistLength
        // ------------------------------- 
        const user = req.session.user
        const loggedIn = req.session.login
        const categories = await adminRepository.getAllCategories()
        let subCats = await getSubCats('Accessories')
        console.log(subCats);
        let id = req.params.id
        if (id == 1) {
            const temp = 1;
            let products = await getProducts('Accessories')
            res.render('users/accessories', { products, subCats, temp, loggedIn, cartCount, wishlistCount, categories })
        } else {
            let subId = req.params.id
            let sub = await ProductMdl.subCategoryModel.findById(subId).lean().exec()
            let product = await getSubProducts(sub.subCatTitle)
            res.render('users/accessories', { product, subCats, loggedIn, cartCount, wishlistCount, categories })
        }

    },

    // get Games
    getGames: async (req, res) => {
        // -------------------------------
        const counts = req.counts
        const cartCount = counts.cartLength
        const wishlistCount = counts.wishlistLength
        // ------------------------------- 
        const user = req.session.user
        const loggedIn = req.session.login
        let subCats = await getSubCats('Games')
        const categories = await adminRepository.getAllCategories()
        let id = req.params.id
        if (id == 1) {
            const temp = 1;
            let products = await getProducts('Games')
            res.render('users/games', { products, subCats, temp, loggedIn, categories, cartCount, wishlistCount })
        } else {
            let subId = req.params.id
            let sub = await ProductMdl.subCategoryModel.findById(subId).lean().exec()
            let product = await getSubProducts(sub.subCatTitle)
            console.log(product);
            console.log(subCats);
            res.render('users/games', { product, subCats, loggedIn, categories, cartCount, wishlistCount })
        }

    },
    // single product page
    singleProduct: async (req, res) => {
        // -------------------------------
        const counts = req.counts
        const cartCount = counts.cartLength
        const wishlistCount = counts.wishlistLength
        // ------------------------------- 
        const user = req.session.user
        const loggedIn = req.session.login
        let singleProd = await ProductMdl.productModel.findById(req.params.id)
            .populate('categoryId')
            .populate('subCatId')
            .populate('vendorId')
            .lean()
            .exec()
        console.log(singleProd.productTitle);
        const categories = await adminRepository.getAllCategories()
        res.render('users/single-product', { singleProd, loggedIn, cartCount, wishlistCount, categories })

    },

    // ======ALL ABOUT  =="WISHLIST"==  IS HERE 

    // GET WISHLIST PAGE
    getWishlist: async (req, res) => {

        if (req.session.login) {
            // -------------------------------
            const counts = req.counts
            const cartCount = counts.cartLength
            const wishlistCount = counts.wishlistLength
            // ------------------------------- 

            const user = req.session.user
            const userID = await userBase.model.findOne({ email: user.email }, { _id: 1 })
            const loggedIn = req.session.login

            const products = await userBase.wishlistModel.find({ userId: userID._id }).populate('productId').lean().exec()
            console.log(products);
            const categories = await adminRepository.getAllCategories()
            res.render('users/wishlist', { loggedIn, user, products,cartCount,wishlistCount,categories })
        } else {
            res.redirect('/login')
        }
    },
    // Add to wishlist
    addToWishlist: async (req, res) => {
        console.log("here 1");
        if (req.session.login) {
            let userEmail = req.session.user.email
            let prodId = req.params.id
            console.log(prodId);


            const user = await userBase.model.findOne({ email: userEmail }, { _id: 1 })
            let wish = await userBase.wishlistModel.countDocuments({ userId: user._id, productId: prodId }, { limit: 1 })

            if (wish == 1) {
                res.json({ cond: false })
            } else {
                const productToWishlist = await userBase.wishlistModel.create({
                    userId: user._id,
                    productId: prodId
                })

                productToWishlist.save((err, result) => {
                    if (err) {
                        res.json({ message: "error occured" })
                        console.log(err);
                    } else {

                        // action after saving 
                        // res.redirect('/wishlist')
                        res.json({ cond: true })

                    }
                })
            }

        } else {
            res.json({ status: 'login' })
            // res.redirect('/login')
        }


    },
    // delete from wishlist
    deleteFromWishlist: async (req, res) => {
        let prodId = req.params.id
        await userBase.wishlistModel.deleteOne({ productId: prodId })
        res.redirect('/wishlist')
    },

    // get account
    getUserAccount: async (req, res) => {
        let emptyCoupon
        const user = req.session.user
        // console.log(user)
        const address = await userRepo.getAddress(user._id)
        // get all coupons 
        const coupons = await userRepo.getAllCoupons(user._id)
        console.log(coupons)
        coupons.length==0 ? emptyCoupon = true : emptyCoupon = false
        console.log("emptyCoupon", emptyCoupon);
        res.render('users/userProfile', { address: address.address, user, coupons, emptyCoupon})

    },

    // save user address
    saveAddress: async (req, res) => {
        console.log("here");
        const userId = req.session.user._id
        await userRepo.saveAddress(req.body, userId)
        res.json(true)
    },

    // remove addresses
    removeAddress: async (req, res) => {
        console.log("iam here", req.body)
        const addressId = req.body.addressId
        const userId = req.session.user._id
        await userRepo.removeAddress(userId, addressId)
        res.json(true)
    },

    // get checkout page
    getCheckout: async (req, res) => {
        const user = req.session.user
        const loggedIn = req.session.login

        // coupon section
        let coupon = null
        let coupDiscPer = 0
        let couponStatus = false
        // get addresses and address index
        let isLength
        const addresses = await userRepo.getAddress(user._id)
        const length = addresses.address.length
        length > 0 ? isLength = true : isLength = false
        // get checkout items, quantity and price details
        const cart = await cartRepo.getCartById(user._id)
        if (cart) {
            let cartLength = cart.length
            console.log(user._id);
            const cartTotal = await cartRepo.getCartTotal(user._id)

            // checking coupon
            if (req.session.coupon) {
                coupon = req.session.coupon
                coupDiscPer = coupon.discPercentage
                couponStatus = true
            }
            let discountAmount = (cartTotal / 100) * coupDiscPer
            let totalPayable = cartTotal - discountAmount
            res.render('users/checkout', { user, loggedIn, addresses, isLength, cart, cartLength, cartTotal, discountAmount, totalPayable })
        } else {
            res.redirect('/')
        }

    },


    // POST checkout form
    checkoutValidate: async (req, res) => {
        const userId = req.body.userId
        // coupon section
        let coupon = null
        let coupDiscPer = 0
        let couponStatus = false

        const cart = await userRepo.getCartByUser(new ObjectId(userId));
        let total = await cartRepo.getCartTotal(new ObjectId(userId));

        // checking coupon
        if (req.session.coupon) {
            coupon = req.session.coupon
            coupDiscPer = coupon.discPercentage
            couponStatus = true
        }
        let discountAmount = (total / 100) * coupDiscPer
        let totalPayable = total - discountAmount

        const products = cart[0].products
        // create order 

        await userRepo.placeOrder(req.body, products, totalPayable, total, couponStatus, coupon).then(async (resp) => {
            try {
                console.log("userId", userId);
                // console.log("couponId", coupon._id);
                await userBase.model.updateOne(
                    {
                        $and: [
                            { _id: new ObjectId(userId) }, { 'coupons.couponId': coupon._id }
                        ]
                    },
                    {
                        $set: { 'coupons.$.redeemed': true }
                    }
                ).then((res) => {
                    console.log(res);
                })
            } catch (err) {
                console.error(err)
            }

            if (req.body.paymentMethod === 'COD') {
                // delete cart of the user
                req.session.coupon = null
                await cartRepo.deleteCartByUser(userId)
                // reCaptcha here
                // save to order collection
                // rendering success page
                res.json({ codSuccess: true });
            } else {
                console.log("order is razor ..so here=>", req.body);
                await cartRepo.deleteCartByUser(userId)
                req.session.coupon = null
                let orderId = resp.toString()
                console.log("order id ", orderId);
                const order = await userRepo.genereateRazorPay(orderId, total)
                console.log("controller order", order);
                res.json(order)
            }

        })
    },


    // POST paymentVerify
    verifyPayment: async (req, res) => {
        console.log("payment body is", req.body);
        await razorpayHelper.verifyPayment(req.body).then(async () => {
            console.log("1")
            const status = userRepo.changeOrderStatus(req.body['order[receipt]'])
            if (status) {
                console.log("2");
                // await cartRepo.deleteCartByUser(userId) 
                res.json({ status: true })
                req.session.paymentSuccess = true;
            } else {
                console.log("3");
                console.log("status last is ", status);
            }
        }).catch((err) => {
            console.log(3);
            res.json({ status: "payment failed" })
        })
    },


    // account setting
    saveChanges: async (req, res) => {
        console.log(req.body)
        if (req.body.status == 'name') {
            let newUser = await userRepo.changeName(req.body)
            req.session.user = newUser
        }
        if (req.body.status == 'email') {
            console.log("req.body", req.body);
            let newUser = await userRepo.changeEmail(req.body)
            console.log("newUser is", newUser);
            req.session.user = newUser
        } else {
            console.log(req.body);
            let newMobile = await userRepo.changeMobile(req.body)
            console.log("new mobile is", newMobile);
            req.session.user = newMobile
        }
        res.json(true)
    },
    // change password for the user
    changePassword: async (req, res) => {
        OTP.createService((serv) => {
            sid = serv;
            // OTP.getOtp(serv, req.body.mobile) 
        })
    },

    verifyEmailChange: async (req, res) => {
        OTP.verifyOTP()
    },

    getOrderOfUser: async (req, res) => {
        // -------------------------------
        const counts = req.counts
        const cartCount = counts.cartLength
        const wishlistCount = counts.wishlistLength
        // ------------------------------- 
        const user = req.session.user
        let userId = req.session.user._id
        const orders = await userRepo.getOrders(userId)
        const loggedIn = req.session.login;
        const categories = await adminRepository.getAllCategories()
        console.log("orders are", orders);
        const orderStatuses = await userRepo.getAllStatuses()
        orderStatuses.splice(1, 1)
        res.render('users/orders', { orders, user, categories, cartCount, wishlistCount, loggedIn, orderStatuses })
    },

    getSingleOrder: async (req, res) => {
        const categories = await adminRepository.getAllCategories()
        // -------------------------------
        const counts = req.counts
        const cartCount = counts.cartLength
        const wishlistCount = counts.wishlistLength
        const loggedIn = req.session.login;
        // ------------------------------- 
        const user = req.session.user
        let singleOrderId = req.params.id
        const singleOrder = await userRepo.getSingleOrder(singleOrderId)
        console.log(singleOrder);
        res.render('users/orderSingle', { singleOrder, cartCount, wishlistCount, user, loggedIn, categories })

    },
    // cancel order
    cancelOrder: async (req, res) => {
        let productId = req.body.id
        let order = req.body.order
        let reason = req.body.reason
        console.log(req.body);
        await userRepo.cancelOrder(productId, order, reason)
        res.json(true)
    },

    checkCouponAvailblity: async (req, res) => {
        let coup = null
        let user = req.session.user
        console.log(req.body)
        coup = await couponRepo.checkCoupon(req.body.couponCode, user._id)
        console.log("coupon", coup)
        coup != null ? res.json({ availble: true, id: coup }) : res.json({ availble: false })
    },

    // apply coupon
    applyCoupon: async (req, res) => {
        let user = req.session.user
        let couponCode = req.body.couponCode
        let isCoupon = null
        let cartTotal = await cartRepo.getCartTotal(user._id)
        isCoupon = await couponRepo.applyCoupon(couponCode, user._id)
        console.log("djchdhc", isCoupon);
        let len = isCoupon.length
        // let status = isCoupon.redeemed
        // coupon is with the user
        if (len !== 0) {
            let coupStatus = isCoupon[0].coupons.redeemed
            const obj = isCoupon[0].couponsArray[0]
            console.log("obj", obj);
            if (coupStatus == false && obj.minimumSpend < cartTotal) {
                req.session.coupon = obj
                res.json({ coupon: true })
            } else {
                res.json({ coupon: 'expired' })
            }

        } else {
            res.json({ coupon: false })
        }
    },
    // remove coupon
    removeCoupon: async (req, res) => {
        req.session.coupon = null
        res.json(true)
    },



    getHead: async (req, res) => {
        const vrId = await userRepo.getCategoryByName('Headset')
        const vendors = await userRepo.getAllVendors()
        const subCats = await userRepo.getSubCats(vrId._id)
        const AllProducts = await userRepo.getAllProducts(vrId._id)
        const categories = await adminRepository.getAllCategories()
        console.log(AllProducts);
        res.render('users/head', { subCats, vendors, AllProducts, categories })
    }

}




