const express = require("express")
const {register,login,logout,setProfile, getProfile, getLastSeen, getUser, searchUsers} = require("../controllers/user")
const userAuth = require("../middlewares/userAuth")
const authRouter = express.Router()

authRouter.post("/register", register)
authRouter.post("/login", login)
authRouter.post("/logout",userAuth,  logout)
authRouter.patch("/setprofile",userAuth, setProfile)
authRouter.get("/getuser",userAuth, getUser)
authRouter.get("/getprofile/:userId", getProfile)
authRouter.get("/getlastseen/:userId",userAuth, getLastSeen)
authRouter.get("/searchusers/:name", searchUsers)

module.exports = authRouter