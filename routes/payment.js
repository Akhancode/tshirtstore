const express = require('express')
const { sendStripeKey, sendRazorKey, captureStripePayment, captureRazorPayment } = require('../controller/paymentController')
const router = express.Router()
const { isLoggedIn, customRole } = require('../middleware/user')



router.route("/stripekey").get(isLoggedIn,sendStripeKey)
router.route("/razorpaykey").get(isLoggedIn,sendRazorKey)
router.route("/capturestripepay").get(isLoggedIn,captureStripePayment)
router.route("/capturerazorpay").get(isLoggedIn,captureRazorPayment)








module.exports = router