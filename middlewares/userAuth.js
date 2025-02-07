const createError = require("../error")
const jwt = require("jsonwebtoken")
const User = require("../models/user")

async function userAuth(req, res, next){
    const {token} = req.cookies

    if (!token){
        createError("no cookie", 400)
        return
    }

    const decoded = await jwt.verify(token, process.env.JWT_SECRET)

    const theLoggedinUser = await User.findById(decoded?._id)

    if (theLoggedinUser){
        req.user = theLoggedinUser
        next()
    } else {
        createError("invalid user token", 400)
    }
}

module.exports = userAuth