import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
   // get user details from frontend
   const { fullName, username, email, password } = req.body;

   // validation - not empty
   if (
      [fullName, username, email, password].some(
         (field) => field?.trim() === ""
      )
   ) {
      throw new ApiError(400, " All fields are required ");
   }

   // check if user is already exists: username, email
   const existsUser = await User.findOne({
      $or: [{ username }, { email }],
   });

   if (existsUser) {
      throw new ApiError(409, "User with email or username already exists");
   }

   // check for images, check for avatar
   const avatarLocalPath = req.files?.avatar[0]?.path;
   const coverImageLocalPath = req.files?.coverImage[0]?.path;

   if (!avatarLocalPath) {
      throw new ApiError(400, "Avatar file is required");
   }

   // upload them to cloudinary, avatar
   const avatar = await uploadOnCloudinary(avatarLocalPath);
   const coverImage = await uploadOnCloudinary(coverImageLocalPath);

   if (!avatar) {
      throw new ApiError(400, " Avatar file uploading failed ");
   }

   //create user object - create entry in db
   const user = await User.create({
      fullName,
      avatar: avatar.url,
      coverImage: coverImage?.url || "",
      email,
      password,
      username: username.toLowerCase(),
   });

   // remove password from refresh token field from user object response
   const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
   );

   // check for user creation
   if (!createdUser) {
      throw new ApiError(500, "Something went wrong while registering user");
   }

   // return res
   return res
      .status(201)
      .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

export { registerUser };
