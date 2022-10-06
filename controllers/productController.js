const Categories = require('../models/productSchema');
const upload = require('../utils/multer')
const cloudinary = require('../utils/cloudinary')
const fs = require('fs');
const { default: mongoose } = require('mongoose');
const { vendor } = require('sharp');
const adminRepository = require('../repository/adminRepository');


module.exports = {

    // function for adding Product Category...for Admin
    addCategory: (req, res) => {
        console.log(req.body);
        const newCategory = new Categories.CategoriesModel({
            categoryTitle: req.body.title
        })
        newCategory.save((err, result) => {
            if (err) {
                console.log("error adding product because of" + err)
            } else {
                console.log(result);
                res.redirect('/admin/addCategories')
            }
        })
    },

    // function for adding Product SUB Category...for Admin
    addSubCategory: async (req, res) => {
        const categoryId = await Categories.CategoriesModel.findOne({ categoryTitle: req.body.categoryTitle }, { _id: 1 })
        const newSubCat = new Categories.subCategoryModel({
            subCatTitle: req.body.subCategory,
            categoryId: categoryId
        })
        newSubCat.save((err, result) => {
            if (err) {
                console.log("error while adding subcategory");
            } else {
                console.log(result);
                res.redirect('/admin/addCategories');
            }
        })
    },
    addVendor:async(req,res)=>{
        const newVendor = await Categories.vendorModel.create({
            vendorName:req.body.vendor
        })
        newVendor.save((err,result)=>{
            if(err){
                res.send("error adding vendor")
            }else{
                console.log(result);
                res.redirect('/admin/addCategories')
            }
        })
    },

    // function for DELETING CATEGORY..for Admin
    deletCategory: async (req, res) => {
        let categoryId = req.params.id
        await Categories.CategoriesModel.updateOne({ _id: categoryId }, { $set: { status: false } })
        res.redirect('/admin/categories')
    },
    
    // function for deleting SUB-CATEGORY
    deleteSubCategory: async(req,res)=>{
        let subId = req.params.id;
        await Categories.subCategoryModel.updateOne({_id:subId},{$set:{status:false}})
        res.redirect('/admin/subCategories')
    },

    // function for deleting VENDOR
    deleteVendor:async(req,res)=>{
        let vendId = req.params.id
        await Categories.vendorModel.updateOne({_id:vendId},{$set:{status:false}})
        res.redirect('/admin/vendor')
    },

    // <-=============== EDITING===============================->

    // editing PRODUCT DETAILS
    editProductDetails:async(req,res)=>{
        console.log(req.body);
        await Categories.productModel.findByIdAndUpdate(
            req.params.id,
            {
                productTitle:req.body.newName,
                price: req.body.price,
                stock: req.body.stock,
                desription: req.body.description,
            },{new: true}
        )
        .then(product=>{
            if(!product){
                return res.status(404).send({
                    message: "Note not found with id " + req.params.id
                })
            }
            res.redirect('/admin/products')
        }).catch(err=>{
            if(err.kind == 'ObjectId'){
                return res.status(404).send({
                    message: "error updating product with ProductID" + req.params.id 
                })
            }
        })
    },

    //GET function for editing Category 
    editCategory:async(req,res,next)=>{
        let id = req.params.id;
        let newName = req.body.category;
        await Categories.CategoriesModel.updateOne({_id:id},{$set:{categoryTitle:newName}})
        res.redirect('/admin/categories')
        
    },

    editSubCategory:async(req,res)=>{
        let id = req.params.id
        let newName = req.body.newName
        await Categories.subCategoryModel.updateOne({_id:id},{$set:{subCatTitle:newName}})
        res.redirect('/admin/subCategories')
        // res.send("hey")
    },

    editVendor:async(req,res)=>{
        let id = req.params.id
        let newName = req.body.new
        console.log(newName);
        await Categories.vendorModel.updateOne({_id:id},{$set:{vendorName:newName}})
        res.redirect('/admin/vendor')

    },



    showAddProductsPage: async (req, res) => {
        let categories = await Categories.CategoriesModel.find({ status: true }, { categoryTitle: 1 }).lean().exec() 

        let subCategories = await Categories.subCategoryModel.find({ status: true }, { subCatTitle: 1 }).lean().exec()

        let vendors = await Categories.vendorModel.find({status:true},{vendorName: 1}).lean().exec()
        console.log(categories);
        console.log(subCategories);
        console.log(vendors);

        res.render('admin/addproducts', { categories, subCategories, vendors, layout: 'adminLayout'})
    },

    // product adding controller
    addProducts: async (req, res) => {
        
        let data = req.files;
        let allImages = req.files.allImages 
        let images = [];
        let coverImagePath = data.coverImage[0].filename;

        for (i = 0; i < allImages.length; i++) {
            images.push(allImages[i].filename)
        }
        let categoryId = await Categories.CategoriesModel.findOne({ categoryTitle: req.body.category }, { _id: 1 })
        let subCatId = await Categories.subCategoryModel.findOne({ subCatTitle: req.body.subCategory }, { _id: 1 })
        let vendorId = await Categories.vendorModel.findOne({vendorName:req.body.vendors},{_id:1})                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      

        const newProduct = new Categories.productModel({ 
            productTitle: req.body.productName,
            description: req.body.description,
            price: req.body.price,
            stock: req.body.stock,
            categoryId: categoryId._id,
            subCatId: subCatId._id,
            vendorId: vendorId,
            coverImage: coverImagePath,
            allImages: images
        })
        newProduct.save((err, result) => {
            if (err) {
                console.log("error while adding product" + err);
            } else {
                console.log(result);
                res.redirect('/admin/addProducts')
            }
        })
    } ,
    // controller for listing products in the table in admin side
    productsTable:async(req,res)=>{
       let products = await Categories.productModel.find({status:true},{subCatId:0,allImages:0,description:0})
       .populate('categoryId')
       .populate('vendorId')
       .sort({createdAt:-1})
       .lean()
       .exec()
        
    
       console.log(products);
       res.render('admin/products',{products, layout: 'adminLayout'})
    }, 

    // DELETE (soft delete) PRODUCT FROM DATABASE
    deleteProductFromDB:async(req,res)=>{
        let id = req.params.id
        await Categories.productModel.updateOne({_id:id},{$set:{status:false}})
        res.redirect('/admin/products')
    },

    // rendering PRODUCT EDIT PAGE
    editProductPage:async(req,res)=>{
        let id = req.params.id
        let data = await Categories.productModel.findOne({_id:id}).populate('categoryId').populate('subCatId').populate('vendorId').lean().exec()
        let categories = await Categories.CategoriesModel.find({status:true},{categoryTitle:1}).lean().exec();
        let subCategories = await Categories.subCategoryModel.find({status:true},{subCatTitle:1}).lean().exec();
        let vendors = await Categories.vendorModel.find({status:true},{vendorName:1}).lean().exec();
        console.log(data);
        res.render('admin/editProduct',{data,categories,subCategories,vendors, layout: 'adminLayout'}) 
    },


    

}