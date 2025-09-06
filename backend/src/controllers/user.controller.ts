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
    
    console.log("=== BACKEND SIGN-IN DEBUG ===");
    console.log("Email:", email);
    console.log("Password provided:", password ? "Yes" : "No");

    // User олдох эсэхийг шалгах
    const user = await User.findOne({ email });
    console.log("User found:", user ? "Yes" : "No");
    console.log("User ID:", user?._id);

    if (!user) {
      console.log("Authentication failed: User not found");
      return response.status(200).json({
        success: false,
        message: "not authenticated",
      });
    }

    // Нууц үг шалгах
    const comparedPassword = await bcrypt.compare(password, user.password);
    console.log("Password compared:", comparedPassword);

    if (!comparedPassword) {
      console.log("Authentication failed: Password mismatch");
      return response.status(200).json({
        success: false,
        message: "not authenticated",
      });
    }

    // Token үүсгэх (зөвхөн амжилттай нэвтрэх үед)
    const token = jwt.sign({ userId: user._id }, "pinecone-test", {
      expiresIn: "24h",
    });

    console.log("Token generated:", token ? "Yes" : "No");
    console.log("Token length:", token?.length);
    console.log("Token type:", typeof token);

    console.log("Authentication successful");
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
    console.error("Sign-in error:", error);
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
    
    console.log("=== PASSWORD RESET REQUEST ===");
    console.log("Email:", email);

    // User олдох эсэхийг шалгах
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log("User not found for password reset");
      return response.status(200).json({
        success: false,
        message: "User not found",
      });
    }

    // Reset token үүсгэх
    const resetToken = jwt.sign({ userId: user._id, email: user.email }, "pinecone-test", {
      expiresIn: "1h", // 1 цаг хүчинтэй
    });

    console.log("Reset token generated for user:", user.email);
    
    // Email илгээх
    const emailResult = await sendPasswordResetEmail(user.email, resetToken);
    
    if (emailResult.success) {
      console.log("Password reset email sent successfully");
      response.status(200).json({
        success: true,
        message: "Password reset email sent successfully",
        // Development-д token буцаах (production-д арилгах)
        resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined,
      });
    } else {
      console.error("Failed to send password reset email:", emailResult.error);
      response.status(500).json({
        success: false,
        message: "Failed to send password reset email",
        error: emailResult.error,
      });
    }
  } catch (error) {
    console.error("Password reset request error:", error);
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
    
    console.log("=== PASSWORD RESET CONFIRM ===");
    console.log("Token provided:", token ? "Yes" : "No");
    console.log("New password provided:", newPassword ? "Yes" : "No");

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
      console.log("Token verified successfully");
    } catch (tokenError) {
      console.log("Token verification failed:", tokenError);
      return response.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    // User олох
    const user = await User.findById(decoded.userId);
    if (!user) {
      console.log("User not found for token");
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

    console.log("Password updated successfully for user:", user.email);

    response.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Password reset confirm error:", error);
    response.status(500).json({
      success: false,
      error: error,
    });
  }
};

// Email service тест хийх
export const testEmail = async (request: Request, response: Response) => {
  try {
    console.log("=== EMAIL SERVICE TEST ===");
    
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
    console.error("Email test error:", error);
    response.status(500).json({
      success: false,
      error: error,
    });
  }
};
