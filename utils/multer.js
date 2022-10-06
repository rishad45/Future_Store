const multer = require('multer');
const { uploads } = require('./cloudinary');
const Storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/img/products')
  },
  filename: function (req, file, cb) {
    cb( null, Date.now() + file.originalname); 
  }
})

const upload = multer({ storage: Storage });


module.exports = upload 
