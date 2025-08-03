"use client";

import { HomeFoodCard } from "@/components/home/homeFoodCard";
import { useEffect, useState } from "react";
import { AddDishesButton } from "./addDishesButton";
import { AddCategoryButton } from "./updateFood/addCategoryButton";
import { baseUrl } from "@/lib/utils";
import axios from "axios";

export const FoodMenu = () => {
  console.log("=============food menu -------------");

  const [foodData, setFoodData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
    fetchFoods();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${baseUrl}food-category`);
      console.log("Fetched categories:", response.data);
      setCategoryData(response.data.data);
    } catch (error) {
      console.log("Error fetching category:", error);
    }
  };

  const fetchFoods = async () => {
    try {
      const response = await axios.get(`${baseUrl}food`);
      console.log("Fetched foods:", response.data);
      setFoodData(response.data.data);
    } catch (error) {
      console.log("Error fetching food:", error);
    }
  };

  // Category-гүй хоолнуудыг олж авах
  const foodsWithoutCategory = foodData.filter(
    (food) => !food?.category?.categoryName
  );

  // Сонгогдсон category-ийн хоолнуудыг олж авах
  const getFilteredFoods = () => {
    if (!selectedCategory) {
      return foodData; // "All dishes" сонгогдсон үед бүх хоолнууд
    }

    if (selectedCategory === "Other Foods") {
      return foodsWithoutCategory;
    }

    return foodData.filter(
      (food) => food?.category?.categoryName === selectedCategory
    );
  };

  const filteredFoods = getFilteredFoods();

  // Loading state
  if (categoryData.length === 0 && foodData.length === 0) {
    return (
      <div className="flex w-full flex-col bg-[#F4F4F5] items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-lg font-semibold mb-2">Loading...</div>
          <div className="text-sm text-gray-500">
            {categoryData.length === 0 && "Loading categories..."}
            {foodData.length === 0 && "Loading foods..."}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col bg-[#F4F4F5]">
      <div className="flex flex-col px-6 py-6 gap-4">
        {/* Category filter buttons */}
        <div className="flex gap-2 flex-wrap">
          {/* "All dishes" button */}
          <button
            onClick={() => setSelectedCategory(null)}
            className={`flex border rounded-full text-xl p-2 gap-2 whitespace-nowrap ${
              selectedCategory === null
                ? "border-red-500 bg-red-50"
                : "border-gray-300 bg-white"
            }`}
          >
            <span className="text-black">All dishes</span>
            <div className="flex bg-black border rounded-full w-[30px] h-[30px] text-white items-center justify-center">
              {foodData.length}
            </div>
          </button>

          {/* Category buttons */}
          {categoryData.map((category) => (
            <button
              key={category._id}
              onClick={() => setSelectedCategory(category.categoryName)}
              className={`flex border rounded-full text-xl p-2 gap-2 whitespace-nowrap ${
                selectedCategory === category.categoryName
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300 bg-white"
              }`}
            >
              <span className="text-black">{category?.categoryName}</span>
              <div className="flex bg-black border rounded-full w-[30px] h-[30px] text-white items-center justify-center">
                {
                  foodData.filter(
                    (food) =>
                      food?.category?.categoryName === category?.categoryName
                  ).length
                }
              </div>
            </button>
          ))}

          {/* "Other Foods" button */}
          {foodsWithoutCategory.length > 0 && (
            <button
              onClick={() => setSelectedCategory("Other Foods")}
              className={`flex border rounded-full text-xl p-2 gap-2 whitespace-nowrap ${
                selectedCategory === "Other Foods"
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300 bg-white"
              }`}
            >
              <span className="text-black">Other Foods</span>
              <div className="flex bg-black border rounded-full w-[30px] h-[30px] text-white items-center justify-center">
                {foodsWithoutCategory.length}
              </div>
            </button>
          )}

          {/* Add Category Button */}
          <AddCategoryButton />
        </div>

        {/* Filtered foods display */}
        <div className="flex flex-col bg-white border rounded-md">
          <h2 className="font-semibold text-3xl p-6">
            {selectedCategory === null
              ? "All Dishes"
              : selectedCategory === "Other Foods"
              ? "Other Foods"
              : selectedCategory}{" "}
            ({filteredFoods.length})
          </h2>

          {selectedCategory === null ? (
            // "All dishes" сонгогдсон үед category-т ангилагдаад харуулах
            <div className="space-y-6">
              {/* Category-т ангилагдсан хоолнууд */}
              {categoryData.map((category) => {
                const categoryFoods = foodData.filter(
                  (food) =>
                    food?.category?.categoryName === category.categoryName
                );

                if (categoryFoods.length === 0) return null;

                return (
                  <div
                    key={category._id}
                    className="p-6 border-b border-gray-200"
                  >
                    <h3 className="text-xl font-semibold mb-4 text-gray-700">
                      {category.categoryName} ({categoryFoods.length})
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      {categoryFoods.map((food) => (
                        <HomeFoodCard
                          key={food._id}
                          id={food._id}
                          image={food.image}
                          foodName={food.foodName}
                          price={food.price}
                          ingredients={food.ingredients}
                          isHome={false}
                          categoryName={food?.category?.categoryName}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Category-гүй хоолнууд */}
              {foodsWithoutCategory.length > 0 && (
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-4 text-gray-700">
                    Other Foods ({foodsWithoutCategory.length})
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    {foodsWithoutCategory.map((food) => (
                      <HomeFoodCard
                        key={food._id}
                        id={food._id}
                        image={food.image}
                        foodName={food.foodName}
                        price={food.price}
                        ingredients={food.ingredients}
                        isHome={false}
                        categoryName="Other Foods"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Add dish button */}
              <div className="p-6">
                <div className="w-auto h-auto gap-5 p-5 m-5 border-5 border-red-500 border-dashed rounded-md flex flex-col justify-center items-center">
                  <AddDishesButton />
                  <span className="text-2xl">Add new Dish to any category</span>
                </div>
              </div>
            </div>
          ) : (
            // Тодорхой category сонгогдсон үед
            <div className="grid grid-cols-3">
              <div className="w-auto h-auto gap-5 p-5 m-5 border-5 border-red-500 border-dashed rounded-md flex flex-col justify-center items-center">
                <AddDishesButton
                  categoryProp={
                    selectedCategory === "Other Foods"
                      ? "Other Foods"
                      : selectedCategory
                  }
                />
                <span className="text-2xl">
                  Add new Dish to{" "}
                  {selectedCategory === "Other Foods"
                    ? "Other Foods"
                    : selectedCategory}
                </span>
              </div>
              {filteredFoods.map((food) => (
                <HomeFoodCard
                  key={food._id}
                  id={food._id}
                  image={food.image}
                  foodName={food.foodName}
                  price={food.price}
                  ingredients={food.ingredients}
                  isHome={false}
                  categoryName={food?.category?.categoryName ?? "Other Foods"}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
