const instance = require("../config/razorpay")
const Payment = require("../models/payment")
const {validateWebhookSignature} = require('razorpay/dist/utils/razorpay-utils')
// const { findOne, findById } = require("../models/post")
const User = require("../models/user")
const { memberTypes } = require("../utils")
const createError = require("../error")

const createOrder = async (req, res) => {
    const {type} = req.params
    const loggedInUser = req.user

    if (!Object.keys(memberTypes).includes(type)){
        createError("invalid member type", 400)
        return
    }

    const options = {
        amount: memberTypes[type],
        currency: "INR",
        receipt: "order_rcptid_11",
        notes: {
            name: loggedInUser.name,
            email: loggedInUser.email,
            type
        }
    }

    // console.log(options)

    const order = await instance.orders.create(options)

    // console.log(order)

    const newPayment = Payment({
        userId: loggedInUser._id,
        orderId: order.id,
        amount: order.amount,
        status: order.status
    })

    await newPayment.save()

    res.json({...order, key: process.env.RP_KEY})
}

const checkWebhook = async (req, res) => {
    // console.log(req.body)
    // check header for rp signature
    const webhookSignature = req.get["X-Razorpay-Signature"] || req.get("X-Razorpay-Signature")

    // console.log(webhookSignature)

    // validate webhook
    const isWebhookValid = validateWebhookSignature(JSON.stringify(req.body), webhookSignature, process.env.WEBHOOK_SECRET)

    // console.log(isWebhookValid)

    if (!isWebhookValid){
        createError("webhook is not valid", 400)
        return
    }

    
    // console.log(req.body.payload.payment.entity)

    const {order_id, captured, notes:{type}} = req.body.payload.payment.entity

    // update the payment
    const thePayment = await Payment.findOne({orderId: order_id})
    thePayment.status = captured ? "successful" : "failed"

    await thePayment.save()

    // update the user from payment
    const theUser = await User.findById(thePayment.userId)
    theUser.role = theUser.role == "admin" ? "admin" : type

    await theUser.save()

    res.status(200).json({msg : "ok"})
}

const verifyPayment = async(req, res) => {
    const loggedInUser = req.user

    const thePayment = await Payment.findOne({userId: loggedInUser._id, status: "successful"})


    res.status(200).json({paymentReceived: thePayment?.status})
}


module.exports = {createOrder, checkWebhook, verifyPayment}