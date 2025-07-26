"use client";
import { HomeFoodCard } from "@/components/home/homeFoodCard";
import { useEffect, useState } from "react";
import { AddDishesButton } from "./addDishesButton";
import { baseUrl } from "@/lib/utils";

type TFoodOrderItem = {
  _id: string;
  user: string;
  foodOrderItems: [TFood];
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: string;
};

type TFood = {
  _id: string;
  name: string;
};

type TFoodOrderTable = Pick<TFoodOrderItem, "user" | "foodOrderItems">;

export const FoodMenu = () => {
  console.log("=============food meny -------------");

  const [foodData, setFoodData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);

  useEffect(() => {
    fetchCategories();
    fetchFoods();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${baseUrl}food-category`);
      const responseData = await response.json();
      setCategoryData(responseData.data);
    } catch (error) {
      console.log("Error fetching category:", error);
    }
  };

  const fetchFoods = async () => {
    try {
      const response = await fetch(`${baseUrl}food`);
      const responseData = await response.json();
      setFoodData(responseData.data);
    } catch (error) {
      console.log("Error fetching food:", error);
    }
  };

  return (
    <div className="flex w-screen flex-col bg-[#F4F4F5]">
      <div className="flex flex-col px-6 py-6 gap-4">
        {categoryData.map((category) => (
          <div
            className="flex flex-col bg-white border rounded-md"
            key={category._id}
          >
            <h2 className="font-semibold text-3xl p-6">
              {category.categoryName}
            </h2>
            <div className="grid grid-cols-3 ">
              <div className="w-auto h-auto gap-5 p-5 m-5 border-5 border-red-500 border-dashed rounded-md flex flex-col justify-center items-center">
                <AddDishesButton />
                <span className="text-2xl">Add new Dish to Appetizers</span>
              </div>
              {foodData
                .filter(
                  (food) => food.category.categoryName === category.categoryName
                )
                .map((food) => (
                  <HomeFoodCard
                    key={food._id}
                    id={food._id}
                    image={food.image}
                    foodName={food.foodName}
                    price={food.price}
                    ingredients={food.ingredients}
                    isHome={false}
                    categoryName={food.category.categoryName}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
