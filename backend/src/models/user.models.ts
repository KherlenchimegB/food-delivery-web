import mongoose from "mongoose";

const { Schema, model } = mongoose;

const user = new Schema({
  email: {
    type: String,
    required: [true, "Please enter email!"],
    unique: true,
  },
  password: { type: String, required: [true, "Please enter password!"] },
  phoneNumber: { type: String, required: true },
  address: String,
  role: {
    type: String,
    enum: ["USER", "ADMIN"],
    default: "USER",
  },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const User = model("User", user);
