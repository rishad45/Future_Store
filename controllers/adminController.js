//====>
//===============MODELS=====>
const adminModel = require('../models/adminSchema')
const userModel = require('../models/userSchema')
const ProductModel = require('../models/productSchema')
const orderModel = require('../models/orderModel')

//====>
//===============CONTROLLERS=====>
const productController = require('./productController')

//====>
//===============REPOSITORIES=====>
const userRepository = require('../repository/userRepository')
const couponRepo = require('../repository/couponRepository')
const adminRepo = require('../repository/adminRepository')


//====>
//===============OTHER REQUIREMENTS=====>
const bcrypt = require('bcrypt')
const { resolve } = require('promise')
const adminHelper = require('../helpers/adminHelper')
const adminRepository = require('../repository/adminRepository')
const bannerManagementModel = require('../models/bannerModel')

module.exports = {
    adminSignin: async (req, res) => {
        let admin = await adminModel.findOne({ email: req.body.email })
        if (admin) {
            bcrypt.compare(req.body.password, admin.password, (err, match) => {
                if (match) {
                    req.session.admin = true;
                    res.redirect('/admin/home')
                } else {
                    req.session.admin = false
                    console.log("mis matched");
                    res.redirect('/admin')
                }
            })
        } else {
            console.log("not admin");
            res.redirect('/admin')
        }
    },
    // home page
    home: async (req, res) => {

        // orders that need processing
        const ordersOnProcessingGet = await adminRepository.ordersOnProcessing()
        const ordersOnProcessing = ordersOnProcessingGet[0].total
        // orders on hold
        const ordersOnHoldGet = await adminRepository.ordersOnHold()
        const ordersOnHold = ordersOnHoldGet[0].total
        // sales data for last 7 days 
        const sellData = await adminRepository.getSales()
        // last 7 dates that sales happened 
        let salesDate = sellData.map((elem) => {
            let date = elem._id.day + '/' + elem._id.month + '/' + elem._id.year
            return date
        })
        // profits earned in last 7 days 
        let salesProfit = sellData.map((elem) => {
            return elem.profit
        })

        // orderdata for last 7 days
        const orderCount = await adminRepository.getOrderCounts()
        // last 7 ordered dates
        let orderDate = []
        orderDate = orderCount.map((elem) => {
            let date = elem._id.day + '/' + elem._id.month + '/' + elem._id.year
            return date
        })
        // order count of last 7 days
        orderDataByDate = orderCount.map((elem) => {
            return elem.count
        })

        // get COD VS ONLINE COUNTS
        const paymentMethodData = await adminRepository.codVsOnline()
        console.log("payMethod", paymentMethodData);
        let codVsOnline = []
        codVsOnline.push(paymentMethodData[0].countCOD)
        codVsOnline.push(paymentMethodData[0].countRazor)

        // get payment success or not
        const paymentSuccess = await adminHelper.paymentSuccessData()
        // finally
        res.render('admin/home', {
            layout: 'adminLayout',
            orderDate, orderDataByDate, codVsOnline, paymentSuccess, salesDate, salesProfit,
            ordersOnProcessing, ordersOnHold 
        })
    },
    listUsers: (req, res) => {
        userModel.model.find().sort({ createdAt: 1 }).lean().exec((error, data) => {
            res.render('admin/users', { users: data })
        })
    },

    blockUser: async (req, res) => {
        let userId = req.params.id
        await userModel.model.updateOne({ _id: userId }, { $set: { banned: true } })
        req.session.login = false
        res.redirect('/admin/users')

    },

    unblockUser: async (req, res) => {
        let userId = req.params.id
        await userModel.model.updateOne({ _id: userId }, { $set: { banned: false } })
        req.session.banned = true;
        res.redirect('/admin/users')
    },


    listCategories: async (req, res) => {
        //    let data =  await ProductModel.CategoryModel.find().lean().exec()
        //     console.log(data);
        let data = await ProductModel.CategoriesModel.aggregate(
            [
                {
                    $match: { status: true }
                },
                {
                    $project:
                    {
                        categoryTitle: 1,
                        subCategories: 1,
                        createdYear: { $year: "$createdAt" },
                        createdMonth: { $month: "$createdAt" },
                        createdDay: { $dayOfMonth: "$createdAt" },
                        updatedYear: { $year: "$updatedAt" },
                        updatedMonth: { $month: "$updatedAt" },
                        updatedDay: { $dayOfMonth: "$updatedAt" }
                    }
                }
            ]
        )
        console.log(data);
        console.log(data.categoryTitle);

        res.render('admin/categories', { data })
    },


    passCategories: async (req, res) => {
        let data = await ProductModel.CategoriesModel.find({ status: true }).lean().exec()
        console.log(data);
        res.render('admin/addCategories', { data })
    },

    // editCategory: async(req,res)=>{
    //     let categoryId = req.params.id
    //     await ProductModel.CategoriesModel.updateOne({_id:categoryId},{$set:{}})
    //     res.redirect('/admin/categories')
    // },

    listSubCategories: async (req, res) => {
        let data = await ProductModel.subCategoryModel.find({ status: true }).populate('categoryId').lean().exec()
        let categories = await ProductModel.CategoriesModel.find({ status: true }).lean().exec()
        console.log(categories);
        res.render('admin/subCategories', { data, categories })
    },

    listVendors: async (req, res) => {
        let data = await ProductModel.vendorModel.find({ status: true }).lean().exec()
        res.render('admin/vendors', { data })
    },
    // Get Headset page with all headset details
    getHeadsets: async (req, res) => {
        let headId = await ProductModel.CategoriesModel.find({ categoryTitle: 'Headset' }, { _id: 1 })
        let products = await ProductModel.productModel.find({ categoryId: headId }).lean().exec()
        console.log(products);
        res.render('users/headsets', { products })
    },
    // Get accessories page with all accessories details
    getAccessories: async (req, res) => {
        let accId = await ProductModel.CategoriesModel.find({ categoryTitle: 'accessories' }, { _id: 1 })
        let products = await ProductModel.productModel.findById(accId).lean().exec()
        res.render('users/accessories', { products })
    },
    //Get Games page with all games details
    getGames: async (req, res) => {
        let accId = await ProductModel.CategoriesModel.find({ categoryTitle: 'games' }, { _id: 1 })
        let products = await ProductModel.productModel.findById(accId).lean().exec()
        res.render('users/games', { products })
    },
    // coupon management
    couponManagement: async (req, res) => {
        const coupons = await couponRepo.getAllCoupons()
        res.render('admin/couponManagement', { coupons })
    },
    addCoupon: async (req, res) => {
        console.log(req.body)
        try {
            await couponRepo.createCoupon(req.body)
            res.redirect('/admin/couponManagement')
        } catch (err) {
            console.error(err);
        }
    },

    // get orders page
    getOrders: async (req, res) => {
        let orders = null
        let paymentStatus = null
        let orderLength = null
        orders = await adminRepo.getOrders()
        console.log(orders);
        orderLength = orders.length
        if (orders != null) {
            paymentStatus = adminHelper.findOcc(orders, 'paymentStatus')
        }
        res.render('admin/orders', { layout: 'adminLayout', orders, paymentStatus, orderLength })
    },
    // get order status page
    getOrderStatuses: async (req, res) => {
        console.log("pro", req.params.productId);
        console.log("order", req.params.orderId);
        const order = await adminRepo.getOrderById(req.params.orderId, req.params.productId)
        console.log("order ", order);
        res.render('admin/orderDetails', { layout: 'adminLayout', order })
    },
    updateStatus: async (req, res) => {
        console.log(req.body)
        await adminRepo.changeStatus(req.body)
        console.log("here also");
        res.redirect('back')
    },

    getCategoryProducts: async (data) => {
        let product = await ProductModel.CategoriesModel.aggregate(
            [
                {
                    $match: { status: true }
                },
                {
                    $project:
                    {
                        categoryTitle: 1
                    }
                },
                {
                    $lookup:
                    {
                        from: 'ProductModel.productModel',
                        localField: '_id',
                        foreignField: 'categoryId',
                        as: 'result'
                    }
                }
            ]
        )
        console.log(product)
    },

    bannerManagement: async (req, res) => {
        res.render('admin/banners', { layout: 'adminLayout'}) 
    },

    getSalesByMonth: async (req, res) => {
        const profit = await adminRepo.getSalesByMonth()
        console.log(profit);
        let days = new Date(2022, 9, 0).getDate()
        let prof = profit.map((data) => {
            return data.profit
        })
        let sale = profit.map((data) => {
            return data._id.day
        })
        console.log("sale", sale);
        let arr = [];
        for (let i = 0; i < days; i++) {
            arr[i] = 0;
        }
        arr.map((element, index) => {
            sale.map((iElem) => {
                --index == iElem ? (arr[--index] = iElem) : 0;
            })
        })

        // profit.map((data)=>{ 
        //     for(let i=0;i<=arr.length;i++){
        //         if(arr[i] != 0 ){
        //             arr[i] = data.profit
        //             break; 
        //         }
        //     }
        // })

        // let k = 0
        // for(let i=0;i<= prof.length;i++){
        //     for(let j=k;j<arr.length;j++){
        //         if(arr[j] != 0){
        //             arr[j] = prof[i] 
        //             k = j+1 
        //             break 
        //         }
        //     }
        // } 
        res.send(arr)
    },

    // sales Report
    salesReport: async (req, res) => {
        let orders = await adminRepo.getSalesOrders()
        console.log(orders[0].user);
        res.render('admin/salesReport', { layout: 'adminLayout', orders })
    },

    // banner
    updateBanners: async (images)=>{
        const res = await adminRepo.updateBanners(images) 
    },

    dynamicDropdown: (async (req, res) => {
        const cat = req.body
        ProductModel.subCategoryModel.aggregate(
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
                        'as': 'results'
                    }
                }, {
                    '$match': {
                        'results.categoryTitle': cat
                    }
                }, {
                    '$project': {
                        'subCatTitle': 1
                    }
                }
            ]
        )
    })
}
