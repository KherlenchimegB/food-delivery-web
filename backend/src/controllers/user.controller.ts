import { Request, Response } from "express";
import { User } from "../models/user.models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const refresh = async (request: Request, response: Response) => {
  try {
    const user = await User.find();
    response.json({ success: true, data: user });
  } catch (error) {
    response.status(444).json({
      success: false,
      error: error,
    });
  }
};

export const signIn = async (request: Request, response: Response) => {
  try {
    const { email, password } = request.body;
    const user = await User.findOne({ email });

    const comparedPassword = await bcrypt.compare(
      password,
      user?.password || ""
    );

    const token = jwt.sign({ userId: user?._id || "" }, "pinecone-test", {
      expiresIn: "1h",
    });

    if (!comparedPassword) {
      response.status(200).json({
        success: false,
        message: "not authenticated",
      });
    } else {
      response.status(200).json({
        success: true,
        message: "Authenticated",
        token: token,
      });
    }
  } catch (error) {
    response.status(444).json({
      success: false,
      error: error,
    });
  }
};

export const signUp = async (request: Request, response: Response) => {
  const { email, password, phoneNumber } = request.body;
  try {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);

    const hashedPassword = await bcrypt.hash(password, salt);

    const createdUser = await User.create({
      email: email,
      password: hashedPassword,
      phoneNumber: phoneNumber,
    });

    response.status(200).json({
      success: true,
      data: createdUser,
    });
  } catch (error) {
    response.status(444).json({
      success: false,
      error: error,
    });
  }
};

export const updateUser = async (request: Request, response: Response) => {
  try {
    const updatedUser = request.body;
    const { userId } = request.params;
    const user = await User.findByIdAndUpdate(userId, updatedUser, {
      new: true,
    });

    response.json({ success: true, data: user });
  } catch (error) {
    response.status(444).json({
      success: false,
      error: error,
    });
  }
};
