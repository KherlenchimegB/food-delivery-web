import express from "express";
import {
  refresh,
  signIn,
  signUp,
  updateUser,
} from "../controllers/user.controller.js";
import verifyToken from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.get("/refresh", verifyToken, refresh);
userRouter.post("/sign-in", verifyToken, signIn);
userRouter.post("/sign-up", signUp);
userRouter.post("/:userId", verifyToken, updateUser);

export default userRouter;
