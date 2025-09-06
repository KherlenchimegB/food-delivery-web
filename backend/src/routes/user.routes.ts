import express from "express";
import {
  getUser,
  refresh,
  signIn,
  signUp,
  updateUser,
  requestPasswordReset,
  confirmPasswordReset,
  testEmail,
} from "../controllers/user.controller.js";
import verifyToken from "../middleware/auth.js";
import { authentication } from "../middleware/auth.user.js";

const userRouter = express.Router();

userRouter.get("/refresh", refresh);
userRouter.get("/currentUser", getUser);
userRouter.post("/sign-in", signIn);
userRouter.post("/sign-up", signUp);

// Reset password routes (specific routes first)
userRouter.post("/reset-password", requestPasswordReset);
userRouter.post("/reset-password/confirm", confirmPasswordReset);

// Email test route
userRouter.post("/test-email", testEmail);

// Generic routes last (to avoid conflicts)
userRouter.post("/:userId", verifyToken, updateUser);

export default userRouter;
