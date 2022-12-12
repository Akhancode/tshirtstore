const { testproduct, addproduct, getAllProduct, adminGetAllProduct, getSingleProduct, adminUpdateProduct, adminDeleteProduct, adminSingleProduct, addReview, deleteReview, getOnlyReviewsOfSingleProduct } = require('../controller/productController')
const express = require('express')
const router = express.Router()
const { isLoggedIn, customRole } = require('../middleware/user')




  // user routes
  router.route("/testproduct").get(testproduct)
  router.route("/allproduct").get(getAllProduct)
  router.route("/product/:id").get(getSingleProduct)
  router.route("/product/addreview").post(isLoggedIn,addReview) //body  {rating ,comment,productID}
  router.route("/product/deletereview").delete(isLoggedIn,deleteReview) //body {productID}
  router.route("/product/reviews/:id").get(getOnlyReviewsOfSingleProduct) //query ? id = productID

  // admin routes
  router.route("/addproduct").post(isLoggedIn,customRole("admin"),addproduct)
  router.route("/admin/product/all").get(isLoggedIn,customRole("admin"),adminGetAllProduct)
  router.route("/admin/product/:id").get(isLoggedIn,customRole("admin"),adminSingleProduct)
  router.route("/admin/product/:id").put(isLoggedIn,customRole("admin"),adminUpdateProduct)
  router.route("/admin/product/:id").delete(isLoggedIn,customRole("admin"),adminDeleteProduct)



module.exports = router