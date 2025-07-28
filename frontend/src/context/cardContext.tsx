"use client";

import { createContext, useState } from "react";

type CartItem = {
  foodName: string;
  price: number;
  image: string;
};

type CartContextProps = {
  cartItem: CartItem[];
  addToCart: (cartItem: CartItem) => void;
  removeCartItem: (cartItemId: string) => void;
};

export const CartContext = createContext<CartContextProps>({
  cartItem: [],
  addToCart: () => {},
  removeCartItem: () => {},
});

export const CartContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [cartItem, setCartItem] = useState<CartItem[]>([]);

  const addToCart = (foodItem: CartItem) => {
    setCartItem([...cartItem, foodItem]);
  };

  const removeCartItem = (foodId: string) => {};

  return (
    <CartContext.Provider value={{ cartItem, addToCart, removeCartItem }}>
      {children}
    </CartContext.Provider>
  );
};
