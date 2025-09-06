"use client";

import { useState, useEffect } from "react";
import { baseUrl } from "@/lib/utils";
import { OrderData, Payment } from "./types";
import { toast } from "sonner";

export const useOrderData = () => {
  const [orders, setOrders] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  // Backend-с order data татах
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}food-order/`);

      if (response.ok) {
        const responseData = await response.json();

        // Backend response format: { success: true, data: orders[] }
        const orderData: OrderData[] = responseData.data || [];

        // Backend data-г frontend format-руу хөрвүүлэх
        const formattedOrders: Payment[] = orderData.map((order) => ({
          id: order._id,
          email: order.user?.email || "Unknown",
          food: order.foodOrderItems.map((item) => ({
            id: item.food._id,
            foodName: item.food.foodName,
            count: item.quantity,
            price: item.food.price,
            image: item.food.image,
          })),
          date: new Date(order.createdAt)
            .toLocaleDateString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })
            .replace(/(\d+)\/(\d+)\/(\d+)/, "$3/$1/$2"), // MM/DD/YYYY format
          amount: order.foodOrderItems.reduce(
            (total, item) => total + item.food.price * item.quantity,
            0
          ),
          address: order.deliveryAddress || "No address",
          status: order.status,
          createdAt: new Date(order.createdAt), // Original date for filtering
        }));

        setOrders(formattedOrders);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  // Order status update хийх
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`${baseUrl}food-order/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        // Table refresh хийх
        fetchOrders();
      }
    } catch (error) {
    }
  };

  // Сонгосон order-уудын status-г зэрэг солих
  const handleBulkStatusChange = async (newStatus: string, selectedRows: any[]) => {
    if (selectedRows.length === 0) {
      toast.error("No orders selected!");
      return;
    }

    if (
      confirm(
        `Are you sure you want to change the status of ${selectedRows.length} orders to ${newStatus}?`
      )
    ) {
      try {
        const updatePromises = selectedRows.map((row) =>
          fetch(`${baseUrl}food-order/${row.original.id}/status`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: newStatus }),
          })
        );

        const responses = await Promise.all(updatePromises);
        const allSuccessful = responses.every((response) => response.ok);

        if (allSuccessful) {
          // Table refresh хийх
          fetchOrders();
          toast.success("Orders updated successfully!");
        } else {
          toast.error("Some orders failed to update!");
        }
      } catch (error) {
        toast.error("An error occurred!");
      }
    }
  };

  // Modal-аас bulk status change хийх
  const handleModalBulkStatusChange = async (selectedStatus: string, selectedRows: any[]) => {
    if (!selectedStatus) {
      toast.error("Please select a status!");
      return;
    }

    if (selectedRows.length === 0) {
      toast.error("No orders selected!");
      return;
    }

    try {
      const updatePromises = selectedRows.map((row) =>
        fetch(`${baseUrl}food-order/${row.original.id}/status`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: selectedStatus }),
        })
      );

      const responses = await Promise.all(updatePromises);
      const allSuccessful = responses.every((response) => response.ok);

      if (allSuccessful) {
        // Table refresh хийх
        fetchOrders();
        toast.success("Orders updated successfully!");
      } else {
        toast.error("Some orders failed to update!");
      }
    } catch (error) {
      toast.error("An error occurred!");
    }
  };

  // Component mount хийхэд data татах
  useEffect(() => {
    fetchOrders();
  }, []);

  return {
    orders,
    loading,
    fetchOrders,
    handleStatusChange,
    handleBulkStatusChange,
    handleModalBulkStatusChange,
  };
};
