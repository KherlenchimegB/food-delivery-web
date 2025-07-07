"use client";
import { HomeFoodCard } from "@/components/home/homeFoodCard";
import { NavigationMenu } from "@/components/home/navigation";
import { useEffect, useState } from "react";
import { CldUploadButton, CldImage } from "next-cloudinary";

const baseurl = "http://localhost:8000/";

export default function Home() {
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

  return (
    <div className="flex w-screen flex-col bg-[#404040]">
      <NavigationMenu />

      <div className="w-full">
        <CldImage
          src="https://res.cloudinary.com/ddtytj1hq/image/upload/v1751535356/asset_h798wo.png"
          alt="home picture"
          width="2400"
          height="940"
        />
      </div>

      <div className="flex flex-col gap-[54px] px-10 py-16">
        {categoryData.map((category) => (
          <div className="flex flex-col gap-[54px]" key={category.id}>
            <h2 className="font-semibold text-3xl text-[#FFFFFF]">
              {category.categoryName}
            </h2>
            <div className="grid grid-cols-3 gap-9">
              {foodData
                .filter(
                  (food) => food.category.categoryName === category.categoryName
                )
                .map((food) => (
                  <HomeFoodCard
                    key={food.id}
                    id={food.id}
                    image={food.image}
                    foodName={food.foodName}
                    price={food.price}
                    ingredients={food.ingredients}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// {
//   /* <CldUploadButton
//         className="border border-amber-300"
//         uploadPreset="picture"
//         onSuccess={(results) => {
//           console.log("results", results);
//         }}
//       /> */
// }
