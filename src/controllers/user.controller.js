import { Asynchandler } from "../utils/asynchandler.js";

const registeruser=Asynchandler(async (req,res)=>{
  res.status(200).json({
    message:"ojasvi swami the goat",
  })
})

export {registeruser};