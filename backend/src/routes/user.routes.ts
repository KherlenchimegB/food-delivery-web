import express from "express";
import {
  getUser,
  refresh,
  signIn,
  signUp,
  updateUser,
} from "../controllers/user.controller.js";
import verifyToken from "../middleware/auth.js";
import { authentication } from "../middleware/auth.user.js";

const userRouter = express.Router();

userRouter.get("/refresh", refresh);
userRouter.get("/currentUser", authentication, getUser);
userRouter.post("/sign-in", signIn);
userRouter.post("/sign-up", signUp);
userRouter.post("/:userId", verifyToken, updateUser);

export default userRouter;
