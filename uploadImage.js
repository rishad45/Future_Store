const upload = require('./utils/multer')
const cloudinary = require('./utils/cloudinary')
const fs = require('fs')

module.exports = {
    uploadProduct:( upload.array('image'), async (req,res)=>{
        console.log("1")
        return new Promise((resolve, reject) => {
            const uploader = async (path) => await cloudinary.uploads(path, 'Images')
            if (req.method === 'POST') {
                const urls = [];
                const files = req.files
                for (const file of files) {
                    const { path } = file
                    const newPath =  uploader(path)
                    urls.push(newPath)
                    fs.unlinkSync(path)
                }
                res.status(200)
                resolve(urls)
                res.json({ message: "Image uploaded", data: urls })
                console.log(urls)

            } else {
                res.status(405).json({ err: "image upload error" })
            }
        }
        )
    })
}

