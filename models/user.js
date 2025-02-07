const mongoose = require("mongoose")
const validator = require("validator")
const createError = require("../error")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minLength: [2, "min name length is 2"],
        maxLength: [10, "max name length is 10"]
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: function(email){
            if (!validator.isEmail(email)){
                createError(`${email} is not valid`, 400)
            }
        }
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        enum: {
            values: ["user", "silver", "gold", "admin"],
            message: "role is not supported"
        }

    },
    limit: {
        type: Number,
        required: true
    },
    age: {
        type: Number,
        required: true,
        default: 18
    },
    bio: {
        type: String,
        trim: true,
        maxLength: [50, "exceeds max length of bio"],
        default: "Hi, I m in VibeSync."
    },
    interests: {
        type: [String],
    },
    avater: {
        type: String,
        default: "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
    },
    gender: {
        type : String,
        required: true,
        enum: {
            values: ["Male", "Female", "Others"],
            message: "gender is not supported"
        },
        default: "Others"
    }
}, {timestamps: true})

UserSchema.methods.comparePassword = async function(userPassword){
    return await bcrypt.compare(userPassword, this.password)
}

UserSchema.methods.createJwt = async function(){
    return await jwt.sign({_id: this._id, role: this.role}, process.env.JWT_SECRET, {expiresIn: '24h'})
}

const User = mongoose.model("User", UserSchema)

module.exports = User