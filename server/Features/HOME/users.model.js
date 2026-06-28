import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minLength: 5,
      maxLength: 13,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    DOB: {
      type: Date,
      required: true,
    },
    level: {
      type: Number,
      default: 0,
    },
    iconFrame: {
      type: String,
      //enums:IconList
      //default:iconName
    },
  },
  {
    timestamps: true,
  },
);

export const User = mongoose.model("User", userSchema);
