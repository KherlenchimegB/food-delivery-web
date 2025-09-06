// Backend-с ирэх order data-ийн төрөл
export type OrderData = {
  _id: string;
  user: {
    email: string;
  };
  foodOrderItems: {
    food: {
      _id: string;
      foodName: string;
      price: number;
      image: string;
    };
    quantity: number;
  }[];
  status: "PENDING" | "CANCELED" | "DELIVERED";
  createdAt: string;
  deliveryAddress: string;
};

// Frontend-д харагдах төрөл
export type Payment = {
  id: string;
  email: string;
  food: {
    id: string;
    foodName: string;
    count: number;
    price: number;
    image: string;
  }[];
  date: string;
  amount: number;
  address: string;
  status: "PENDING" | "CANCELED" | "DELIVERED";
  createdAt: Date; // Added for date range filtering
};
