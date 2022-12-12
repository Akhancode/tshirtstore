const BigPromise = require('../middleware/bigPromise')


exports.sendStripeKey = BigPromise( async  (req,res,next)=>{

    res.status(200).json({
        stripeKey : process.env.STRIPE_API_KEY
    })
})

exports.sendRazorKey = BigPromise( async  (req,res,next)=>{

    res.status(200).json({
        stripeKey : process.env.RAZORPAY_API_KEY
    })
})

exports.captureStripePayment = BigPromise( async  (req,res,next)=>{
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const paymentIntent = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: 'aed',

        //optional
        metadata :{integration_check:"accept payment"}
      });

    res.status(200).json({
        success : true,
        client_secret : paymentIntent.client_secret
    })
})

exports.captureRazorPayment = BigPromise( async  (req,res,next)=>{
    var instance = new Razorpay({ key_id: process.env.RAZORPAY_API_KEY, key_secret: process.env.RAZORPAY_SECRET_KEY })
    var options = {
        amount: req.body.amount,
        currency: "INR",
        receipt: "receipt#1",
        notes: {
          key1: "value3",
          key2: "value2"
        }
      }
    const myOrder = await instance.orders.create(options)

    res.status(200).json({
        success : true,
        amount : req.body.amount,
        order:myOrder
    })
})