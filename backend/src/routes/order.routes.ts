import express from "express";
import {
  getAllOrder,
  getOrderByUserId,
  createOrder,
  updateOrderById,
  deleteOrder,
} from "../controllers/order.controller.js";
import verifyToken from "../middleware/auth.js";

const orderRouter = express.Router();

orderRouter.get("/", verifyToken, getAllOrder);
orderRouter.get("/:userId", getOrderByUserId);
orderRouter.post("/", createOrder);
orderRouter.patch("/:foodOrderId", verifyToken, updateOrderById);
orderRouter.delete("/:foodOrderId", verifyToken, deleteOrder);

export default orderRouter;
