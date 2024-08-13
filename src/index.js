import dotenv from 'dotenv';
import connectDB from './db/index.js'; 
import app from './app.js'
dotenv.config({
  path:'./.env',
})
connectDB().then(()=>{
  const PORT=process.env.PORT ||8000
  app.listen(PORT,()=>{
    console.log(`Process running at port ${PORT}`);
  })
})
.catch((error)=>{
  console.log(error);
})