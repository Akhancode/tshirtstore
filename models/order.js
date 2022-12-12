const mongoose =  require('mongoose')

const orderSchema = new mongoose.Schema({
    shippinginfo :{
        
        address:{
            type:String,
            required:[true,'Please provide a Address'],
        },
        phoneno:{
            type:String,
            required:[true,'Please provide a phoneno'], 
        },
        city:{
            type:String,
            required:[true,'Please provide a city'],
        },
        state:{
            type:String,
            required:[true,'Please provide a state'],
        },
        pincode:{
            type:String,
            required:[true,'Please provide a pincode'],
        },
        country:{
            type:String,
            required:[true,'Please provide a country'],
        }
    
    },
    
    userinfo:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:[true,'Please provide a userinfo'],
    },
    orderitem:[
        {
            name:{
                type:String,
                required:true
            },
            quantity:{
                type:Number,
                required:true
            },
            image:{
                type:String, //cloudinary url
                required:true
            },
            price:{
                type:Number,
                required:true
            },
            product:{
                type:mongoose.Schema.ObjectId,
                ref:'Product',
                required:true
            }
        }
    ],
    paymentinfo:{
        id:{
            type:String,
        }
    },
    taxamount:{
            type:Number,
            required:true
    },
    shippingamount:{
            type:Number,
            required:true
    },
    totalamount:{
            type:Number,
            required:true
    },
    orderstatus:{
            type:String,
            required:true,
            default:"Processing"
    },
    deliveredat:{
            type:Date,
    },
    createdAt:{
            type:Date,
            default:Date.now
    }





    
})


module.exports = mongoose.model('Order',orderSchema)