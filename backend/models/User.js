const mongoose=require('mongoose')
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const crypto = require('crypto');

const userSchema=new mongoose.Schema({
   
    name:{
        type:String,
        required:[true,'Please enter a name'],
        trim:true

    },
    email:{
        type:String,
        required:[true,'Please enter a Email'],
        unique:true,
        validate:validator.isEmail,
        trim:true

    },
    password:{
        type:String,
        required:[true,'Please enter a password'],
        minLength:[6,'Password must be at least 6 characters'],
        select:false,

    },
    avatar:{
        public_id:{
            type:String,
            required:true

        },
        url:{
            type:String,
            required:true
        }
        
    },
    description:{
        type:String
    },
    interest:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: 'Interest'
        }

    ],
    friends:[
        {
    
            type:mongoose.Schema.Types.ObjectId,
            ref: 'User'
        
        }
    ],
    request:[
        {
           type:mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    createdAt:{
        type:Date,
        default:Date.now
    },
    resetPasswordToken:String,
    resetPasswordExpiry:Date,



})


userSchema.pre('save', async function(next){
 
    if(!this.isModified('password')){
        return next()
    }


   this.password=await bcrypt.hash(this.password,10)
   next()

 })

userSchema.methods.getJWTToken=function(){
    return jwt.sign({_id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE_TIME
    })

}
userSchema.methods.comparePassword=async function(password){
    return await bcrypt.compare(password,this.password)

}
userSchema.methods.getResetToken=function(){
  const resetToken=crypto.randomBytes(20).toString("hex")
   this.resetPasswordToken=crypto.createHash("sha256").update(resetToken).digest("hex")
   console.log(this.resetPasswordToken)
   this.resetPasswordExpiry=Date.now()+15*60*1000

   console.log(this.resetPasswordExpiry)

  return resetToken

}

module.exports=mongoose.model('User', userSchema)