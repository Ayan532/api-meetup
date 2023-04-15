const express=require('express')
const interest=require('../controllers/Interest')
const { isAuthenticated } = require('../middlewares/isAuthenticated')
const router=express.Router()


/*--------------------------------------------------------ADMIN OPERATION--------------------------------------------------------------------------------*/
router.route("/add").post(isAuthenticated,interest.addInterest)


/*--------------------------------------------------------INTEREST OPERATION--------------------------------------------------------------------------------*/
router.route("/create").post(isAuthenticated,interest.createInterest)
router.route("/").get(interest.getInterests)
router.route("/me").get(isAuthenticated,interest.getInterestsOfLoggedUser)
router.route("/find").get(interest.findPeople)
router.route("/:userId").get(interest.userInterest)




module.exports=router