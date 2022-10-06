const userModel = require('../models/userSchema')
module.exports={
    verifyUser:async (req,res,next) => {
        try{
            if(req.session.user){ 
                let userId = req.session.user._id
                let user = await userModel.model.findOne({_id:userId,banned:true})
                if(user){
                    req.session.destroy()
                    res.redirect('/')
                }else{
                    next() 
                }
            }else{
                req.session.lastUrl = req.route.path
                res.redirect('/login')
            }
        }catch(err){
            console.error(err)
        }
    }

    
}