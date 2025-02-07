class CustomError extends Error{
    constructor(message, statusCode){
        super(message)
        this.statusCode = statusCode
    }
}

function createError(msg, code){
    throw new CustomError(msg, code)
}

module.exports = createError