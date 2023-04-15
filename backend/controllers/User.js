const {CookieToken} =require("../utils/CookieToken");

const User =require("../models/User");

const  BigPromise=require("../middlewares/BigPromise");
const ErrorHandler = require("../utils/ErrorHandler");
const Interest = require("../models/Interest");
const cloudinary=require('cloudinary')
const { getUriData } = require("../utils/GetUriData");
const { SendEmail } = require("../utils/SendEmail");
const crypto = require("crypto");
exports.registerUser =BigPromise(async(req,res,next)=>{
    const {name,email,password}=req.body
    

    const file=req.file;
    console.log(file);
    if (!name || !email || !password || !file) {
        return next(new ErrorHandler("Please add all feilds", 400));
      }
   


     let user = await User.findOne({ email });

      if (user) {
        return next(new ErrorHandler("Account already exists", 409));
      }

      const fileUri = getUriData(file);

      const result = await cloudinary.v2.uploader.upload(fileUri.content, {
        folder: "Meetup/Users",
        width: 150,
        crop: "scale",
      });
    


     user=await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: result.public_id,
            url: result.secure_url,
          },
    })

    CookieToken(res, user, `${user.name} Registred Successfully`, 201);




})

exports.loginUser=BigPromise(async(req,res,next)=>{

    const {email,password}=req.body

    const user=await User.findOne({email}).select('+password')

    const isMatched = await user.comparePassword(password);

    if(!isMatched){
        return next(new ErrorHandler('Incorrect password or email',404))
    }

 
    CookieToken(res, user, `Welcome back,${user.name}`, 200);

})



exports.logoutUser=BigPromise(async(req,res,next)=>{

  res
  .status(200)
  .cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
    secure: true,
    sameSite: "none",
  })
  .json({
    success: true,
    message: "Logged out successfully",
  });



})


exports.getLoggedInUser=BigPromise(async(req,res,next)=>{

   const user=await User.findById(req.user._id)
   if(!user)
   {
    return next(new ErrorHandler("unauthorized", 401));
   }
   console.log(user);
   res.status(200).json({
    succes:true,
    user
   })

})






exports.helloRequest=BigPromise(async(req,res,next)=>{

    const loggedInUser= await User.findById(req.user._id)
    const userToFollow= await User.findById(req.params.id)
  
    if(!userToFollow){
        return next(new ErrorHandler('User Not Found', 401));
  
    }
    if(req.user._id.toString()===req.params.id)
    {
        return next(new ErrorHandler('You cannot Follow yourself', 401));
    }
  

    userToFollow.request.push(req.user._id)
    await userToFollow.save()
  
    return res.status(200).json({
        success: true,
        message: "Hello Request Sent"
    })
  

})


exports.showReq=BigPromise(async(req,res,next)=>{
  const user=await User.findById(req.user._id)

  const freindsReq = [];

  for (let i = 0; i < user.request.length; i++) {
    const users = await User.findById(user.request[i])
    freindsReq.push(users);
  }

  console.log(freindsReq);

 res.status(200).json({
   success: true,
   friends:freindsReq
    
 }); 
})



exports.accecptReq=BigPromise(async(req,res,next)=>{
  const {action}=req.body

  const loggedInUser= await User.findById(req.user._id)
 if(!loggedInUser.request.includes(req.params.id)){
  return next(new ErrorHandler('Request Not Found', 401));
 }
 const userToFollow=await User.findById(req.params.id)
  if(action==='confirm'){
    if(loggedInUser.request.includes(req.params.id)){
      const index=loggedInUser.request.indexOf(req.params.id)
      loggedInUser.request.splice(index,1)
    }
        loggedInUser.friends.push(req.params.id)
          userToFollow.friends.push(req.user._id)
          await loggedInUser.save()
         await userToFollow.save();
         return res.status(200).json({
          success: true,
          message: "Followed successfully"
      })
  }

  else if(action==='rejected'){

    if(loggedInUser.request.includes(req.params.id)){
      const index=loggedInUser.request.indexOf(req.params.id)
      loggedInUser.request.splice(index,1)
      
     await loggedInUser.save()
      return res.status(200).json({
        success: true,
        message: "User removed successfully",
      });
    }

    
}

})
exports.getFriends=BigPromise(async(req,res,next)=>{

  const user=await User.findById(req.params.id)
  const friends=await user.populate("friends")


res.status(200).json({
    success: true,
    friends,
  });

})



/*--------------------------------------------------------USER PROFILE--------------------------------------------------------------------------------*/

exports.changePassword = BigPromise(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return next(new ErrorHandler("Please enter all feilds", 400));
  }

  const user = await User.findById(req.user._id).select("+password");

  if (!user) {
    return next(new ErrorHandler("unauthorized", 401));
  }

  const isMatched = await user.comparePassword(oldPassword);

  if (!isMatched) {
    return next(new ErrorHandler("Incorrect Old Password", 400));
  }

  user.password = newPassword;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Password changed successfully",
  });
});

exports.updateProfile = BigPromise(async (req, res, next) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return next(new ErrorHandler("Please enter all feilds", 400));
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new ErrorHandler("unauthorized", 401));
  }

  user.name = name;
  user.email = email;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
  });
});

exports.updateProfilePicture = BigPromise(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new ErrorHandler("unauthorized", 401));
  }
  const file = req.file;

  const fileUri = getUriData(file);

  const result = await cloudinary.v2.uploader.upload(fileUri.content, {
    folder: "Meetup/Users",
    width: 150,
    crop: "scale",
  });

  await cloudinary.v2.uploader.destroy(user.avatar.public_id, {
    folder: "Meetup/Users",
  });

  user.avatar = {
    public_id: result.public_id,
    url: result.secure_url,
  };
  await user.save();

  res.status(200).json({
    success: true,
    message: "Profile Picture Updated successfully",
  });
});

exports.forgetPassword = BigPromise(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorHandler("Invalid Email", 400));
  }

  const resetToken = await user.getResetToken();
  await user.save();
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  const message = `Click on the Link to reset your password.\n\n${resetUrl}\nIgnore if you dont sent it. `;
  //Send token via email
  try {
    await SendEmail(user.email, "Meetup Reset Password", message);

    res.status(200).json({
      success: true,
      message: `Email sent successfully to ${email}`,
    });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;

    await user.save();

    return next(new ErrorHandler(err.message, 500));
  }
});

exports.resetPassword = BigPromise(async (req, res, next) => {
  const { token } = req.params;

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpiry: {
      $gt: Date.now(),
    },
  });
  if (!user) {
    return next(new ErrorHandler("Token Expired", 401));
  }
  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler(`Password mismatched`, 500));
  }
  user.password = req.body.password;

  user.resetPasswordToken = undefined;
  user.resetPasswordExpiry = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Password has been reset successfully",
  });
});


exports.removeInterest = BigPromise(async (req, res, next) => {

  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new ErrorHandler("unauthorized", 401));
  }
   //console.log(user);
  const interest = await Interest.findById(req.query.id);

  if (!interest) {
    return next(new ErrorHandler("interest not found", 404));
  }

  //console.log(interest);

  const filterPlayList = user.interest.filter((item) => {
    if (item.toString() !== interest._id.toString()) return item;
  });
  const filterUserList = interest.user.filter((item) => {
    if (item.toString() !== user._id.toString()) return item;
  });
    
  //  console.log("user",filterUserList);
  //  console.log("interest",filterPlayList);


  user.interest = filterPlayList;
  await user.save();

  interest.user=filterUserList
  await interest.save()

  res.status(200).json({
    success: true,
    message: "Interest Removed",
  });
  


})