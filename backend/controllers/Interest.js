const BigPromise = require("../middlewares/BigPromise")
const Interest = require("../models/Interest")
const User = require("../models/User")
const ErrorHandler = require("../utils/ErrorHandler")

exports.createInterest =BigPromise(async(req,res,next)=>{
    const {name,description,category}=req.body

     if(!name || !description ||!category) return next(new ErrorHandler("Please Insert all Feilds",400))
     
     const result=await Interest.create({
         name,
         description,
         category,
    
        })


     res.status(200).json({
        success:true,
        message:"Interest Created Successfully",

     })




})

exports.addInterest=BigPromise(async(req,res,next)=>{

   console.log(req.user._id,req.body.interestId);

  const user=await User.findById(req.user._id)
  const interest=await Interest.findById(req.body.interestId)

      if (user.interest.includes(req.params.interestId)){


         return res.status(400).json({
            message:"Already In Your Interest"
         });

      }
      if (interest.user.includes(req.user._id))
      {
         return res.status(400).json({
            message:"Already In Your Interest"
         });

      } 
   
      await user.updateOne({ $push: { interest: req.body.interestId }});
      await interest.updateOne({ $push: { user: req.user._id }});


      return res.status(200).json({
         success:true,
         message:"Interest Added Successfully"
      });





})
exports.getInterests =BigPromise(async(req,res,next)=>{
     const interests=await Interest.find({})

     res.status(200).json({
        success:true,
        interests
     })




})
exports.userInterest=BigPromise(async(req,res,next)=>{

   const interest=await User.findById(req.params.userId).populate('interest')
   res.status(200).json({
      success:true,
      interest
   })

})
exports.getInterestsOfLoggedUser =BigPromise(async(req,res,next)=>{
   
     const interests=await Interest.find({user:req.user._id})


     res.status(200).json({
        success:true,
        interests
     })




})
exports.findPeople =BigPromise(async(req,res,next)=>{
     const keyword = req.query.keyword || "";
    const category = req.query.category || "";
    const interest = await Interest.find({
      name: {
        $regex: keyword,
        $options: "i",
      },
      category: {
        $regex: category,
        $options: "i",
      },
   })
     

     if(!interest){
      return next(new ErrorHandler("Interest not Found",400))
     }
     

     
     let user=[];
     console.log(interest);
      for(let i=0;i<interest.length;i++){
   
         if(interest[i].user.length > 0 )
         {
            user=await User.find({ _id: { $in: interest[i].user } });
         }



      }



     res.status(200).json({
        success:true,
        interest,
        user
     })




})