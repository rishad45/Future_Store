const upload = require('../utils/multer')
const fs = require('fs')


module.exports={
    deleteImage:async(req,res,next)=>{
        let image = req.params.id;
        var path = `/public/img/products/${image}`
        fs.unlink(path)
        next()
    }
}