const User = require('../models/user')
const BigPromise = require('../middleware/bigPromise')
const CustomError = require('../utils/customError')
const cookieToken = require('../utils/cookieToken')
const fileupload = require('express-fileupload')
const cloudinary = require('cloudinary')
const mailHelper = require('../utils/emailHelper')
const { json } = require('express')
const crypto = require('crypto')

exports.testSignup = BigPromise(async(req,res,next)=>{
     let result
    try {
         console.log(req)
     
    } catch (error) {
          console.log(
               "EROOOOOOORR___________________________________"
          )
          
    }
}) 

exports.signup = BigPromise(async(req,res,next)=>{
     let result
     const {name,email,password} = req.body

     if(!email){
          // return next(Error("please fill email"))
          return next(new CustomError("Name , email password are required ! " , 400))
     }
 
    
     //CHECK FILES IN REQUEST THEN ONLY upload to cloudinary (image)
     if (req.files) {
          let file =req.files.photo
         result = await cloudinary.v2.uploader.upload(file.tempFilePath,{ 
             folder:"users",
             width :150,
             crop:"scale"
          })

     }

   
     const user = await User.create({
          name,
          email,
          password,
          photo:{
               id:result.public_id,
               secure_url:result.secure_url
          }
     })
     user.password = undefined
     
     cookieToken(user,res)
}) 

exports.login = BigPromise(async (req,res,next)=>{
     const {email,password} = req.body

     if(!email || !password){
          return next(new CustomError("please provide email and password"))
     }
     //FIND USER DATA BY EMAIL
     const user = await User.findOne({email}).select("+password")
     
     if(!user ){
          return next(new CustomError("This Email is not registerd"))
     }
     //VALIDATING PASSWORD BY METHOD IN USER
     const IsPasswordCorrect = await user.IsvalidatePassword(password)
     
     if(!IsPasswordCorrect ){
          return next(new CustomError("Email or Password does not match ! "))
     }
     user.password = undefined
     cookieToken(user,res)

})

exports.logout = BigPromise(async (req,res,next)=>{
     //remove JWT FROM  cookie 
     res.cookie('token',null,{
          expires:new Date(Date.now()),
          httpOnly:true
     })
     res.status(200).json({
          success:true,
          message : "Logout Success"
     })
})
exports.sendMail = BigPromise(async (req,res,next)=>{
    await mailHelper(res,{
          email:"akhan.code@gmail.com",
          subject:"Test nodemailer ",
          message:"Done testing body"
     })
})
exports.forgetpassword = BigPromise(async (req,res,next)=>{
     //DESTRUCTURING EMAIL FROM BODY REQ
     const {email} = req.body
     console.log(email)
     
     // FINDING EMAIL FROM USER DB

     const user = await User.findOne({email}).select("+password")
     
     if(!user ){
          return next(new CustomError("This Email is not registerd"))
     }

     // GENERATING FORGET TOKEN BY CALLING METHOD CREATED IN USER MODEL 
     const forgetToken = await user.getForgotPasswordToken()
     //SAVING TOKEN TO DB
     await user.save({validateBeforeSave : false})
     // CREATING URL WITH ALL LINK TO SITE
     const myURL = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${forgetToken}`
     
     try {      
          await mailHelper(res,{
                    email:email,
                    subject:"Recover Your password",
                    message:`copy paste this link in your URL : ${myURL}`
               })
          
          
     } catch (error) {
          user.forgetpasswordToken = undefined
          user.forgetpasswordExpiry = undefined
          await user.save({validateBeforeSave : false})
          return next(new CustomError(error.message,500))
     }

})
exports.resetpassword = BigPromise(async (req,res,next)=>{
              const token = req.params.token

              const encrytoken = crypto
              .createHash('sha256')
              .update(token)
               .digest("hex")
               console.log(encrytoken)
               
               const user = await User.findOne({
                    encrytoken,
                    //fILETER IF TIME IS gt (GREAETER THAN) TIME NOW
                    forgotPasswordExpiry:{$gt:Date.now()}
               })

               if(!user){
                    return next(new CustomError("Token is Invalid OR EXPIRed",400))
               }
               
               if(req.body.password !== req.body.confirmPass){
                    return next(new CustomError("password dont match !",400))
                    
               }

               user.password = req.body.password
               user.forgetpasswordToken = undefined
               user.forgetpasswordExpiry = undefined

               await user.save()

               //send token

               cookieToken(user,res)

          })

exports.getLoggedInUserDetails = BigPromise(async (req,res,next)=>{
     const user = await User.findById(req.user.id)

     res.status(200).json({
          success:true,
          user
     })
})
exports.changepassword = BigPromise(async (req,res,next)=>{

     const user_id = req.user.id

     const user =await User.findById(user_id).select("+password")

     const IsCorrectOldPassword = user.IsvalidatePassword(req.body.oldpassword)

     if(!IsCorrectOldPassword){
          return next(new CustomError("old password is incorrect ",400))
     }
     user.password = req.body.newpassword

     await user.save()

     cookieToken(user,res)
})

exports.updateuser = BigPromise(async (req,res,next)=>{
     //CREATING AN EMPTY OBJECT
     const newData = {}

     //CHECK REQ . EMAIL AND NAME ENTERED ONLY THEN ADD TO OBJECT .
     if(req.body.email){
          newData.email = req.body.email
     }
     if(req.body.name){
          newData.name = req.body.name
     }
     // CHECK FILE ATTACHED (PHOTO) THEN DELETE PREVIOUS PHOTO AND UPLOAD NEW ONE.
     if(req.files){
          const user = await User.findById(req.user.id)
          const photo_id = await user.photo.id 

          //DELETING OLD PHOTO  FROM CLOUDINARY
          await cloudinary.v2.uploader.destroy(photo_id)

          //UPLOADING NEW PHOTO TO CLOUDINARY
          let file =req.files.photo
          let result = await cloudinary.v2.uploader.upload(file.tempFilePath,{ 
              folder:"users",
              width :150,
              crop:"scale"
           })

          newData.photo = {
               id:result.public_id,
               secure_url: result.secure_url
          }
     }
     //FIND USER AND UPDATE.
     const user = await User.findByIdAndUpdate(req.user.id,newData,{
          new:true,
          runValidators:true,
          useFindAndModify:false
     })
     // RESPONSE SENDING .
     res.status(200).json({
          success:true,
          message:`updated with name : ${newData.name},email : ${newData.email}, ${newData.photo?'photo :'+ newData.photo.id :null}`
     })
})


exports.adminalluser = BigPromise(async (req,res,next)=>{
    const users = await User.find()

    res.status(200).json({
     success:true,
     users
    })
})
exports.admingetsingleuser = BigPromise(async (req,res,next)=>{
     
    const user = await User.findById(req.params.id)
     if(!user){
          return next(new CustomError("No user Found in this ID",401))
     }
    res.status(200).json({
     success:true,
     user
    })
})

exports.adminupdatesingleuser = BigPromise(async (req,res,next)=>{
     //CREATING AN EMPTY OBJECT
     const newData = {}

     //CHECK REQ . EMAIL AND NAME ENTERED ONLY THEN ADD TO OBJECT .
     if(req.body.email){
          newData.email = req.body.email
     }
     if(req.body.name){
          newData.name = req.body.name
     }
     // CHECK FILE ATTACHED (PHOTO) THEN DELETE PREVIOUS PHOTO AND UPLOAD NEW ONE.
     if(req.files){
          const user = await User.findById(req.params.id)
          const photo_id = await user.photo.id 

          //DELETING OLD PHOTO  FROM CLOUDINARY
          await cloudinary.v2.uploader.destroy(photo_id)

          //UPLOADING NEW PHOTO TO CLOUDINARY
          let file =req.files.photo
          let result = await cloudinary.v2.uploader.upload(file.tempFilePath,{ 
              folder:"users",
              width :150,
              crop:"scale"
           })

          newData.photo = {
               id:result.public_id,
               secure_url: result.secure_url
          }
     }
     //FIND USER AND UPDATE.
     const user = await User.findByIdAndUpdate(req.params.id,newData,{
          new:true,
          runValidators:true,
          useFindAndModify:false
     })
     // RESPONSE SENDING .
     res.status(200).json({
          success:true,
          message:`updated with name : ${newData.name},email : ${newData.email}, ${newData.photo?'photo :'+ newData.photo.id :null}`
     })
})
exports.admindeletesingleuser = BigPromise(async (req,res,next)=>{
     
     //FIND USER AND DELETE.
     const user = await User.findByIdAndDelete(req.params.id)
     if(!user){
          return next(new CustomError("No user Found in this ID",401))
   
     }
     //PHOTO ID FROM USER
     const photo_id = await user.photo.id 
     //DELETING OLD PHOTO  FROM CLOUDINARY
     await cloudinary.v2.uploader.destroy(photo_id)
     
          // RESPONSE SENDING .
     res.status(200).json({
          success:true,
          message:`Deleted User : ${user.name} `
     })
})