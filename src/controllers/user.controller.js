import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/apiError.js";
import { uploadImageToCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while creating acces and refresh token."
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // get user data
  // validate data
  // check if user exist
  // check for images
  // upload images to cloudinary
  //create user object
  // save user to database
  // let the user know that registration was successful

  const { fullName, email, username, password } = req.body;
  console.log(password);

  if (
    [fullName, email, username, password].some((field) => field.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await User.findOne({
    $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }],
  });

  if (existingUser) {
    throw new ApiError(409, "User with this email or username already exists");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar image is required");
  }

  const avatar = await uploadImageToCloudinary(avatarLocalPath);
  if (!avatar) {
    throw new ApiError(500, "Failed to upload avatar image");
  }

  const coverImage = await uploadImageToCloudinary(coverImageLocalPath);

  const user = await User.create({
    fullName,
    email: email.toLowerCase(),
    username: username.toLowerCase(),
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    password,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Failed to create user");
  }

  res.status(201).json(
    new ApiResponse(200, "User registered successfully", {
      user: createdUser,
    })
  );
});

const loginUser = asyncHandler(async (req, res) => {
  //get user data
  //validate data
  //compare user input data to data in database
  //throw error if no match
  //if match
  //configure access token and refresh token
  //send cookies
  //send response to user

  const { username, password } = req.body;

  if (!username) {
    throw new ApiError(400, "Username is required");
  }

  const loginUser = User.findOne({ username });

  if (!loginUser) {
    throw new ApiError(404, "User doesn't exist");
  }

  const isPasswordValid = await loginUser.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(400, "Incorrect Password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    loginUser._id
  );
});

export { registerUser, loginUser };
