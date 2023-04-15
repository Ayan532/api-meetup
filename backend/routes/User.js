const express=require('express')
const UserRoute=require('../controllers/User')
const { isAuthenticated } = require('../middlewares/isAuthenticated')
const { singleupload } = require('../middlewares/Multer')
const router=express.Router()


/*--------------------------------------------------------AUTHENTICATION--------------------------------------------------------------------------------*/
router.route("/register").post(singleupload,UserRoute.registerUser)
router.route("/login").post(UserRoute.loginUser)
router.route("/logout").get(UserRoute.logoutUser)
router.route("/me").get(isAuthenticated,UserRoute.getLoggedInUser)

/*--------------------------------------------------------HELLO REQUEST--------------------------------------------------------------------------------*/
router.route("/me/friends/:id").get(isAuthenticated,UserRoute.getFriends)
router.route("/hello/:id").get(isAuthenticated,UserRoute.helloRequest)
router.route("/friend-req").get(isAuthenticated,UserRoute.showReq)
router.route("/accept/:id").post(isAuthenticated,UserRoute.accecptReq)

/*--------------------------------------------------------PROFILE UPDATE--------------------------------------------------------------------------------*/
router.route('/me/password/update').put(isAuthenticated,UserRoute.changePassword)
router.route('/me/update').put(isAuthenticated,UserRoute.updateProfile)
router.route('/me/profilepicture').put(isAuthenticated,singleupload,UserRoute.updateProfilePicture)
router.route('/removeinterest').delete(isAuthenticated,UserRoute.removeInterest)
/*--------------------------------------------------------FORGOT PASSWORD--------------------------------------------------------------------------------*/
router.route('/forget-password').post(UserRoute.forgetPassword)
router.route('/reset-password/:token').put(UserRoute.resetPassword)

module.exports=router