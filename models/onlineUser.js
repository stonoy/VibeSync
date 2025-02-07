const mongoose = require("mongoose")

const OnlineUserSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
        unique: true
    },
    socketId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: {
            values: ["online", "offline"],
            message: "status value is not supported"
        },
        required: true
    }
}, {timestamps: true})

// OnlineUserSchema.index({userId:1}, {unique: true})

const OnlineUser = mongoose.model("OnlineUser", OnlineUserSchema)

module.exports = OnlineUser