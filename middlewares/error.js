const errorMiddleware = (err, req, res, next) => {
    const msg = err.message || "internal server error"
    const statusCode = err.statusCode || 500

    res.status(statusCode).json({msg})
}

module.exports = errorMiddleware