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

// Debug middleware - бүх request-ийг log хийх (route-уудын өмнө)
server.use((req, res, next) => {
  console.log(`=== BACKEND REQUEST DEBUG ===`);
  console.log(`Method: ${req.method}`);
  console.log(`URL: ${req.url}`);
  console.log(`Body:`, req.body);
  console.log(`Headers:`, req.headers);
  next();
});

const port = 8000;

server.use("/food", foodsRouter);
server.use("/user", userRouter);
server.use("/food-category", categoryRouter);
server.use("/food-order", orderRouter);

server.listen(port, () => {
  console.log("=== BACKEND SERVER STARTED ===");
  console.log(`Server running on port: ${port}`);
  console.log("Available routes:");
  console.log("- POST /food-order/create");
  console.log("- GET /food-order/:userId");
  console.log("- POST /user/sign-in");
  console.log("Server aslaa");
});
