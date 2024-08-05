import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';

cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret:process.env.CLOUD_API_SECRET, 
});

const uploadoncloudinary=async (pathtofile)=>{
  try{
    if(!pathtofile)return null;        //no file present
    const resp=await cloudinary.uploader.upload(pathtofile,{resource_type:"auto"});
    //uploaded on cloudinary 
    console.log(resp.url);
    return resp.url;
  }
  catch(error){
    fs.unlinkSync(pathtofile);
    return null;
  }
}

export default uploadoncloudinary;
