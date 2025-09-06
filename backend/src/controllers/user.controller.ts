import { Request, Response } from "express";
import { User } from "../models/user.models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendPasswordResetEmail, testEmailService } from "../util/emailService.js";

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

    // User олдох эсэхийг шалгах
    const user = await User.findOne({ email });

    if (!user) {
      return response.status(200).json({
        success: false,
        message: "not authenticated",
      });
    }

    // Нууц үг шалгах
    const comparedPassword = await bcrypt.compare(password, user.password);

    if (!comparedPassword) {
      return response.status(200).json({
        success: false,
        message: "not authenticated",
      });
    }

    // Token үүсгэх (зөвхөн амжилттай нэвтрэх үед)
    const token = jwt.sign({ userId: user._id }, "pinecone-test", {
      expiresIn: "24h",
    });

    response.status(200).json({
      success: true,
      message: "Authenticated",
      token: token,
      user: {
        email: user.email,
        role: user.role || "USER",
      },
    });
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

export const getUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ _id: id });
    res.status(200).json({
      message: "success",
      email: user?.email,
      role: user?.role,
    });
  } catch (error) {
    res.status(400).json({ error });
  }
};

// Reset password request - email илгээх
export const requestPasswordReset = async (request: Request, response: Response) => {
  try {
    const { email } = request.body;

    // User олдох эсэхийг шалгах
    const user = await User.findOne({ email });
    
    if (!user) {
      return response.status(200).json({
        success: false,
        message: "User not found",
      });
    }

    // Reset token үүсгэх
    const resetToken = jwt.sign({ userId: user._id, email: user.email }, "pinecone-test", {
      expiresIn: "1h", // 1 цаг хүчинтэй
    });
    
    // Email илгээх
    const emailResult = await sendPasswordResetEmail(user.email, resetToken);
    
    if (emailResult.success) {
      response.status(200).json({
        success: true,
        message: "Password reset email sent successfully",
        // Development-д token буцаах (production-д арилгах)
        resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined,
      });
    } else {
      response.status(500).json({
        success: false,
        message: "Failed to send password reset email",
        error: emailResult.error,
      });
    }
  } catch (error) {
    response.status(500).json({
      success: false,
      error: error,
    });
  }
};

// Reset password confirm - шинэ нууц үг тохируулах
export const confirmPasswordReset = async (request: Request, response: Response) => {
  try {
    const { token, newPassword } = request.body;

    if (!token || !newPassword) {
      return response.status(400).json({
        success: false,
        message: "Token and new password are required",
      });
    }

    // Token шалгах
    let decoded: any;
    try {
      decoded = jwt.verify(token, "pinecone-test");
    } catch (tokenError) {
      return response.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    // User олох
    const user = await User.findById(decoded.userId);
    if (!user) {
      return response.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    // Шинэ нууц үг hash хийх
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // User-ийн нууц үг шинэчлэх
    await User.findByIdAndUpdate(user._id, { password: hashedPassword });

    response.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      error: error,
    });
  }
};

// Email service тест хийх
export const testEmail = async (request: Request, response: Response) => {
  try {
    const result = await testEmailService();
    
    if (result.success) {
      response.status(200).json({
        success: true,
        message: "Test email sent successfully",
        messageId: result.messageId,
      });
    } else {
      response.status(500).json({
        success: false,
        message: "Failed to send test email",
        error: result.error,
      });
    }
  } catch (error) {
    response.status(500).json({
      success: false,
      error: error,
    });
  }
};
