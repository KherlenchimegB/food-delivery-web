"use client";

import { useEffect, useState } from "react";
import { AddCategoryButton } from "./updateFood/addCategoryButton";
import { baseUrl } from "@/lib/utils";
import axios from "axios";

export const CategoryNames = () => {
  const [foodData, setFoodData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);

  useEffect(() => {
    fetchCategories();
    fetchFoods();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${baseUrl}food-category`);
      console.log("Fetched categories:", response.data);
      setCategoryData(response.data.data);
    } catch (error: any) {
      console.error(
        "Error fetching category:",
        error.response?.data || error.message
      );
    }
  };

  const fetchFoods = async () => {
    try {
      const response = await axios.get(`${baseUrl}food`);
      console.log("Fetched foods:", response.data);
      setFoodData(response.data.data);
    } catch (error: any) {
      console.error(
        "Error fetching food:",
        error.response?.data || error.message
      );
    }
  };

  const count = (category: any) => {
    return foodData.filter(
      (food) => food.category?.categoryName === category?.categoryName
    ).length;
  };

  if (!categoryData.length && !foodData.length) {
    return <div className="p-4">Loading... category data ...</div>;
  }
  return (
    <div className="flex flex-col w-full p-4 bg-white">
      <h1 className="text-3xl">Dishes category</h1>
      <div className="flex gap-2">
        {categoryData.map((category) => (
          <div key={category._id}>
            <div className="flex border rounded-full text-xl p-2 gap-2 w-fit">
              <span>{category?.categoryName}</span>
              <div className="flex bg-black border rounded-full w-[30px] h-[30px] text-white items-center justify-center">
                {count(category)}
              </div>
            </div>
          </div>
        ))}
        <AddCategoryButton />
      </div>
    </div>
  );
};
