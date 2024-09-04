import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";


const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, username, password } = req.body;

    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
        
    });
     

    if (existedUser) {
        throw new ApiError(409, "User Exists");
    }
    // Logging to check the received files
    console.log("Files received: ", req.files);



    
    // const avatarLocalPath = req.files?.avatar?.[0]?.path; // Path received by multer for avatar
    // const coverImageLocalPath = req.files?.cover?.[0]?.path;Path received by multer for coverImage
    const avatarLocalPath = req.files?.avatar[0]?.path;
    //const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }
    

    // Check if image is received or not
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required");
    }
   

    // Upload on Cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath); // Await to wait till uploading
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    console.log("Avatar Upload Response: ", avatar);
    console.log("Cover Image Upload Response: ", coverImage);

    // Check if images were uploaded
    if (!avatar) {
        throw new ApiError(400, "Failed to upload avatar");
    }
 

    // Database entry using the object
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase(),
    });

    // Check if user was created
    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    // Return response with proper API response
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User Registered Successfully")
    );
});

export { registerUser };
