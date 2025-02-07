const createError = require("../error")

const applicableUserUpdate = ["interests", "bio", "age", "gender"]

const sanitizeUser = (body) => {
    if(!Object.keys(body).every(key => applicableUserUpdate.includes(key))){
        createError("invalid update keys", 400)
        return
    }

    if (body?.age && body.age < 18){
        createError("user age should be 18 and above", 400)
        return
    }

    if (body?.interests){
        if (body.interests.length > 10 || body.interests.some((interest) => interest.length > 10)){
            createError("invalid interests", 400)
            return
        }

    }
}

module.exports = sanitizeUser