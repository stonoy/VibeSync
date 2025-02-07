const express = require("express")
const {initiateRequest, verifyRequest, suggestions, reviewRequest, getFriends,friendsSharedThoughts,friendsOnline} = require("../controllers/request")
const userAuth = require("../middlewares/userAuth")
const requestRouter = express.Router()

requestRouter.post("/initiate/:status/:toUserId",userAuth, initiateRequest)
requestRouter.patch("/review/:status/:requestId",userAuth, verifyRequest)
requestRouter.get("/suggestions",userAuth, suggestions )
requestRouter.get("/review",userAuth, reviewRequest )
requestRouter.get("/friends",userAuth, getFriends )
requestRouter.get("/getfriendssharedthoughts",userAuth, friendsSharedThoughts )
requestRouter.get("/getonlinefriends",userAuth, friendsOnline )

module.exports = requestRouter