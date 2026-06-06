import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";

const registerUser = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: "User registered successfully",
  });
});

export { registerUser };
