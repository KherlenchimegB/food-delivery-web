"use client";
import { useEffect, useState } from "react";
import { AddCategoryButton } from "./updateFood/addCategoryButton";

const baseurl = "http://localhost:8000/";

export const CategoryNames = () => {
  const [foodData, setFoodData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);

  useEffect(() => {
    fetchCategories();
    fetchFoods();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${baseurl}food-category`);
      const responseData = await response.json();
      setCategoryData(responseData.data);
    } catch (error) {
      console.log("Error fetching category:", error);
    }
  };

  const fetchFoods = async () => {
    try {
      const response = await fetch(`${baseurl}food`);
      const responseData = await response.json();
      setFoodData(responseData.data);
    } catch (error) {
      console.log("Error fetching food:", error);
    }
  };

  const count = (category: any) => {
    let countCategory = 0;
    foodData
      .filter((food) => food.category.categoryName === category.categoryName)
      .map((food) => countCategory++);
    console.log("countCategory", countCategory);
    return countCategory;
  };

  return (
    <div className="flex flex-col w-full p-4 bg-white">
      <h1 className="text-3xl">Dishes category</h1>
      <div className="flex gap-2">
        {categoryData.map((category) => (
          <div>
            <div
              className="flex border rounded-full text-xl p-2 gap-2 w-fit"
              key={category._id}
            >
              <span>{category.categoryName}</span>
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
