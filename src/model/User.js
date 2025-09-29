import { Schema, model } from "mongoose";

const phoneNumberRegex = /^\+?\d{9,15}$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const UserSchema = new Schema(
  {
    first_name: {
      type: String,
      trim: true,
      required: [true, "First name is required!"],
    },
    last_name: {
      type: String,
      trim: true,
      required: [true, "Last name is required!"],
    },
    phone: {
      type: String,
      trim: true,
      match: [phoneNumberRegex, "Phone number is invalid!"],
      required: [true, "Phone number is required!"],
    },
    email: {
      type: String,
      trim: true,
      match: [emailRegex, "Email is invalid!"],
      required: [true, "Email is required!"],
    },
    password: {
      type: String,
      trim: true,
      minlength: [5, "Password must be at least 5 characters long"],
      required: [true, "Password is required!"],
    },
    role: {
      type: String,
      trim: true,
      default: "user",
      enum: ["user", "admin", "superAdmin"],
    },
    photo: {
      type: String,
      trim: true,
    },
    photoId: {
      type: String,
      trim: true,
    },
    otp: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otpTime: {
      type: Number,
    },
    refreshToken: [
      {
        token: { type: String, trim: true },
        role: {
          type: String,
          trim: true,
          default: "user",
          enum: ["user", "admin", "superAdmin"],
        },
        userAgent: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default model("users", UserSchema);
