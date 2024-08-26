import { Asynchandler } from "../utils/asynchandler.js";
import { Apierror } from "../utils/apierror.js";
import { User } from "../models/user.modals.js";
import uploadoncloudinary from "../utils/cloudinary.js";
import { Apiresponse } from "../utils/apiresponse.js";

const generatebothtokens=async (userid)=>{
  try{
    const user= await User.findById(userid)
    const accesstoken=await user.generateaccesstoken()
    const refreshtoken=await user.generaterefreshtoken()
    user.refreshtoken=refreshtoken
    await user.save({validateBeforeSave:false})

    return {accesstoken,refreshtoken}
  }
  catch(error){
    throw new Apierror(500,"Something went wrong. Can not  generate access and refresh tokens")
  }
}

const registeruser=Asynchandler(async (req,res)=>{
  /*
  get user details
  validation if correct data recieved
  check if user already exist
  if file exist or not handle file
  upload files on cloudinary get url
  create user entry in mongodb
  remove password and refreshtoken form resp
  check resp
  return resp 
  */ 
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

const loginuser=Asynchandler(async (req,res)=>{
  //ask for email or username 
  //validate username i.e. find it 
  //password check
  //generate acces token and refresh token and send to user 
  //send cookies
  //send response
  const {email,username,password}=req.body
  if(!username && !email){
    throw new Apierror(400,"email is required")
  }
  const finduser=await User.findOne({
    $or:[{username},{email}]
  })

  if(!finduser){
    throw new Apierror(400,"User does not exist")
  }

  const iscorrectpassword=await finduser.isPasswordCorrect(password)
  if(!iscorrectpassword){
    throw new Apierror(400,"Incorrect Password") 
  }
  const {accesstoken,refreshtoken}= await generatebothtokens(finduser?._id)
  const loggeduser=await User.findById(finduser._id).select("-password -refreshtoken")
  const options={
    httpOnly:true,
    secure:true,
  }
  console.log(accesstoken,refreshtoken)
  return res.
  status(200).
  cookie("accesstoken",accesstoken,options).
  cookie("refreshtoken",refreshtoken,options).
  json(
    new Apiresponse(200,
      {
        user:loggeduser,accesstoken,refreshtoken,
      },
      "User logged in sucessfully"
    )
  )
})

const logoutuser=Asynchandler(async (req,res)=>{
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set:{
        refreshtoken:undefined
      },
    },
    {
      new:true
    }
  )
  const options={
    httpOnly:true,
    secure:true,
  }
  return res.
  status(200).clearCookie("accesstoken",options).
  clearCookie("refreshtoken",options).
  json(new Apiresponse(200,{},"Logged out sucessfully"))
})
export {registeruser,
  loginuser,
  logoutuser,
};