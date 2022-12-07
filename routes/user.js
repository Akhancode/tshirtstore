const express = require('express')
const router = express.Router()
const {signup,testSignup,login, logout, sendMail, forgetpassword, resetpassword, getLoggedInUserDetails, changepassword, updateuser, adminalluser, admingetsingleuser, adminupdatesingleuser, admindeletesingleuser} = require('../controller/userController')
const { isLoggedIn, customRole } = require('../middleware/user')


router.route('/signup').post(signup)
router.route('/login').post(login)
router.route('/logout').get(logout)
router.route('/sendmail').post(sendMail)
router.route('/forgetpassword').post(forgetpassword)
router.route('/password/reset/:token').post(resetpassword)

router.route('/userdashboard').get(isLoggedIn,getLoggedInUserDetails)
router.route('/password/update').post(isLoggedIn,changepassword)
router.route('/userdashboard/update').post(isLoggedIn,updateuser) 

router.route('/admin/users').get(isLoggedIn,customRole("admin"),adminalluser)
router.route('/admin/user/:id')
.get(isLoggedIn,customRole("admin"),admingetsingleuser)
.put(isLoggedIn,customRole("admin"),adminupdatesingleuser)
.delete(isLoggedIn,customRole("admin"),admindeletesingleuser)

//ALSO CAN WORK  UPDATE AS THIS .
router.route('/admin/user/update/:id').post(isLoggedIn,customRole("admin"),adminupdatesingleuser)
router.route('/admin/user/delete/:id').post(isLoggedIn,customRole("admin"),admindeletesingleuser)

module.exports  =router