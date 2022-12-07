const mongoose =  require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
var crypto = require('crypto')


const userSchema  = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please provide a name'],
        maxlength:[50,'Name should be under 50 characters']
    },
    email:{
        type:String,
        required:[true,'Please provide a email'],
        validate: [validator.isEmail,'Please Enter email in format'],
        unique:true
          },
    password:{
        type:String,
        required:[true,'Please provide a password'],
        minlength:[6,'password should be at least 6 charactors'],
        select: false
        },
    role:{
        type:String,
        default : "user"
        },
    forgotPasswordToken:String,
    forgotPasswordExpiry : Date,
    
    photo:{
        id:{
            type:String,
            // required:true
        },
        secure_url:{
            type:String,
            // required:true
        }
        },
    createdAt:{
        type:Date,
        default:Date.now
    }
    
    
}) 

//ENCRYPT PASSWORD BEFORE SAVE using Hooks

userSchema.pre('save',async function(next){
    //skip the line by checking modification of password
    if(!this.isModified('password')) return next() ;
    this.password = await bcrypt.hash(this.password,10)
})

//VALIDATE PASSWORD with passed on user password
userSchema.methods.IsvalidatePassword = async function(usersendPassword){
    return await bcrypt.compare(usersendPassword,this.password)
}

//CREATE AND RETURN JWT TOKEN
userSchema.methods.getJwtToken = function(){
    //CREATE TOKEN 
    
    return jwt.sign(
        { id:this._id},
        process.env.JWT_SECRET,
        { expiresIn:process.env.JWT_EXPIRY }
        )
}


//GENERATE FORGOT PASSWORD TOKEN
userSchema.methods.getForgotPasswordToken = function(){
    //GENERATE LONG AND RANDOM STRING
    const forgetToken = crypto.randomBytes(20).toString('hex')
    // getting a hash 
    this.forgotPasswordToken = crypto
        .createHash('sha256')
        .update(forgetToken)
         .digest("hex")

    //TIME OF TOKEN 
    this.forgotPasswordExpiry = Date.now() +20*60*1000

    return forgetToken
}


module.exports = mongoose.model('User',userSchema)
