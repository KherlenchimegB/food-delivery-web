"use client";

import { HomeFoodCard } from "@/components/home/homeFoodCard";
import { useEffect, useState } from "react";
import { AddDishesButton } from "./addDishesButton";
import { AddCategoryButton } from "./updateFood/addCategoryButton";
import { baseUrl } from "@/lib/utils";
import axios from "axios";
import { Toaster } from "sonner";
import { Plus } from "lucide-react";

export const FoodMenu = () => {
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
      setCategoryData(response.data.data);
    } catch (error) {
      console.log("Error fetching category:", error);
    }
  };

  const fetchFoods = async () => {
    try {
      const response = await axios.get(`${baseUrl}food`);
      setFoodData(response.data.data);
    } catch (error) {
      console.log("Error fetching food:", error);
    }
  };

  // Category-гүй хоолнуудыг олж авах
  const foodsWithoutCategory = foodData.filter(
    (food) => !food?.category?.categoryName
  );

  // Хоосон категориудыг олох (хоол байхгүй категориуд)
  const emptyCategories = categoryData.filter((category) => {
    const categoryFoods = foodData.filter(
      (food) => food?.category?.categoryName === category.categoryName
    );
    return categoryFoods.length === 0;
  });

  // Хоолтой категориудыг олох
  const categoriesWithFoods = categoryData.filter((category) => {
    const categoryFoods = foodData.filter(
      (food) => food?.category?.categoryName === category.categoryName
    );
    return categoryFoods.length > 0;
  });

  // Сонгогдсон category-ийн хоолнуудыг олж авах
  const getFilteredFoods = () => {
    if (!selectedCategory) {
      return foodData;
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
    <div className="flex w-full flex-col bg-[#F4F4F5] min-h-full">
      <div className="flex flex-col px-8 py-8 gap-6">
        {/* Category filter buttons */}
        <div className="flex gap-3 flex-wrap items-center">
          {/* "All dishes" button */}
          <button
            onClick={() => setSelectedCategory(null)}
            className={`flex items-center gap-3 px-4 h-8 rounded-full text-sm font-medium transition-all ${
              selectedCategory === null
                ? "bg-white border-2 border-red-500 text-black"
                : "bg-white border-2 border-gray-300 text-black hover:border-gray-400"
            }`}
          >
            <span>All dishes</span>
            <div className="flex bg-black text-white rounded-full w-6 h-6 items-center justify-center text-xs font-semibold">
              {foodData.length}
            </div>
          </button>

          {/* Category buttons */}
          {categoryData.map((category) => (
            <button
              key={category._id}
              onClick={() => setSelectedCategory(category.categoryName)}
              className={`flex items-center gap-3 px-4 h-8 rounded-full text-sm font-medium transition-all ${
                selectedCategory === category.categoryName
                  ? "bg-white border-2 border-red-500 text-black"
                  : "bg-white border-2 border-gray-300 text-black hover:border-gray-400"
              }`}
            >
              <span>{category?.categoryName}</span>
              <div className="flex bg-black text-white rounded-full w-6 h-6 items-center justify-center text-xs font-semibold">
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
              className={`flex items-center gap-3 px-4 h-8 rounded-full text-sm font-medium transition-all ${
                selectedCategory === "Other Foods"
                  ? "bg-white border-2 border-red-500 text-black"
                  : "bg-white border-2 border-gray-300 text-black hover:border-gray-400"
              }`}
            >
              <span>Other Foods</span>
              <div className="flex bg-black text-white rounded-full w-6 h-6 items-center justify-center text-xs font-semibold">
                {foodsWithoutCategory.length}
              </div>
            </button>
          )}

          {/* Add Category Button */}
          <AddCategoryButton onCategoryAdded={fetchCategories} />
        </div>

        {/* Filtered foods display */}
        <div className="flex flex-col bg-white rounded-lg shadow-sm">
          <h2 className={`font-semibold text-3xl ${
            selectedCategory === null 
              ? "px-8 pt-4 pb-6" 
              : "p-8 pb-6"
          }`}>
            {selectedCategory === null
              ? ""
              : selectedCategory === "Other Foods"
              ? "Other Foods"
              : selectedCategory}{" "}
            {selectedCategory !== null && `(${filteredFoods.length})`}
          </h2>

          {selectedCategory === null ? (
            // "All dishes" сонгогдсон үед category-т ангилагдаад харуулах
            <div className="space-y-8">
              {/* Хоолтой категориуд */}
              {categoriesWithFoods.map((category) => {
                const categoryFoods = foodData.filter(
                  (food) =>
                    food?.category?.categoryName === category.categoryName
                );

                return (
                  <div
                    key={category._id}
                    className="px-8 pb-8 border-b border-gray-200 last:border-b-0"
                  >
                    <h3 className="text-2xl font-semibold mb-6 text-gray-700">
                      {category.categoryName} ({categoryFoods.length})
                    </h3>
                    <div className="grid grid-cols-3 gap-6">
                      {/* Category тус бүрт шинэ хоол нэмэх button */}
                      <AddDishesButton categoryProp={category.categoryName}>
                        <div className="w-full h-full border-2 border-red-500 border-dashed rounded-lg flex flex-col justify-center items-center cursor-pointer hover:bg-red-50 transition-colors">
                          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-4">
                            <Plus size={24} className="text-white" />
                          </div>

                          <p className="text-lg text-gray-600 text-center px-4">
                            Add new Dish to  
                          </p>
                          <p className="text-lg text-gray-600 text-center px-4">
                              {category.categoryName}
                          </p>
                        </div>
                      </AddDishesButton>
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
                <div className="px-8 pb-8">
                  <h3 className="text-2xl font-semibold mb-6 text-gray-700">
                    Other Foods ({foodsWithoutCategory.length})
                  </h3>
                  <div className="grid grid-cols-3 gap-6">
                    {/* Other Foods-д шинэ хоол нэмэх button */}
                    <div className="w-full h-64 border-2 border-red-500 border-dashed rounded-lg flex flex-col justify-center items-center bg-red-50">
                      <AddDishesButton categoryProp="Other Foods" />
                      <span className="text-lg text-gray-600 mt-3 text-center px-4">
                        Add new Dish to Other Foods
                      </span>
                    </div>
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

              {/* Хоосон категориуд */}
              {emptyCategories.length > 0 && (
                <div className="px-8 pb-8">
                  <h3 className="text-2xl font-semibold mb-6 text-gray-700">
                    Empty Categories ({emptyCategories.length})
                  </h3>
                  <div className="grid grid-cols-3 gap-6">
                    {emptyCategories.map((category) => (
                      <AddDishesButton key={category._id} categoryProp={category.categoryName}>
                        <div className="w-full h-64 border-2 border-red-500 border-dashed rounded-lg flex flex-col justify-center items-center cursor-pointer hover:bg-red-50 transition-colors bg-red-50">
                          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-4">
                            <Plus size={24} className="text-white" />
                          </div>
                          <p className="text-lg text-gray-600 text-center px-4">
                            Add new Dish to
                          </p>
                          <p className="text-lg text-gray-600 text-center px-4">
                            {category.categoryName}
                          </p>
                        </div>
                      </AddDishesButton>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Тодорхой category сонгогдсон үед
            <div className="px-8 pb-8">
              <div className="grid grid-cols-3 gap-6">
                <div className="w-full h-64 border-2 border-red-500 border-dashed rounded-lg flex flex-col justify-center items-center bg-red-50">
                  <AddDishesButton
                    categoryProp={
                      selectedCategory === "Other Foods"
                        ? "Other Foods"
                        : selectedCategory
                    }
                  />
                  <span className="text-lg text-gray-600 mt-3 text-center px-4">
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
