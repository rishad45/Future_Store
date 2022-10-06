var express = require('express');
var router = express.Router();
const adminModel = require('../models/adminSchema')
const multer = require('multer');
const sharp = require('sharp');
const uploadController = require('../uploadImage')
var path = require('path');
const bcrypt = require('bcrypt');
var fileupload = require("express-fileupload");
const { resolve, reject } = require('promise');
const fs = require('fs')


const adminControl = require('../controllers/adminController')
const adminController = require('../controllers/adminController');
const productController = require('../controllers/productController');
const appController = require('../controllers/appController')


// const upload = require('../utils/multer')
const cloudinary = require('../utils/cloudinary')
// const fs = require('fs');


// middleware for uploading images with multer
// <- ================================== ->

const upload = require('../utils/multer');
const { CategoriesModel, productModel } = require('../models/productSchema');
const { send } = require('process');
const bannerManagementModel = require('../models/bannerModel');
const adminRepository = require('../repository/adminRepository');
exports.uploadProductImage = upload.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'allImages', maxCount: 4 }
])

exports.editCoverImage = upload.fields([
  { name: 'coverImage', maxCount: 1 }
])

upload.single('coverImage')
upload.array('allImages', 4)

exports.resizeImages = async (req, res, next) => {
  // console.log(req.files);
  //   if(!req.files.coverImage || !req.files.allImages) return next()
  //   // 1) cover image
  //   req.body.coverImage = `productCover-${req.body.productTitle}-${Date.now()-cover}`
  //   await sharp(req.files.coverImage[0].buffer)
  //   .resize(2000,1333)
  //   .toFormat('jpeg')
  //   .jpeg({quality:90})
  //   .toFile(`public/img/products/req.body.coverImage`)

  next()
}

// <- ================================== ->


/* GET Signin page. */
router.get('/', (req, res) => {
  if (req.session.admin) {
    res.redirect('/admin/home');
  } else {
    res.render('admin/login')
  }
})

/* POST Signin page. */
router.post('/admin/sign', adminControl.adminSignin)

// <- ====================================== ->
//..........GET logOut Route
router.get('/adminLogout', (req, res) => {
  req.session.admin = false;
  res.redirect('/admin') 
})
// <- ====================================== ->


/* GET home page. */
router.get('/home', adminController.home);


/* GET Customers page. */
router.get('/users', adminControl.listUsers)


// GET Customers BLOCK option
// <=========================  BLOCK ==============>
router.get('/admin/blockUser/:id', adminControl.blockUser)
// <============================>


// GET Customers UNBLOCK option
// <===========================  UNBLOCK =========>
router.get('/admin/unBlockUser/:id', adminControl.unblockUser)
// <============================>




//<---======  ALL ABOUT PRODUCTS PAGE ARE HERE =======---->

// GET products page. 
router.get('/products', productController.productsTable)

/* GET add products page. */
router.get('/addProducts', productController.showAddProductsPage)

//<-========ADD PRODUCTS=========->
router.post('/addProducts', this.uploadProductImage, productController.addProducts)

// DELETE PRODUCT
router.get('/deleteProduct/:id', productController.deleteProductFromDB)

// EDIT PRODUCT PAGE
router.get('/editProduct/:id', productController.editProductPage)

// --POST-- EDIT PRODUCT
router.post('/editProduct/:id', productController.editProductDetails)

// POST for edit cover Image
router.post('/editCover/:id', this.editCoverImage, async (req, res) => {
  let path = ' D:\FUTURE STORE\public\img\products\ '
  console.log(req.files);
  console.log(req.params.id);
  let id = req.params.id
  let data = req.files
  let coverImagePath = data.coverImage[0].filename;
  path = path + coverImagePath
  console.log(path);
  console.log(coverImagePath);
  let cover = await productModel.findOne({ _id: id }, { coverImage: 1 })
  await productModel.updateOne({ _id: id }, { coverImage: coverImagePath })


  res.redirect('/admin/products')

})


// <- ==================================================--->


//<---======  ALL ABOUT " CATEGORY " PAGES ARE HERE =======---->

/* GET Categories page. */
router.get('/categories', adminController.listCategories)

// GET add Categories Page...........
//<-==========ADD CATEGORY PASS CATEGORY=========->
router.get('/addCategories', adminController.passCategories)

// POST for ADD CATEGORY..........
//<-========ADD CATEGORY=========->
router.post('/addCategory', productController.addCategory)

//<-============= DELETING CATEGORY =========->
router.get('/admin/deleteCategory/:id', productController.deletCategory)

// edit category
router.post('/editCategory/:id', productController.editCategory)

// <- ==================================================--->



//<---======  ALL ABOUT " SUB-CATEGORY " PAGES ARE HERE =======---->

// route for listing subcategories
router.get('/subCategories', adminControl.listSubCategories)

// route for adding subCategories
//<-========ADD SUB-CATEGORY=========->
router.post('/addSubcategory', productController.addSubCategory)

// ROUTE for deleting Sub categories
router.get('/admin/deleteSubCategory/:id', productController.deleteSubCategory)

// ROUTE for Editing Sub categories
router.post('/editSub/:id', productController.editSubCategory)
// <- ==============================================================--->


//<---======  ALL ABOUT " VENDORS " PAGES ARE HERE =======---->

// route for listing vendors
router.get('/vendor', adminControl.listVendors)

// route for adding vendors
router.post('/addVendor', productController.addVendor)

// route for EDITING Vendors
router.post('/editVendor/:id', productController.editVendor)

// route for deleting vendor
router.get('/admin/deleteVendor/:id', productController.deleteVendor)
// <- ==============================================================--->


// route for adding Products
//<-========ADD PRODUCTS=========->
router.post('/addProducts', this.uploadProductImage, productController.addProducts)

router.get('/orderStatus/:orderId/:productId', adminController.getOrderStatuses)


// route for ajax Order Status form
router.post('/statusForm', adminController.updateStatus)
// router.post('/orderStatus',adminController.updateStatus) 



/* GET Orders Page*/
router.get('/orders', adminController.getOrders)


// route for Managing ""C O U P O N S"" 
//<-========COUPON MANAGEMENT=========->
router.route('/couponManagement')
  .get(adminController.couponManagement)
  .post(adminController.addCoupon)


router.route('/bannerManagement')
  .get(adminController.bannerManagement)

router.route('/salesReport')
  .get(adminController.salesReport)

// router.get('admin/testMyPlan/:id',(req,res)=>{
//   console.log(req.params.id);
// })

// router.get('/test',adminController.getHeadsets)

// deleting cover image
router.post('/uploadSingle', upload.single("coverImage"), (req, res) => {
  // api for uploading single file
  console.log("hey");
  console.log(req.file);
})


// route for Managing ""B A N N E R S"" 
//<-========BANNER MANAGEMENT=========->
router.post('/banners', upload.array('images'), async (req, res) => {
  console.log("here");
  const uploader = async (path) => await cloudinary.uploads(path, 'Banners')
  console.log("here 2");
  if (req.method === 'POST') {
    console.log("here 3");
    const urls = [];
    const files = req.files
    for (const file of files) {
      const { path } = file
      const newPath = await uploader(path)
      urls.push(newPath)
      fs.unlinkSync(path)
    }
    console.log(urls)
    console.log(req.body);
    const newImages = urls.map((elem) => {
      return elem.url
    })
    console.log("newImages", newImages);

    // checking which banner is it
    if (req.body.category == 'heroSlider') {
      await adminController.updateBanners(newImages)
    }else if(req.body.category == 'primary') {
      await adminRepository.updatePrimaryBanners(newImages) 
    }else if(req.body.category == 'secondary'){
      await adminRepository.updateSecondaryBanners(newImages) 
    }else {
      console.log('else block'); 
    }

    res.status(200)
    res.json({ message: "Image uploaded", data: urls })

  } else {
    res.status(405).json({ err: "image upload error" })
  }
})



// ============MY API'S=======
// =========API FOR DYNAMIC DROPDOWN======
// router.post('/admin/getSubcategory',async(req,res)=>{
//   const catId = req.body.prodId
// }) 

router.get('/api/getdata/:id', async (req, res) => {
  const data = req.params.id
  res.send(data);

})

router.post('/api/v1/getSales', adminController.getSalesByMonth)





module.exports = router;
