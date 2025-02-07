const createError = require("../error")
const OnlineUser = require("../models/onlineUser")
const Request = require("../models/request")
const Thought = require("../models/thought")
const User = require("../models/user")
const { checkInitiateRequestStatus, checkVerifyStatus } = require("../sanitize/request")

const provideUserDetailsWithPosts = "name role bio"

const initiateRequest = async(req, res) => {
    const {status, toUserId} = req.params
    const loggedInUser = req.user

    const ok = checkInitiateRequestStatus(status)
    if (!ok){
        createError("status is not valid", 400)
        return
    }

    const toUser = await User.findById(toUserId)
    if (!toUser){
        createError("user is not valid", 400)
        return
    }

    // both the users should not be same
    if (loggedInUser._id.toString() == toUser._id.toString()){
        createError("both the users should not be same", 400)
        return
    }

    // both the users should not already in request
    const alreadyInRequest = await Request.findOne({$or:[
        {fromUserId: loggedInUser._id, toUserId:toUser._id},
        {fromUserId: toUser._id, toUserId: loggedInUser._id}
    ]})

    if (alreadyInRequest){
        createError("already in request", 400)
        return
    }

    const newRequest = Request({
        fromUserId: loggedInUser._id,
        toUserId,
        status
    })

    await newRequest.save()

    res.status(201).json({msg:"request saved"})
}

const verifyRequest = async(req, res) => {
    const {status, requestId} = req.params
    const loggedInUser = req.user

    const ok = checkVerifyStatus(status)
    if (!ok){
        createError("status is not valid", 400)
        return
    }

    const theRequest = await Request.findOne({_id: requestId, status: "interested", toUserId: loggedInUser._id})
    if (!theRequest){
        createError("request is not valid", 400)
        return
    }

    theRequest.status = status

    await theRequest.save()

    res.status(200).json({msg:"request updated"})
}

const suggestions = async (req, res) => {
    const loggedInUser = req.user 
    // get users who are in request
    const inRequest = await Request.find({$or:[
        {fromUserId: loggedInUser._id},
        {toUserId: loggedInUser._id}
    ]})

    const inRequestIdArray = inRequest.map(request => {
        if (request.fromUserId.toString() == loggedInUser._id.toString()){
            return request.toUserId
        }
        return request.fromUserId
    })

    // get users who not in the request
    let notInRequestUsers = await User.find({_id: {$nin : [...inRequestIdArray, loggedInUser._id]}}).lean()

    notInRequestUsers = notInRequestUsers.map(user => {
        delete user.password
        return user
    })

    res.status(200).json({suggestions: notInRequestUsers})
}

const reviewRequest = async(req, res) => {
    const loggedInUser = req.user 

    // get all request where logged user is toUserId and status interested

    const requestToReview = await Request.find({toUserId: loggedInUser._id, status: "interested"}).populate("fromUserId", provideUserDetailsWithPosts)

    res.status(200).json({requestToReview})
}

const getFriends = async (req, res) => {
    const loggedInUser = req.user

    const inRequest = await Request.find({$or:[
        {fromUserId: loggedInUser._id, status: "accepted"},
        {toUserId: loggedInUser._id, status: "accepted"}
    ]})
    .populate("fromUserId", provideUserDetailsWithPosts)
    .populate("toUserId", provideUserDetailsWithPosts)

    const friends = inRequest.map(request => {
        if (request.fromUserId._id.toString() == loggedInUser._id.toString()){
            return request.toUserId
        }
        return request.fromUserId
    })

    res.status(200).json({friends})

}

const friendsSharedThoughts = async (req, res) => {
    const loggedInUser = req.user

    const inRequest = await Request.find({$or:[
        {fromUserId: loggedInUser._id, status: "accepted"},
        {toUserId: loggedInUser._id, status: "accepted"}
    ]})

    const friends = inRequest.map(request => {
        if (request.fromUserId._id.toString() == loggedInUser._id.toString()){
            return request.toUserId
        }
        return request.fromUserId
    })

    let friendsSharedThoughts = await Thought.find({toUserId: {$in: friends}, shared: true}).lean()

    friendsSharedThoughts = friendsSharedThoughts.map(thought => {
        delete thought.fromUserId
        delete thought.revealed
        return thought
    })

    res.status(200).json({friendsSharedThoughts})
}

const friendsOnline = async (req, res) => {
    const loggedInUserId = req.user._id

     // search all his friends who are online now
     const inRequest = await Request.find({$or:[
        {fromUserId: loggedInUserId, status: "accepted"},
        {toUserId: loggedInUserId, status: "accepted"}
    ]})

    const friends = inRequest.map(request => {
        if (request.fromUserId._id.toString() == loggedInUserId.toString()){
            return request.toUserId
        }
        return request.fromUserId
    })

    let friendsWhoROnline = await OnlineUser.find({userId : {$in: friends}, status: "online"}).lean()

    friendsWhoROnline = friendsWhoROnline.map(online => {
        return online.userId
    })

    res.status(200).json({friendsWhoROnline})
}

module.exports = {initiateRequest, verifyRequest, suggestions, reviewRequest, getFriends, friendsSharedThoughts, friendsOnline}