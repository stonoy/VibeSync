const express = require("express")
const userAuth = require("../middlewares/userAuth")
const chat_router = express.Router()
const {handleChat,getMyChats,getTheChat,removeActiveFromChat} = require("../controllers/chat")

chat_router.post("/handlechat/:userId",userAuth,  handleChat)
chat_router.get("/getmychats",userAuth,  getMyChats)
chat_router.get("/getthechat/:chatId",userAuth, getTheChat)
chat_router.patch("/removeactive/:chatId",userAuth, removeActiveFromChat)


module.exports = chat_router