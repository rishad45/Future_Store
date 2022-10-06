const mongoose = require('mongoose');
const { schema } = require('./userSchema');

// .......schema for Parent categories
// <- =========PARENT CATEGORY============== ->
const categorySchema = new mongoose.Schema({
    categoryTitle:{
        type: String,
        required: true,
        unique: true
    },
    status:{
        type: Boolean,
        default:1
    },
    revenue: Number,
},{timestamps: true}) 


// ........Schema for Sub categories 
// <- =======SUB-CATEGORY============== ->
const subCategorySchema = new mongoose.Schema({
    subCatTitle: {
        type: String,
        required: true,
        unique: true
    },
    categoryId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CategoriesModel'
    },
    revenuePerSub: Number,
    status:{
        type:Boolean,
        default:1
    }
},{timestamps:true})


// .../. schema for vendors
// <- ========VENDORS============== ->
const vendorSchema = new mongoose.Schema({
    vendorName: {
        type: String,
        unique: true
    },
    status:{
        type:Boolean,
        default: 1
    }
},{timestamps:true})

// .......schema for Products
// <- =========PRODUCTS============== ->
const productSchema = new mongoose.Schema({
    productTitle:{
        type: String,
        required: true,
        unique: true
    },
    price:{
        type:Number,
        required:true
    },
    discountPercentage: Number,
    categoryId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CategoriesModel'
    },
    subCatId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subCategoryModel'
    },
    vendorId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'vendorModel'
    },
    stock:{
        type: Number
    },
    status:{
        type:Boolean,
        default: 1
    },
    description: {
        type: String
    },
    coverImage: String,
    allImages: [String]
    
},{timestamps:true})



var CategoriesModel = mongoose.model('CategoriesModel', categorySchema);
var subCategoryModel = mongoose.model('subCategoryModel', subCategorySchema);
var vendorModel = mongoose.model('vendorModel', vendorSchema);
var productModel = mongoose.model('productModel',productSchema)


module.exports= {CategoriesModel,subCategoryModel,vendorModel,productModel}