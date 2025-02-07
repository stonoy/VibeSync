const mongoose = require("mongoose")

const RequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        enum: {
            values: ["cancel", "interested", "accepted", "rejected"],
            message: "status is not supported"
        }
    }
}, {timestamps: true})

const Request = mongoose.model("Request", RequestSchema)

module.exports = Request