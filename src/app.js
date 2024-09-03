import express from 'express'
import cors from "cors"
import cookieParser from "cookie-parser"
const app = express()

// Define your routes and middleware here
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true
}))
app.use(express.json({
    limit:"16k"
}))//forhandling json data
app.use(express.urlencoded({
    extended:true,
    limit:"16k"
}))//forhandling url data
app.use(express.static("public"))//for public pdf and files

//to perform crud opertion on user browser cookies through server
app.use(cookieParser())



export { app };  // Named export instead of default export
