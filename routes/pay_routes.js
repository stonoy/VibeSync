const express = require("express")
const { createOrder, checkWebhook, verifyPayment } = require("../controllers/payment")
const userAuth = require("../middlewares/userAuth")


const payRoutes = express.Router()

payRoutes.get("/initiate/:type",userAuth, createOrder)
payRoutes.post("/webhook", checkWebhook)
payRoutes.get("/verify/:orderId", userAuth, verifyPayment)

module.exports = payRoutes