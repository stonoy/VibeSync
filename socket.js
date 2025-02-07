const socket = require("socket.io")
const OnlineUser = require("./models/onlineUser")
const Request = require("./models/request")
const Chat = require("./models/chat")

const provideRoomId = (id1, id2) => [id1,id2].sort().join("$")

const initiateSocket = (server) => {
    const io = socket(server, {
        cors: {
            origin: "http://localhost:5173"
        }
    })

    io.on("connection", (socket) => {
        try {
            const socketId = socket.id

        socket.on("connectSocket", async ({userId}) => {
            // check if the user is already in db then delete it
            const onlineUser = await OnlineUser.findOne({userId})
            console.log("connects")

            if (onlineUser){
                // delete old record
                await OnlineUser.deleteOne({userId})
            }

            // create a new one with latest socket.id, becoz each time socket connects there is a new socket.id
            const newOnlineUser = OnlineUser({
                userId,
                socketId,
                status: "online",
            })

            await newOnlineUser.save()

            // search all his friends who are online now
            const inRequest = await Request.find({$or:[
                {fromUserId: userId, status: "accepted"},
                {toUserId: userId, status: "accepted"}
            ]})
        
            const friends = inRequest.map(request => {
                if (request.fromUserId._id.toString() == userId.toString()){
                    return request.toUserId
                }
                return request.fromUserId
            })

            const friendsWhoROnline = await OnlineUser.find({userId : {$in: friends}, status: "online"})

            // loop through online friends and send them my Id, bcoz -> i m now online
            friendsWhoROnline.forEach(friendOnline => {
                io.to(friendOnline.socketId).emit("userOnline", userId)
            })
            
        })

        socket.on("joinroom", ({toUserId, fromUserId}) => {
            const roomId = provideRoomId(toUserId, fromUserId)
            // check room 
            socket.join(roomId)
            console.log("room  ", roomId)
        })

        socket.on("sendMessage", async ({toUserId, fromUserId, text, chatId}) => {
            const roomId = provideRoomId(toUserId, fromUserId)

            // get the chat check if block or not
            const theChat = await Chat.findById(chatId)

            if (!theChat){
                io.to(roomId).emit("receiveError", "invalid chat")
                return
            }

            if (theChat.status == "blocked"){
                io.to(roomId).emit("receiveError", "chat blocked")
                return
            }

            // check both user are friends or not
            const isFriend = await Request.findOne({$or:[
                {fromUserId, toUserId, status: "accepted"},
                {fromUserId: toUserId, toUserId: fromUserId, status: "accepted"}
            ]})

            if (!isFriend){
                io.to(roomId).emit("receiveError", "both users are not friend")
                return
            }

            // check toUserId is present in chat active list
            const receiverMsgUserIsActive = theChat.activeParticipants.includes(toUserId)

            // construct a msg accordingly
            let newMsg = {
                sender: fromUserId,
                text,
                seen: receiverMsgUserIsActive ? true : false
            }

            // update the last message of the chat
            theChat.messages = [...theChat.messages, newMsg]
            theChat.lastMessage = newMsg

            await theChat.save()

            newMsg = {...newMsg, createdAt: new Date(Date.now())}

            // send the msg to the room
            io.to(roomId).emit("receiveMessage", ({chatId, newMsg}))
        })

        socket.on("disconnect", async () => {
            // search the online user with socket.id
            // console.log(userId)
            const onlineUser = await OnlineUser.findOne({socketId})

            if (!onlineUser){
                return
            }

            // update its status to offline
            onlineUser.status = "offline"

            await onlineUser.save()

            // send all of his online friend that he is now offline
            const inRequest = await Request.find({$or:[
                {fromUserId: onlineUser?.userId, status: "accepted"},
                {toUserId: onlineUser?.userId, status: "accepted"}
            ]})
        
            const friends = inRequest.map(request => {
                if (request.fromUserId._id.toString() == onlineUser?.userId.toString()){
                    return request.toUserId
                }
                return request.fromUserId
            })

            const friendsWhoROnline = await OnlineUser.find({userId : {$in: friends}, status: "online"})

            // loop through online friends and send them my Id, bcoz -> i m now online
            friendsWhoROnline.forEach(friendOnline => {
                io.to(friendOnline.socketId).emit("userOffline", onlineUser?.userId)
            })
        })
        } catch (error) {
            console.log(error)
        }
    })
}

module.exports = initiateSocket