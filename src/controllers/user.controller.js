import {asyncHandler } from "../utils/asyncHandler.js";
import {User} from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";

const registerUser = asyncHandler( async (req, res)=>{
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res
    const {fullName, email, username, password } = req.body
    // console.log("email: ", email);
    // console.log("password: ", password);
    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }
   const existedUser= User.findOne({
        $or: [{},{},{ email}]
    })
    if(existedUser){
        throw new ApiError(409,"User Exists")
    }
    //req.body receives entire data but we added middleware in user.routes.js so middleware giving us some access of request like their fields
    //multer gives us access of file
   const avatarLocalPath=req.files?.avatar[0]?.path //path received by multer for avatar
   const coverImageLocalPath=req.files?.cover[0]?.path //path received by multer for coverImage

   //check if image is received or not
   if(!avatarLocalPath){
    throw new ApiError(400,"avatar file is required")
   }
   if(!coverImageLocalPath){
    throw new ApiError(400,"cover image is required")
   }

   //upload on cloudnary
   const avatar=await uploadOnCloudinary(avatarLocalPath)//await to wait till uploading
   const coverImage=await uploadOnCloudinary(coverImageLocalPath)

   //to check avatar gaya hai ki nahi
   if(!avatar){
    throw new ApiError(400,"avatar file is required")
   }
   if(!coverImage){
    throw new ApiError(400,"cover image is required")
   }
   //database entry using obj
   const user=await User.create({
    fullName,
    avatar:avatar.url,
    coverImage:coverImage?.url ||"",
    email,
    password,
    username:username.toLowerCase()
})
//check if user created or not using db
const createdUser=await User.findById(user._id).select("-password -refreshToken")//mongodb cretes and field (_id) with each entry by using user.field(i.e_id like email etc)
//select("-password -refreshToken") for not selecting field to match the user entry

//now check if user is created or not?
if(!createdUser){
    throw new ApiError(500,"something went wrong!!!,while registring user")
}
//return responses with proper api responses
return res.status(201).json(
    new ApiResponse(200,createdUser,"User Registred Successfully")
)


   


})

export {registerUser,}
