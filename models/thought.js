const mongoose = require("mongoose")


const ThoughtSchema = new mongoose.Schema({
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    text: {
        type: String,
        required: true,
        trim: true,
        maxLength: [100, "max length exceeds"]
    },
    shared: {
        type: Boolean,
        default: false,
        required: true,
    },
    revealed: {
        type: Boolean,
        default: false,
        required: true,
    },
    likes: {
        type: Number,
        default: 0,
        required: true,
    }
}, {timestamps: true})

const Thought = mongoose.model("Thought", ThoughtSchema)

module.exports = Thought