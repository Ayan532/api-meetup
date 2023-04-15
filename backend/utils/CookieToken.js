exports.CookieToken=(res,user,message,statusCode=200)=>{
    
    const token=user.getJWTToken();

    const options={
        expires:new Date(Date.now() + process.env.COOKIE_TIME_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly:true,
        secure:true,
        sameSite:"none"
    }
    user.password=undefined

    
    res.status(statusCode).cookie("token",token,options).json({
        success: true,
        message: message,
        token,
        user
    })
  


}