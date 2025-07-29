import { useState, useEffect } from 'react';
import { ordersApi } from '@/lib/api';
import { BackendOrderResponse, Order, transformBackendOrderToFrontend } from '@/types/order';

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response: BackendOrderResponse = await ordersApi.getAllOrders();
      
      if (response.success) {
        const transformedOrders = response.data.map(transformBackendOrderToFrontend);
        setOrders(transformedOrders);
      } else {
        setError('Failed to fetch orders');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await ordersApi.updateOrderStatus(orderId, status);
      // Refresh orders after update
      await fetchOrders();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update order status');
      console.error('Error updating order status:', err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return {
    orders,
    loading,
    error,
    refetch: fetchOrders,
    updateOrderStatus,
  };
};