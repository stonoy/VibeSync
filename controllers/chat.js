const createError = require("../error")
const Chat = require("../models/chat")
const User = require("../models/user")
const Request = require("../models/request")

const allowedUserInfo = "name role avater"

const handleChat = async (req, res) => {
    const loggedInUserId = req.user._id
    const {userId} = req.params

    const theChat = await Chat.findOne({participants: {$all: [loggedInUserId, userId]}})

    if (theChat){
        res.status(200).json({theChat})
        return
    }

    const user = await User.findById(userId)
    if (!user){
        createError("invalid user", 400)
        return
    }

    // both the users should be friends
    const isFriend = await Request.findOne({$or:[
        {fromUserId: loggedInUserId, toUserId:userId, status: "accepted"},
        {fromUserId: userId, toUserId: loggedInUserId, status: "accepted"}
    ]})

    if (!isFriend){
        createError("they are not friends", 400)
        return
    }

    const newChat = Chat({
        participants: [loggedInUserId, userId],

    })

    await newChat.save()

    res.status(201).json({theChat:newChat})
}

const getMyChats = async(req, res) => {
    const loggedInUserId = req.user._id

    let myChats = await Chat.find({participants: {$in: [loggedInUserId]}}).populate("participants", allowedUserInfo).lean()

    myChats = myChats.map(chat => {
        return {
            chatId: chat._id,
            participants: chat.participants,
            lastMessage: chat?.lastMessage
        }
    })

    res.status(200).json({myChats})
}

const getTheChat = async(req, res) => {
    const loggedInUserId = req.user._id
    const {chatId} = req.params

    const theChat = await Chat.findById(chatId).populate("participants", allowedUserInfo)

    if (!theChat){
        createError("invalid chat", 400)
        return
    }

    if (!theChat.activeParticipants.includes(loggedInUserId)){
        theChat.activeParticipants = [...theChat.activeParticipants, loggedInUserId]
    }

    theChat.messages = theChat.messages.map(msg => {
        if (msg.sender.toString() != loggedInUserId.toString()){
            
            return {...msg, seen: true}
        }
        return msg
    })



    await theChat.save()

    res.status(200).json({theChat})
}

const removeActiveFromChat = async(req, res) => {
    const loggedInUserId = req.user._id
    const {chatId} = req.params

    const theChat = await Chat.findById(chatId)

    if (!theChat){
        createError("invalid chat", 400)
        return
    }

    await Chat.updateOne({_id:chatId}, {$pull : {activeParticipants : loggedInUserId}})

    res.status(200).json({msg: "removed from active"})
}

module.exports = {handleChat,getMyChats,getTheChat,removeActiveFromChat}