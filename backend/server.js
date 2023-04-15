const app = require("./app");
const cloudinary=require('cloudinary')
const connectWithDb = require("./config/database");


connectWithDb()

cloudinary.v2.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

const server=app.listen(process.env.PORT,()=>{
    console.log(`Server listening on ${process.env.PORT}`)
})



/*------------------------------SOCKET LOGIC--------------------------------------------------------------------------------*/

const io=require('socket.io')(server,{
    pingTimeout:60000,
    cors:{
        origin:process.env.FRONTEND_URL
    }
})


io.on("connection", (socket) => {
    console.log("Connected to socket.io");
    socket.on("setup", (userData) => {
        console.log(userData._id);
      socket.join(userData._id);
      socket.emit("connected");



     

     
    });


    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User Joined Room: " + room);
      });

      socket.on("new message", (newMessageRecieved) => {
        console.log(newMessageRecieved.ConversationId);
        var chat = newMessageRecieved.ConversationId;

        console.log(chat);
    
        if (!chat.recipents) return console.log("chat.users not defined");
    
        chat.recipents.forEach((user) => {
          if (user._id == newMessageRecieved.sender._id) return;
    
          socket.in(user._id).emit("message recieved", newMessageRecieved);
        });
      });


     


      socket.on("disconnect", () => {
        console.log("USER DISCONNECTED");
        socket.leave("join chat");
      })

  

})

