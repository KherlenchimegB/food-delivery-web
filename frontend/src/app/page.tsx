"use client";
import { Appetizers } from "@/components/appetizers";
import { Navigation } from "@/components/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { CldUploadButton, CldImage } from "next-cloudinary";

const baseurl = "http://localhost:8000/";

export default function Home() {
  const [foodData, setFoodData] = useState({});
  const SWR = () => {
    const [foodData, setFoodData] = useState({});
    console.log("ajillalaa");
    // const getFood = async (request: Request, response: Response) => {
    //   try {
    //     const response = await fetch(`${baseurl}food`);
    //     const responseData = await response.json();
    //     console.log("responseData", responseData);
    //   } catch (error) {
    //     console.log("error", error);
    //   }
    // };

    useEffect(() => {
      fetch(`${baseurl}food`)
        .then((response) => response.json())
        .then((data) => {
          setFoodData(data);
        });
    }, []);
    console.log("foodData", foodData);
  };

  // useEffect(() => {
  //   console.log("ajillalaa");
  //   try {
  //     const response = fetch(`${baseurl}food`, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });
  //     const responseData = response.json();
  //     console.log("responseData", responseData);
  //   } catch (error) {
  //     console.log("error", error);
  //   }
  // });

  return (
    <div className="flex w-screen flex-col bg-[#404040]">
      <Navigation />
      <div className="w-full">
        <CldImage
          src={
            "https://res.cloudinary.com/ddtytj1hq/image/upload/v1751535356/asset_h798wo.png"
          }
          alt={"home picture"}
          width={"2400"}
          height={"940"}
        />
        {/* <img src="./asset.png" alt="asset" className="w-full " /> */}
      </div>

      <CldUploadButton
        className="border border-amber-300"
        uploadPreset="picture"
        onSuccess={(results) => {
          console.log("results", results);
        }}
      />

      <div className="grid grid-cols-5">
        <Appetizers
          id={"6853b61cd45e1c5eeb7c49a7"}
          foodName={"Food name"}
          price={"25000"}
          ingredients={
            "Fluffy pancakes stacked with fruits, cream, syrup, and powdered sugar."
          }
        />
      </div>
    </div>
  );
}
