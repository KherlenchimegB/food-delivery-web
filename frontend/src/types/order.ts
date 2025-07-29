// Backend data types
export interface BackendUser {
  _id: string;
  email: string;
  password: string;
  phoneNumber?: string;
  address?: string;
  role: "USER" | "ADMIN";
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BackendFood {
  _id: string;
  foodName: string;
  price: number;
  image?: string;
  ingredients?: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface BackendFoodOrderItem {
  _id: string;
  food: BackendFood;
  quantity: number;
}

export interface BackendOrder {
  _id: string;
  user: BackendUser | null;
  totalPrice: number;
  foodOrderItems: BackendFoodOrderItem[];
  status: "PENDING" | "CANCELED" | "DELIVERED";
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface BackendOrderResponse {
  success: boolean;
  data: BackendOrder[];
}

// Frontend data types (transformed for table)
export interface FoodItem {
  id: string;
  foodName: string;
  count: number;
  price: number;
  image: string;
}

export interface Order {
  id: string;
  email: string;
  food: FoodItem[];
  date: string;
  amount: number; // total
  address: string;
  status: "PENDING" | "CANCELED" | "DELIVERED";
}

// Transform function to convert backend data to frontend format
export const transformBackendOrderToFrontend = (backendOrder: BackendOrder): Order => {
  return {
    id: backendOrder._id,
    email: backendOrder.user?.email || "N/A",
    food: backendOrder.foodOrderItems.map((item) => ({
      id: item.food._id,
      foodName: item.food.foodName,
      count: item.quantity,
      price: item.food.price,
      image: item.food.image || "",
    })),
    date: new Date(backendOrder.createdAt).toISOString().split('T')[0], // Format as YYYY-MM-DD
    amount: backendOrder.totalPrice,
    address: backendOrder.user?.address || "N/A",
    status: backendOrder.status,
  };
};