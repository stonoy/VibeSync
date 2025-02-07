const mongoose = require("mongoose")

const MessageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true 
    },
    text: {
        type: String,
        required: true,
        trim: true
    },
    seen:{
        type: Boolean,
        required: true,
    }
}, {timestamps: true})

const ChatSchema = new mongoose.Schema({
    participants: [
        {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true}
    ],
    activeParticipants: [
        {type: mongoose.Schema.Types.ObjectId, ref: "User"}
    ],
    status: {
        type: String,
        enum: {
            values: ["active", "blocked"],
            message: "value is not supported"
        },
        required: true,
        default: "active"
    },
    messages: [MessageSchema],
    lastMessage: MessageSchema,

},{timestamps: true})

const Chat = mongoose.model("Chat", ChatSchema)

module.exports = Chat