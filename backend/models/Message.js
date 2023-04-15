const mongoose=require('mongoose')




const MessageSchema=new mongoose.Schema({

   
    ConversationId:{
            type:mongoose.Schema.Types.ObjectId,
            ref: 'Conversation'
        },

    sender:{

        type:mongoose.Schema.Types.ObjectId,
            ref: 'User'

    },

    message:{
        type:String,
        
    }

   
   },
   {
    timestamps:true
   }
    
    
    )

module.exports=mongoose.model('Message', MessageSchema)