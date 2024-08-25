import { User } from "../models/user.modals.js";
import { Apierror } from "../utils/apierror.js";
import { Asynchandler } from "../utils/asynchandler.js";

export const verifyjwt = Asynchandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accesstoken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new Apierror(401, "Unauthorized Access");
    }

    const decodedtoken = jwt.verify(token, process.env.ACCESS_TOKEN);
    const user = await User.findById(
      decodedtoken._id.select("-password -refreshtoken")
    );

    if (!user) {
      throw new Apierror(401, "invalid access");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new Apierror(401, error?.message || "Invalid accesstoken");
  }
});
