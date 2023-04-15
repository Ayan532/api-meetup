
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ErrorHandler = require("../utils/ErrorHandler");
const BigPromise = require("./BigPromise");

exports.isAuthenticated=BigPromise(async(req,res,next)=>{
    const token=req.cookies.token
    if(!token) return next(new ErrorHandler('Please Login In',401))

    const decode=jwt.verify(token,process.env.JWT_SECRET)

    req.user=await User.findById(decode._id)
    
    next();
     

});