const mongoose = require("mongoose")

const LikeThoughtSchema = new mongoose.Schema({
    thoughtId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Thought",
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true,
    }
},{timestamps: true})


LikeThoughtSchema.index({thoughtId: 1, userId: 1}, {unique: true})

const LikeThought = mongoose.model("LikeThought", LikeThoughtSchema)

module.exports = LikeThought