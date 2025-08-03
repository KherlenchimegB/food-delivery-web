"use client";

import { createContext, useState } from "react";

// Cart item-ийн төрөл - id, quantity, ingredients, userId нэмнэ
type CartItem = {
  id: string;
  foodName: string;
  price: number;
  image: string;
  ingredients: string;
  quantity: number;
  userId: string;
};

// Context-ийн төрөл - бүх функцуудыг нэмнэ
type CartContextProps = {
  cartItems: CartItem[];
  addToCart: (cartItem: Omit<CartItem, "quantity">) => void;
  removeCartItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
};

// Context-ийн анхны утга
export const CartContext = createContext<CartContextProps>({
  cartItems: [],
  addToCart: () => {},
  removeCartItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  getTotalPrice: () => 0,
  getTotalItems: () => 0,
});

// Context Provider компонент
export const CartContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Cart-д item нэмэх функц
  const addToCart = (newItem: Omit<CartItem, "quantity">) => {
    setCartItems((prevItems) => {
      // Хэрэв item аль хэдийн cart-д байвал quantity-г нэмнэ
      const existingItem = prevItems.find((item) => item.id === newItem.id);

      if (existingItem) {
        return prevItems.map((item) =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      // Хэрэв item cart-д байхгүй бол шинээр нэмнэ
      return [...prevItems, { ...newItem, quantity: 1 }];
    });
  };

  // Cart-аас item хасах функц
  const removeCartItem = (itemId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  // Item-ийн quantity-г шинэчлэх функц
  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeCartItem(itemId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  // Cart-ыг цэвэрлэх функц
  const clearCart = () => {
    setCartItems([]);
  };

  // Нийт үнийг тооцоолох функц
  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  // Нийт item-ийн тоог тооцоолох функц
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeCartItem,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
