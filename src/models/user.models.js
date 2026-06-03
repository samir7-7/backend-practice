import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userID: {
      type: String,
      required: [true, "User ID is required"],
      unique: true,
      primaryKey: true,
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      lowercase: true,
    },
    watchHistory: [{ type: Schema.Types.ObjectId, ref: "Video" }],
    fullName: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
      required: [true, "Refresh token is required"],
    },
    avtar: {
      type: String,
      required: [true, "Avtar is required"],
    },
    coverImage: {
      type: String,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
