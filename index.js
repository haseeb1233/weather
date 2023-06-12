const express = require("express")
require("dotenv").config()
const {connection} = require("./config/db")
const app = express()
const {userRouter} = require("./routers/user.router")
const {cityRouter} = require("./routers/city.router")
const {auth} = require("./middleware/auth.middleware")
app.use(express.json())

app.use("/users",userRouter)
app.use("/weather",auth,cityRouter)
app.listen(process.env.port,async ()=>{
    
    try {
        await connection
        console.log("connected to mongodb")
    } catch (error) {
        console.log(error.message)
    }
    console.log(`connected to port ${process.env.port}`)
})