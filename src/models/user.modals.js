import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const user = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
      },
      fullname: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
      },
      avatar: {
        type: String, //by cloudinary
        required: true,
      },
      coverimage: {
        type: String,
      },
      watchhistory:[
        {
          type:mongoose.Schema.Types.ObjectId,
          ref:"Video",
        },
      ],
      password:{
        type:String,
        required:[true,'Password is required'],
      },
      refreshtoken:{
        type:String,
      },
    },
  {timestamps: true }
);
user.pre("save",async function(next){
  if(this.isModified("password"))
  this.password=await bcrypt.hash(this.password,12);
  next;
})

user.methods.isPasswordCorrect=async function(password){
  return await bcrypt.compare(password,this.password);
}

user.methods.generateaccesstoken=function(){
  jwt.sign({      //payload
    _id:this._id, //from mongodb
    email:this.email,
    username:this.username,
    fullname:this.fullname,
  },process.env.ACCESS_TOKEN,{
    expiresIn:process.env.ACCESS_TOKEN_LIFETIME
  }
)
}

user.methods.generaterefreshtoken=function(){
  jwt.sign({      //payload
    _id:this._id, //from mongodb
  },process.env.REFRESH_TOKEN,{
    expiresIn:process.env.REFRESH_TOKEN_EXPIRY
  }
)
}
export const User = mongoose.model("User", user);
