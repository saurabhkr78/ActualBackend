import express from 'express'
import cors from "cors"
import cookieParser from "cookie-parser"
const app = express()

// Define middleware here
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true
}))
app.use(express.json({
    limit:"1mb"
}))
//forhandling json data
app.use(express.urlencoded({
    extended:true,
    limit:"1mb"
}))//forhandling url data
app.use(express.static("public"))//for public pdf and files

//to perform crud opertion on user browser cookies through server
app.use(cookieParser())


//routes import here
import UserRouter from './routes/user.routes.js'

//routes declartion
// app.use("/users",UserRouter)
//if using api
app.use("/api/v1/users",UserRouter)

//  









export { app };  // Named export instead of default export
