var express = require('express');
var router = express.Router();
const model = require('../models/userSchema')
const otp = require('../controllers/authController')
const userCredential = require('../controllers/userController')
let sid = '';
var bcrypt = require('bcrypt');

const helper = require('../helpers/userHelper')
const twilio = require('twilio');
const { response } = require('../app');
const adminController = require('../controllers/adminController');
const cartController = require('../controllers/cartController');
const { RoleInstance } = require('twilio/lib/rest/chat/v1/service/role');
const { count } = require('../models/cartSchema');
const cartRepo = require('../repository/cart');
const wishlistRepo = require('../repository/wishlistRepository')
const { userSignup } = require('../controllers/authController');
const { default: mongoose } = require('mongoose');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware')

const NodeCache = require( "node-cache" );
const userHelper = require('../helpers/userHelper');
const userRepository = require('../repository/userRepository');
const productController = require('../controllers/productController');
const adminRepository = require('../repository/adminRepository');
const providers = require('../middlewares/providers');
const myCache = new NodeCache();

//.....GET users login page
router.get('/login', (req, res) => {
  let loginStatus = req.session.login;
  if (req.session.login) {
    res.redirect('/')
  } else {
    res.render('users/LoginTemp', { loginStatus })  
  }
})

//<-=====================->
//.....POST users login data
router.post('/login', userCredential.userSignin)


//<-=====================->
//.....GET users signup page
router.get('/signup', (req, res) => {
  const errorMsg = req.session.errorMessage
  if (req.session.login) {
    res.redirect('/')
  } else {
    res.render('users/signupTemp', { errorMsg })
    req.session.errorMessage = ""
  }

})

//<-=====================->
//.....POST users signup details 
router.post('/signup', async (req, res) => {

  let { name, email, mobile, password, rePassword } = req.body;
  let user1 = req.body
  const user = await model.model.findOne({ $or: [{ email }, { mobile }] })
  if (user) {
    req.session.errorMessage = "User with this Email or Mobile already Exist";
    res.redirect('/signup')
  }
  else {
    otp.createService((serv) => {  
      sid = serv; 
      otp.getOtp(serv, req.body.mobile) 
    }) 
    res.render('users/otpTemp', { user1, sid }) 
  }
})


//<-=====================->
//.....POST users otp verification page
router.post('/otp',async(req, res) => {
  try{
    otp.verifyOTP(sid, req.body.mobile, req.body.otp).then(async(status) => {
      if (status == 'approved') { 
        console.log("approved and here"); 
        await otp.userSignup(req.body) 
        // const user = await userCredential.getUserbyMobile(req.body.mobile) 
        // console.log("user is" + user); 
        // req.session.login = true 
        // req.session.user = user  
        res.redirect('/login'); 
      } else { 
        req.session.login = false
        req.session.errorOTP = true;
        res.redirect('/otp')
      } 
    })
  }catch(err){
    res.json(err)
  }
  

})

/* GET users home page. */
router.get('/',providers.giveCartLength,userController.getHome);   
//<-=====================-> 

//<-=====================->
//.....GET HEADSET LISTING PAGE
router.get('/Headset/:id',providers.giveCartLength,userCredential.getHeadsets)
//-----


//<-=====================->
//.....GET ACCESSORIES LISTING PAGE
router.get('/Accessories/:id',providers.giveCartLength, userCredential.getAccessories)
//-----


//<-=====================->
//.....GET GAMES LISTING PAGE
router.get('/Games/:id',providers.giveCartLength, userCredential.getGames)
//-----


//============SINGLE PRODUCT PAGE==============>
//-----
router.get('/singleProduct/:id',providers.giveCartLength,userCredential.singleProduct)
//<-=====================->
//-----

// ============== ALL ABOUT "WISHLIST"  ===============
//============ROUTER FOR VIEWING WISHLIST==============>
// -----
router.get('/wishlist',authMiddleware.verifyUser,providers.giveCartLength, userCredential.getWishlist)
//-----

//============ROUTER FOR ADDING TO WISHLIST==============>
//-----
router.get('/addTowishlist/:id', userCredential.addToWishlist) 
//-----

//============ROUTER FOR DELETING FROM WISHLIST==============>
//-----
router.get('/deleteFromWishlist/:id', userCredential.deleteFromWishlist)
//-----


// ============== ALL ABOUT  ""C A R T""   ===============
//============ROUTER FOR CART OPERATIONS=================>
// -----

// get the cart page 
router.get('/cart',authMiddleware.verifyUser,providers.giveCartLength,cartController.getCartForUser)

// add to cart 
router.get('/addToCart/:id',cartController.addToCart)  

// router.post('addToCart',cartController.addToCart)

// change the product quantity
router.post('/changeProductQuantity',cartController.changeProductQty)

// remove the product from cart
router.post('/removeProduct',cartController.removeProduct) 

//<-=====================->
//-----

// ============== ALL ABOUT  ""CHECKOUT""   ===============
//============ROUTER FOR CHECKOUT OPERATIONS=================>
// -----


// checkout page
router.get('/checkout',authMiddleware.verifyUser,userController.getCheckout)

// post for saving address of the user 
router.post('/saveAddress',userController.saveAddress)  

// route for removing address

// router.get('/removeAddress/:id',userController.removeAddress)
router.post('/removeAddress',userController.removeAddress)

// ==================P A Y M E N T ...S E C T I O N ==============================
// post checkout
router.post('/checkout',userController.checkoutValidate) 

// verifying payment
router.post('/verifyPayment',userController.verifyPayment) 

router.get('/myOrders',authMiddleware.verifyUser,providers.giveCartLength,userController.getOrderOfUser)

router.get('/singleOrder/:id',authMiddleware.verifyUser,providers.giveCartLength,userController.getSingleOrder) 

// cancel orders
router.post('/cancelOrder',userController.cancelOrder) 

// check coupon availiblity
router.post('/checkCouponAvailblity',userController.checkCouponAvailblity)  

// applying coupon
router.post('/applyCoupon',userController.applyCoupon)

router.post('/removeCoupon',userController.removeCoupon)

router.get('/head',providers.giveCartLength,userController.getHead) 


// ============== ALL ABOUT  ""USER PROFILE""   ===============
//============ROUTER FOR PROFILE OPERATIONS=================>
// -----

// user PROFILE
router.get('/account',authMiddleware.verifyUser,userController.getUserAccount)

// CHANGES settings
router.post('/saveChanges',userController.saveChanges)

// change password
router.post('/changePassword',userController.changePassword)

router.post('/verifyPasswordChange',userController.verifyEmailChange)



















// router.get('/test',async(req,res)=>{
//   // const users = await model.model.findOne({banned:false})
//   let value = 45 
//   if(myCache.has('uniqueKey')){
    
//     console.log('Retrieved value from cache !!')
//     res.send("result :" + myCache.get('uniqueKey'))
//   } 
//   else{
//     myCache.set('uniquekey', value) 
//     console.log('Value not present in cache,'
//                 + ' performing computation')
//           res.send("Result: " + value)  
//   }
// }) 


//.....GET LOGOUT 
router.get('/logout', (req, res) => {
  // req.session.login = false;
  req.session.destroy()
  res.redirect('/')
})
//-----



// test
router.get('/test', async (req, res) => {
  res.render('users/orderSingle') ; 
})

// router.get('/loginTemp',(req,res)=>{
//   res.render('users/otpTemp');  
// })

module.exports = router;
