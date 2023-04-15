const BigPromise = require("../middlewares/BigPromise")
const Conversation = require("../models/Conversation")
const Message = require("../models/Message")
const User = require("../models/User")
const ErrorHandler = require("../utils/ErrorHandler")

exports.createConversation =BigPromise(async(req,res,next)=>{



  const conversation=await Conversation.find({
   $and: [
      { recipents: { $elemMatch: { $eq: req.user._id } } },
      { recipents: { $elemMatch: { $eq: req.body.senderId } } },
    ],

  })

  if(conversation.length>0)
  {
    return res.status(200).json({
      success:true,
      message:"Conversation Fetched"

   })
  }
    
    const newConversation=await Conversation.create({
        recipents:[req.user._id,req.body.senderId]
    })

     res.status(200).json({
        success:true,
        message:"Conversation Created Successfully"
     })




})

exports.getConversation =BigPromise(async(req,res,next)=>{
    
    const conversations=await Conversation.find({ recipents: { $elemMatch: { $eq: req.user._id } } }).populate("recipents")
    .sort({ updatedAt: -1 })

     res.status(200).json({
        success:true,
        conversations

     })




})



exports.createMessage =BigPromise(async(req,res,next)=>{
    const {ConversationId,sender,message}=req.body
     let sendMessage=await Message.create({
        ConversationId,
        sender,
        message
    })

    sendMessage = await sendMessage.populate('sender')
   sendMessage = await sendMessage.populate('ConversationId')
   sendMessage = await sendMessage.populate({
    path: "ConversationId.recipents"
  });


     res.status(200).json({
        success:true,
        sendMessage

     })




})



exports.getMessages =BigPromise(async(req,res,next)=>{
    const messages=await Message.find({ConversationId:req.params.conversationId}).populate('sender')

     res.status(200).json({
        success:true,
        messages

     })




})
