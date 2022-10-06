const mongoose = require('mongoose')

const adminSchema = mongoose.Schema({
    email:{
        type:String,
        unique:true,
        email:true,
        required:true,
        trim:true
    },
    password:{
        type:String,
        required: true
    }
},{
    collection:'admin'
})

const adminModel = mongoose.model('adminModel',adminSchema)
module.exports=adminModel    