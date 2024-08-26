import { User } from "../models/user.modals.js";
import { Apierror } from "../utils/apierror.js";
import { Asynchandler } from "../utils/asynchandler.js";
import jwt from 'jsonwebtoken'
export const verifyjwt = Asynchandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accesstoken ||
      req.header("Authorization")?.replace("Bearer ","");
      console.log("Cookies:", req.cookies);
console.log("Authorization header:", req.header("Authorization"));
      console.log(req.cookies.accesstoken)
      console.log(token)
    if (!token) {
      throw new Apierror(401, "Unauthorized Access");
    }
    
    const decodedtoken = await jwt.verify(token,process.env.ACCESS_TOKEN);
    const user = await User.findById(
      decodedtoken?._id).select("-password -refreshtoken")
  

    if (!user) {
      throw new Apierror(401, "invalid access");
    }

    req.user = user;
    next();
  } 
  catch (error) {
    throw new Apierror(401, error?.message || "Invalid accesstoken");
  }
});
