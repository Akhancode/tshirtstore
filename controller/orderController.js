const BigPromise = require('../middleware/bigPromise')
const Order = require('../models/order')
const Product = require('../models/product') //for changing stocks in product 
const CustomError = require('../utils/customError')

exports.createOrder = BigPromise( async  (req,res,next)=>{
    const {
        shippinginfo,
        orderitem,
        paymentinfo,
        taxamount,
        shippingamount,
        totalamount

    } = req.body

    const order = await Order.create({
        shippinginfo,
        orderitem,
        paymentinfo,
        taxamount,
        shippingamount,
        totalamount,
        userinfo:req.user._id
    })

    res.status(200).json({
        success:true,
        order
    })

})
exports.getOneOrder = BigPromise( async  (req,res,next)=>{
    const order =  await Order.findById(req.params.id).populate('userinfo','name email role') //giving extra details to property wwhich contains BSON ID
    if(!order){
        return next(new CustomError("Please send order ID ",401))
    }
    res.status(200).json({
        success:true,
        order
    })

})
exports.myOrder = BigPromise( async  (req,res,next)=>{
    const order =  await Order.find({userinfo : req.user._id}).populate('userinfo') //giving all user details to property wwhich contains BSON ID
    if(!order){
        return next(new CustomError("Please send order ID ",401))
    }
    res.status(200).json({
        success:true,
        order
    })

})
exports.adminAllOrder = BigPromise( async  (req,res,next)=>{
    const orders =  await Order.find().populate('userinfo') //giving all user details to property wwhich contains BSON ID

    res.status(200).json({
        success:true,
        orders
    })

})
exports.adminUpdateOrder = BigPromise( async  (req,res,next)=>{

    //CHANGE THE  ORDER STATUS TO DELIVERED BY ADMIN/
    const order =  await Order.findById(req.params.id)

    if(order.orderstatus === "Delivered"){
        return next(new CustomError("Order is Already delivered",401))
    }
    order.orderstatus = req.body.orderstatus
    order.orderitem.forEach(async prod=>{
        updateProductStock(prod.product,prod.quantity)
    })
    await order.save()
    res.status(200).json({
        success:true,
        order
    })

})

async function updateProductStock(productId , quantity){
    const product = await Product.findById(productId)
    product.stock = product.stock  - quantity
    await product.save({validateBeforeSave:false})
}


exports.adminDeleteOrder = BigPromise( async  (req,res,next)=>{

    //CHANGE THE  ORDER STATUS TO DELIVERED BY ADMIN/
    const order =  await Order.findById(req.params.id)
    await order.remove()
    res.status(200).json({
        success:true
    })

})