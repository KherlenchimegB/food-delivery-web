"use client";

import axios from "axios";
import { createContext, Dispatch, SetStateAction, useState } from "react";
import { useEffect } from "react";
import { baseUrl } from "@/lib/utils";

type FoodItem = {
  _id: string;
  foodName: string;
  price: number;
  image: string;
  ingredients: string;
  createdAt: number;
  categoryName: string;
  categoryId: string;
};
type foodUpdateContextProps = {
  foodInfo: FoodItem[];
  addDish: (foodInfo: FoodItem) => void;
  removeDish: (foodId: string) => void;
  updateDish: (foodId: string) => void;
};
export const FoodUpdateContext = createContext<foodUpdateContextProps>({
  foodInfo: [],
  addDish: () => {},
  removeDish: () => {},
  updateDish: () => {},
});

export const FoodUpdateContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [foodInfo, setFoodInfo] = useState<FoodItem[]>([]);

  const addDish = (foodItem: FoodItem) => {
    setFoodInfo([...foodInfo, foodItem]);
  };

  const removeDish = (foodId: string) => {};
  const updateDish = (foodId: string) => {};

  return (
    <FoodUpdateContext.Provider
      value={{ foodInfo, addDish, removeDish, updateDish }}
    >
      {children}
    </FoodUpdateContext.Provider>
  );
};
