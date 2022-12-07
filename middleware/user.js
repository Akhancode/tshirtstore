const User = require('../models/user')
const BigPromise = require('../middleware/bigPromise')
const CustomError = require('../utils/customError')

const jwt = require("jsonwebtoken")
const { removeListener } = require('../models/user')


exports.isLoggedIn = BigPromise(async (req,res,next)=>{
    //FETCHING FROM COOKIES OR HEADER
    const token  = req.cookies.token ||req.header("Authorization").replace("Bearer ","");
    if(!token){
        return next(new CustomError("login access failed to this page",401))
    }
    //DECRYPTING TOKEN GET ENCRYPTED ID
    const decodedID = jwt.verify(token,process.env.JWT_SECRET)
    //SEARCH BY ID AND CREATING PROPERTY IN USER
    req.user = await User.findById(decodedID.id)
    next();
})
exports.customRole = (role) =>{
    return (req,res,next)=>{
        //if not Admin
        if(role !== (req.user.role)){
            return next(new CustomError("You are not allowed to access this page",403))
        }
        
        next()
    }
}
