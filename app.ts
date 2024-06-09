import express from 'express'
import dotenv from 'dotenv'
import dbConnect from './config/config'
import cors from 'cors'

import userRouter from './routers/userRouter'
// express app setup 
dotenv.config()
const app = express()
const port = process.env.PORT

// middlewares 
app.use(express.json())
app.use(cors())


//user routes
app.use('/',userRouter)

// server starting and port listening 
dbConnect().then(()=>{
    app.listen(port,()=>{
        console.log(`server listening at ${port}`);
        
    })
})
