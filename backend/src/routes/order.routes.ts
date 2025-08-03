import express from "express";
import {
  createOrder,
  getAllOrder,
  getOrderByUserId,
  deleteOrder,
  updateOrderStatus,
} from "../controllers/order.controller.js";
import verifyToken from "../middleware/auth.js";

const orderRouter = express.Router();

// Order үүсгэх
orderRouter.post("/", verifyToken, createOrder);

// Бүх order авах
orderRouter.get("/", getAllOrder);

// Тухайн user-ийн order авах
orderRouter.get("/user/:userId", verifyToken, getOrderByUserId);

// Order устгах
orderRouter.delete("/:foodOrderId", deleteOrder);

// Order status update хийх
orderRouter.patch("/:orderId/status", updateOrderStatus);

export default orderRouter;
