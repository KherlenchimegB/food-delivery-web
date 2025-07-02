import express, { response } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import foodsRouter from "./routes/food.routes.js";
import categoryRouter from "./routes/category.routes.js";
import orderRouter from "./routes/order.routes.js";
import userRouter from "./routes/user.routes.js";
import verifyToken from "./middleware/auth.js";
import cors from "cors";

dotenv.config();

mongoose.connect(process.env.MONGO_URI || "");

const server = express();
server.use(express.json());
server.use(cors());

const port = process.env.PORT;

server.use("/food", foodsRouter);
server.use("/user", userRouter);
server.use("/food-category", categoryRouter);
server.use("/food-order", orderRouter);

server.listen(port, () => {
  console.log("Server aslaa");
});
