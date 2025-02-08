const createError = require("../error")
const User = require("../models/user")
const bcrypt = require("bcrypt")
const sanitizeUser = require("../sanitize/user")
const Thought = require("../models/thought")
const Request = require("../models/request")
const OnlineUser = require("../models/onlineUser")

const register = async(req, res) => {
    const {name, email, password} = req.body

    if (password.length < 6){
        createError("password length must be >= 6", 400)
        return
    }

    const hash = await bcrypt.hash(password, 10)

    let role = "user"

    const userCount = await User.countDocuments()
    if (userCount == 0){
        role = "admin"
    }

    const newUser = User({
        name,
        email,
        password: hash,
        role,
        limit: 10
    })

    await newUser.save()

    res.status(201).json({msg: "user created"})
}

const login = async(req, res) => {
    const { email, password} = req.body

    let theUser = await User.findOne({email})
    if (!theUser){
        createError("Invalid email", 400)
        return
    }

    const isPasswordCorrect = await theUser.comparePassword(password)
    if (!isPasswordCorrect){
        createError("Invalid password", 400)
        return
    }

    const token = await theUser.createJwt()

    res.cookie("token", token, {expires : new Date(Date.now() + 1000*60*60*24)})

    theUser = theUser.toObject()

    delete theUser.password

    res.status(200).json({theUser})
}

const logout = async(req, res) => {
    res.cookie("token", null, {expires: new Date(Date.now())})
    res.status(200).json({msg : "user logged out"})
}

const setProfile = async(req, res) => {
    sanitizeUser(req.body)
    const theLoggedinUserId = req.user._id

    const {interests, age, bio, gender} = req.body

    let theUser = await User.findById(theLoggedinUserId)

    theUser.interests = interests || theUser.interests
    theUser.age = age || theUser.age
    theUser.bio = bio || theUser.bio
    theUser.gender = gender || theUser.gender

    await theUser.save()

    res.status(200).json({msg : "user updated"})
}

const getProfile = async(req,res) => {
    const {userId} = req.params

    const theUser = await User.findById(userId).lean()

    delete theUser.password

    let userSharedThoughts = await Thought.find({toUserId: theUser._id, shared: true}).lean()

    userSharedThoughts = userSharedThoughts.map(thought => {
        delete thought.fromUserId
        delete thought.revealed
        return thought
    })

    res.status(200).json({user: theUser, userSharedThoughts})
}

const getLastSeen = async (req, res) => {
    const loggedInUserId = req.user._id
    const {userId} = req.params

    // both the users should be friends
    const isFriend = await Request.findOne({$or:[
        {fromUserId: loggedInUserId, toUserId:userId, status: "accepted"},
        {fromUserId: userId, toUserId: loggedInUserId, status: "accepted"}
    ]})

    if (!isFriend){
        createError("both are not friends", 400)
        return
    }

    // get the userId in online users list with status offline
    const offlineUser = await OnlineUser.findOne({userId, status: "offline"})
    if (!offlineUser){
        createError("no such data found", 400)
        return
    }

    res.status(200).json({offlineUser})
}

const getUser = async (req, res) => {
    const loggedInUserId = req.user._id

    let theUser = await User.findById(loggedInUserId)
    if (!theUser){
        createError("Invalid user", 400)
        return
    }

    theUser = theUser.toObject()

    delete theUser.password

    res.status(200).json({theUser})
}

const searchUsers = async (req, res) => {
    const {name} = req.params

    if (!name){
        createError("search name should be provided", 400)
        return
    }

    let users = await User.find({name : {$regex: name, $options: "i"}}).limit(10).lean()

    users = users.map(user => {
        return {
            _id: user._id,
            name: user.name
        }
    })

    res.status(200).json({users})
}

module.exports = {register,login,logout,setProfile, getProfile, getLastSeen,getUser, searchUsers}