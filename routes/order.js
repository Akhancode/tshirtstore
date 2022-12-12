const express = require('express')
const { createOrder, getOneOrder, myOrder, adminAllOrder, adminUpdateOrder, adminDeleteOrder } = require('../controller/orderController')
const router = express.Router()
const { isLoggedIn, customRole } = require('../middleware/user')



router.route("/order/create").post(isLoggedIn,createOrder)
router.route("/order/myorder").get(isLoggedIn,myOrder)
router.route("/order/:id").get(isLoggedIn,getOneOrder)

//ADMIN ROUTES
router.route("/admin/orders").get(isLoggedIn,customRole('admin'),adminAllOrder)
router.route("/admin/order/:id").put(isLoggedIn,customRole('admin'),adminUpdateOrder)
router.route("/admin/order/:id").delete(isLoggedIn,customRole('admin'),adminDeleteOrder)








module.exports = router