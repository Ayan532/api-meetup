
/*--------------------------------Import--------------------------------------*/
const express=require('express');
const cookieParser=require('cookie-parser');
const cors=require('cors')
const ErrorMiddleware=require('./middlewares/ErrorMiddleware')
const app=express()
require('dotenv').config({path:'./config/config.env'})


/*----------------------------Middlewares-------------------------------------*/
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true,
    methods:['GET', 'POST','PUT','DELETE']
    
}))



/*----------------------------Import Routes-------------------------------------*/

const user=require('./routes/User')
const interest=require('./routes/Interest')
const conversation=require('./routes/Conversation')

/*----------------------------Routes-------------------------------------*/
app.use('/api/v1/auth',user)
app.use('/api/v1/interest',interest)
app.use('/api/v1/conversation',conversation)








module.exports=app;
app.use(ErrorMiddleware)


