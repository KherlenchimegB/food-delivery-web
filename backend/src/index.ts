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

// Environment variables тохируулах
process.env.GMAIL_USER = process.env.GMAIL_USER || 'your-email@gmail.com';
process.env.GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD || 'your-app-password';
process.env.FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

mongoose.connect(process.env.MONGO_URI || "");

const server = express();
server.use(express.json());
server.use(cors());


const port = 8000;

server.use("/food", foodsRouter);
server.use("/user", userRouter);
server.use("/food-category", categoryRouter);
server.use("/food-order", orderRouter);

server.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
