const mongoose=require('mongoose')




const interestSchema=new mongoose.Schema({

    name:{
        type:String,
        unique:true,
        required:[true,'Please Provide Interest Name']
    },
    description:{
        type:String,
        required:[true,'Please Provide a Description']
    },
    category:{
        type: String,
        required: [true, 'Please select type for this interest'],
    },
    user:[
        {
            
            type:mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    createdAt:{
        type:Date,
        default:Date.now
    },


})

module.exports=mongoose.model('Interest', interestSchema)