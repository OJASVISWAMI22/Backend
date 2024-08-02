import mongoose from 'mongoose'
import {DB_NAME} from '../constant.js'

const connectDB=async()=>{
  try{
    const connect=await mongoose.connect(`{process.env.MONGODB_URL}/${DB_NAME}`);
    console.log(`MONGO DB CONNECTED AT ${connect.connection.host}`);
  }
  catch(error){
    console.log("Error in DB connectionn");
    throw err
  }
}

export default connectDB;