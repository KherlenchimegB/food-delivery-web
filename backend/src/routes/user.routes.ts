import express from "express";
import {
  refresh,
  signIn,
  signUp,
  updateUser,
} from "../controllers/user.controller.js";
import verifyToken from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.get("/refresh", refresh);
userRouter.post("/sign-in", signIn);
userRouter.post("/sign-up", signUp);
userRouter.post("/:userId", updateUser);

export default userRouter;
