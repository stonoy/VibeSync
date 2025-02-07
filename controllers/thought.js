const createError = require("../error")
const LikeThought = require("../models/likeThought")
const Thought = require("../models/thought")
const User = require("../models/user")

const allowedUserInfo = "name role"


const makethought = async (req, res) => {
    const {toUserId, text} = req.body
    const loggedInUserId = req.user._id

    const toUser = await User.findById(toUserId)
    if (!toUser){
        createError("invalid user", 400)
        return
    }

    if (toUserId.toString() == loggedInUserId.toString()){
        createError("both are same user", 400)
        return
    }

    const newThought = Thought({
        toUserId,
        fromUserId: loggedInUserId,
        text,
    })

    await newThought.save()

    res.status(201).json({msg : "thought created"})

}

const getThoughts = async (req, res) => {
    const loggedInUserId = req.user._id

    let thoughts = await Thought.find({toUserId: loggedInUserId}).lean()

    thoughts = thoughts.map(thought => {
        delete thought.fromUserId
        return thought
    })

    res.status(200).json({thoughts})
}

const getMyThoughts = async (req, res) => {
    const loggedInUserId = req.user._id

    let thoughts = await Thought.find({fromUserId: loggedInUserId}).populate("toUserId", allowedUserInfo)

    res.status(200).json({thoughts})
}

const getMySharedThoughts = async (req, res) => {
    const loggedInUserId = req.user._id
    

    let thoughts = await Thought.find({toUserId: loggedInUserId, shared: true}).lean()

    thoughts = thoughts.map(thought => {
        delete thought.fromUserId
        return thought
    })

    res.status(200).json({thoughts})
}

const revealAthought = async (req, res) => {
    const {thoughtId} = req.params
    const loggedInUserId = req.user._id

    const thought = await Thought.findOne({
        _id: thoughtId,
        toUserId: loggedInUserId
    }).populate("fromUserId", allowedUserInfo)

    if (!thought){
        createError("no such thought exists", 400)
        return
    }

    if (thought.revealed){
        res.status(200).json({thought})
        return
    }

    if (req.user.limit < 1){
        createError("out of limit", 400)
        return
    }

    await User.updateOne({_id: loggedInUserId}, {$inc: {limit: -1}})

    thought.revealed = true

    await thought.save()

    res.status(200).json({thought})
}

const shareAthought = async (req, res) => {
    const {thoughtId} = req.params
    const loggedInUserId = req.user._id

    const thought = await Thought.findOne({
        _id: thoughtId,
        toUserId: loggedInUserId,
        shared: false
    })

    if (!thought){
        createError("invalid thought to share", 400)
        return
    }

    thought.shared = true

    await thought.save()

    res.status(200).json({msg: "thought shared"})
}

const handleLike = async( req, res) => {
    const {thoughtId} = req.params

    const thought = await Thought.findById(thoughtId)
    if (!thought){
        createError("invalid thought", 400)
        return
    }

    const likeThought = await LikeThought.findOne({thoughtId, userId: req.user._id})

    if (likeThought){
        await LikeThought.deleteOne({thoughtId, userId: req.user._id})
        await Thought.updateOne({_id: thoughtId}, {$inc:{likes: -1}})
        res.status(200).json({msg: "unliked"})
        return
    }

    await LikeThought.create({thoughtId, userId: req.user._id})
    await Thought.updateOne({_id: thoughtId}, {$inc:{likes: 1}})
    res.status(200).json({msg: "liked"})
}

module.exports = {makethought, getThoughts, getMyThoughts, getMySharedThoughts, revealAthought, shareAthought, handleLike}