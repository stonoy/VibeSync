const express = require("express")
const {makethought, getThoughts, getMyThoughts, getMySharedThoughts, revealAthought, shareAthought, handleLike} = require("../controllers/thought")
const userAuth = require("../middlewares/userAuth")
const thoughtRouter = express.Router()

thoughtRouter.post("/makethought",userAuth, makethought)
thoughtRouter.get("/thoughts",userAuth, getThoughts)
thoughtRouter.get("/mythoughts",userAuth, getMyThoughts)
thoughtRouter.get("/mysharedthoughts",userAuth, getMySharedThoughts)
thoughtRouter.patch("/revealAthought/:thoughtId",userAuth, revealAthought)
thoughtRouter.patch("/shareAthoughts/:thoughtId",userAuth, shareAthought)
thoughtRouter.post("/likeAthought/:thoughtId",userAuth, handleLike)

module.exports = thoughtRouter