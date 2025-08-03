import { Request, Response } from "express";
import { Order } from "../models/order.models.js";
import { User } from "../models/user.models.js";

export const getAllOrder = async (request: Request, response: Response) => {
  try {
    const orders = await Order.find()
      .populate("user")
      .populate("foodOrderItems.food");

    response.json({ success: true, data: orders });
  } catch (error) {
    response.status(444).json({
      success: false,
      error: error,
    });
  }
};

export const getOrderByUserId = async (
  request: Request,
  response: Response
) => {
  try {
    const { userId } = request.params; // Fixed parameter name
    const orderById = await Order.findById(userId);
    response.json({ success: true, data: orderById });
  } catch (error) {
    response.status(444).json({
      success: false,
      error: error,
    });
  }
};

export const createOrder = async (request: Request, response: Response) => {
  try {
    const orderData = request.body;

    // User email-ээс ObjectId олох
    const user = await User.findOne({ email: orderData.user });
    if (!user) {
      response.status(400).json({
        success: false,
        message: "User not found",
      });
      return; // Added return statement
    }

    const createdOrder = {
      ...orderData,
      user: user._id, // ObjectId болгон хөрвүүлэх
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const orders = await Order.create(createdOrder);
    response.json({ success: true, data: orders });
  } catch (error) {
    console.error("Order creation error:", error);
    response.status(444).json({
      success: false,
      error: error,
    });
  }
};

export const updateOrderById = async (request: Request, response: Response) => {
  try {
    const updatedOrder = request.body;
    const { foodOrderId } = request.params;
    const order = await Order.findByIdAndUpdate(foodOrderId, updatedOrder, {
      new: true,
    });
    response.json({ success: true, data: order });
  } catch (error) {
    response.status(444).json({
      success: false,
      error: error,
    });
  }
};

export const deleteOrder = async (request: Request, response: Response) => {
  try {
    const deletedOrder = request.body;
    const { foodOrderId } = request.params;
    const order = await Order.findByIdAndDelete(foodOrderId, deletedOrder);
    response.json({ success: true, data: order });
  } catch (error) {
    response.status(444).json({
      success: false,
      error: error,
    });
  }
};

// Order status update хийх
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    console.log("Update order status:", { orderId, status }); // Debug log

    // Status validation
    const validStatuses = ["PENDING", "DELIVERED", "CANCELED"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be PENDING, DELIVERED, or CANCELED",
      });
    }

    // Order-ийг олж status update хийх
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    console.log("Order status updated successfully:", updatedOrder); // Debug log

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
