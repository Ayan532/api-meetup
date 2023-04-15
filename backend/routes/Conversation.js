const express=require('express')
const conversation=require('../controllers/Conversation')
const { isAuthenticated } = require('../middlewares/isAuthenticated')
const router=express.Router()


/*--------------------------------------------------------CREATE AND GET CONVERSATION--------------------------------------------------------------------------------*/
router.route("/").post(isAuthenticated,conversation.createConversation).get(isAuthenticated,conversation.getConversation)


/*-------------------------------------------------------- CREATE AND GET MESSAGE--------------------------------------------------------------------------------*/

router.route('/message').post(isAuthenticated,conversation.createMessage)
router.route('/message/:conversationId').get(isAuthenticated,conversation.getMessages)
module.exports=router