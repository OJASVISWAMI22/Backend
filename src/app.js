import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
const app=express()
app.use(cors({
  origin:process.env.CORS_ORIGIN,
  status:200,
}));

app.use(express.json({limit:"16kb"}))
app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())


import Userrouter from './routes/user.routes.js';
app.use("/api/v1/user",Userrouter)
export default app;