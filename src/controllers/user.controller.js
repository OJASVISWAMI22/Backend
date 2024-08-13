import { Asynchandler } from "../utils/asynchandler.js";
import { Apierror } from "../utils/apierror.js";
import { User } from "../models/user.modals.js";
import uploadoncloudinary from "../utils/cloudinary.js";
import { Apiresponse } from "../utils/apiresponse.js";

const registeruser=Asynchandler(async (req,res)=>{
  const {username,email,fullname,password}=req.body

  if(fullname==""){
    throw new Apierror(400,"Full name is required")
  }
  if(email==""){
    throw new Apierror(400,"email is required")
  }
  if(username==""){
    throw new Apierror(400,"username is required")
  }
  if(password==""){
    throw new Apierror(400,"password is required")
  }
  const exist=await User.findOne({
    $or:[{username},{email}]
  })
  if(exist){
    throw new Apierror(409,"User with this username or email already exist");
  }
  const avatar_localpath=req.files?.avatar[0].path;
  // const coverimage_localpath=req.files?.coverimage[0].path;
  let coverimage_localpath;
  if(req.files && Array.isArray(req.files.coverimage)
  && req.files.coverimage.length>0){
coverimage_localpath=req.files.coverimage[0].path;
}
  if(!avatar_localpath){
    throw new Apierror(400,"Avatar is required");
  }
  const avatar=await uploadoncloudinary(avatar_localpath);
  const coverimage=await uploadoncloudinary(coverimage_localpath);
  if(!avatar){
    throw new Apierror(400,"Avatar is required not uploaded sucessfully");
  }

  const user=await User.create({
    fullname,
    avatar:avatar.url,
    coverimage:coverimage?.url||" ",
    email,
    password,
    username:username.toLowerCase(),
  })
  const isusercreated=await User.findById(user._id).select(
    "-password -refreshtoken"
  )
  if (!isusercreated){
    throw new Apierror(500,"Something went wrong while uploading details")
  }
  return res.status(201).json(
    new Apiresponse(200,isusercreated,"User created succesfully")
  )
})

export {registeruser};