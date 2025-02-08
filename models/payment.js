const mongoose = require("mongoose")

const PaymentSchema = new mongoose.Schema({
    userId: {
        type : mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    orderId: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        required: true,
    }
})

const Payment = mongoose.model("Payment", PaymentSchema)

module.exports = Payment