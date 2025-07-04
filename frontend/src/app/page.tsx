// "use client";
// import { HomeFoodCard } from "@/components/home/homeFoodCard";
// import { NavigationMenu } from "@/components/home/navigation";
// import { Key, useEffect, useState } from "react";
// import Link from "next/link";
// import { CldUploadButton, CldImage } from "next-cloudinary";
// import { SetStateAction } from "react";

// const baseurl = "http://localhost:8000/";

// export default function Home() {
//   const [foodData, setFoodData] = useState({});
//   const [categoryData, setCategoryData] = useState({});
//   useEffect(() => {
//     fetchCategories(setCategoryData);
//     fetchFoods(setFoodData);
//   }, []);

//   const fetchCategories = async (setCategories: {
//     (value: SetStateAction<[]>): void;
//     (arg0: any): void;
//   }) => {
//     console.log("category ajillaa");
//     try {
//       const response = await fetch(`${baseurl}food-category`);
//       const responseData = await response.json();
//       setCategoryData(responseData.data);
//       console.log("foodData", categoryData);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const fetchFoods = async (setFoods: {
//     (value: SetStateAction<[]>): void;
//     (arg0: any): void;
//   }) => {
//     console.log("food ajillaa");
//     try {
//       const response = await fetch(`${baseurl}food`);
//       const responseData = await response.json();
//       setFoodData(responseData.data);
//       console.log("foodData", foodData);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return (
//     <div className="flex w-screen flex-col bg-[#404040]">
//       <NavigationMenu />
//       <div className="w-full">
//         <CldImage
//           src={
//             "https://res.cloudinary.com/ddtytj1hq/image/upload/v1751535356/asset_h798wo.png"
//           }
//           alt={"home picture"}
//           width={"2400"}
//           height={"940"}
//         />
//       </div>

//       <div className="flex flex-col gap-[54px] ">
//         {categoryData &&
//           categoryData.map((category: any, index: any) => {
//             return (
//               <div className="flex flex-col gap-[54px]" key={index}>
//                 <h2 className="font-semibold text-3xl text-[#FFFFFF]">
//                   {category.categoryName}
//                 </h2>
//                 <div className="grid grid-cols-3 gap-9">
//                   {foodData &&
//                     foodData
//                       .filter(
//                         (food: any) =>
//                           food.category.categoryName === category.categoryName
//                       )
//                       .map((food: any, index: any) => {
//                         return (
//                           <HomeFoodCard
//                             id={food.id}
//                             key={index}
//                             image={food.image}
//                             foodName={food.foodName}
//                             price={food.price}
//                             ingredients={food.ingredients}
//                           ></HomeFoodCard>
//                         );
//                       })}
//                 </div>
//               </div>
//             );
//           })}
//       </div>
//     </div>
//   );
// }

// {
//   /* <CldUploadButton
//         className="border border-amber-300"
//         uploadPreset="picture"
//         onSuccess={(results) => {
//           console.log("results", results);
//         }}
//       /> */
// }
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
      console.log("Error fetching categories:", error);
    }
  };

  const fetchFoods = async () => {
    try {
      const response = await fetch(`${baseurl}food`);
      const responseData = await response.json();
      setFoodData(responseData.data);
    } catch (error) {
      console.log("Error fetching foods:", error);
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
