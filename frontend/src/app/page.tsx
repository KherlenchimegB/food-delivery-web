"use client";
import { HomeFoodCard } from "@/components/home/homeFoodCard";
import { NavigationMenu } from "@/components/home/navigation";
import { useEffect, useState } from "react";
import { CldImage } from "next-cloudinary";
import { Footer } from "@/components/home/footer";
import axios from "axios";
import { baseUrl } from "@/lib/utils";

export default function Home() {
  const [foodData, setFoodData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);

  useEffect(() => {
    fetchCategories();
    fetchFoods();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${baseUrl}food-category`);
      setCategoryData(response.data.data);
    } catch (error) {
    }
  };

  const fetchFoods = async () => {
    try {
      const response = await axios.get(`${baseUrl}food`);
      setFoodData(response.data.data);
    } catch (error) {
    }
  };

  // Category-гүй хоолнуудыг олох
  const foodsWithoutCategory = foodData.filter(
    (food) => !food.category || !food.category.categoryName
  );

  return (
    <div className="flex w-screen flex-col bg-[#404040] min-h-screen">
      <NavigationMenu />

      <div className="w-full">
        <CldImage
          src="https://res.cloudinary.com/ddtytj1hq/image/upload/v1751535356/asset_h798wo.png"
          alt="home picture"
          width="2400"
          height="940"
          className="w-full h-auto"
        />
      </div>

      <div className="flex flex-col gap-[54px] px-10 py-16">
        {categoryData.length === 0 ? (
          <div className="text-white px-10">Loading categories...</div>
        ) : (
          <>
            {/* Category-тай хоолнууд */}
            {categoryData.map((category) => (
              <div className="flex flex-col gap-4" key={category._id}>
                <p className="font-semibold text-3xl text-[#FFFFFF] p-4">
                  {category.categoryName}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {foodData
                    .filter(
                      (food) =>
                        food.category?.categoryName === category?.categoryName
                    )
                    .map((food) => (
                      <HomeFoodCard
                        key={food._id}
                        id={food._id}
                        image={food.image}
                        foodName={food.foodName}
                        price={food.price}
                        ingredients={food.ingredients}
                        isHome={true}
                        categoryName={food.category.categoryName}
                      />
                    ))}
                </div>
              </div>
            ))}

            {/* Category-гүй хоолнууд */}
            {foodsWithoutCategory.length > 0 && (
              <div className="flex flex-col gap-4">
                <p className="font-semibold text-3xl text-[#FFFFFF] p-4">
                  Other Foods
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {foodsWithoutCategory.map((food) => (
                    <HomeFoodCard
                      key={food._id}
                      id={food._id}
                      image={food.image}
                      foodName={food.foodName}
                      price={food.price}
                      ingredients={food.ingredients}
                      isHome={true}
                      categoryName="Other Foods"
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
