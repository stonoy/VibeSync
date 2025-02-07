const express = require("express")
const cors = require("cors")
require("express-async-errors")
require("dotenv").config()
const cookieParser = require("cookie-parser")
const { createServer } = require("http");


const connectDB = require("./config/database")
const errorMiddleware = require("./middlewares/error")
const authRouter = require("./routes/auth_routes")
const thoughtRouter = require("./routes/thought_routes")
const requestRouter = require("./routes/request_routes")
const initiateSocket = require("./socket")
const chat_router = require("./routes/chat_routes")


const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin : "http://localhost:5173",
    credentials: true, // Allow cookies
}))

app.use("/api/user", authRouter)
app.use("/api/thought", thoughtRouter)
app.use("/api/request", requestRouter)
app.use("/api/chat", chat_router)


app.use("*", (req, res) => {
    res.status(404).json({msg : "No such path found"})
})

app.use(errorMiddleware)

const server = createServer(app);

initiateSocket(server)

const port = process.env.PORT || 80

connectDB(process.env.CONN_URI)
    .then(() => {
        server.listen(port, () => {
            console.log(`server is listening on port -> ${port}`)
        })
    })
    .catch((error) => {
        console.log(`server not started,  error in connecting db -> ${error}`)
    })