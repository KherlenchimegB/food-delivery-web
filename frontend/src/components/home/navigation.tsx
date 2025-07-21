"use client";
import { ChevronRight, MapPin, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { AddToCart } from "./addToCard";

export const NavigationMenu = () => {
  const router = useRouter();
  // const handleAddToCart = () => {

  // };
  return (
    <div className="w-full h-[68px] fixed top-0 z-50 bg-black flex justify-between pl-[88px] pr-[88px] p-[10px]">
      <div className="flex gap-2 items-center">
        <img src="./logos/home-logo.png" alt="logo" />
        <div className="flex-col">
          <div>
            <span className="text-white text-[20px] font-semibold ">Nom</span>
            <span className="text-[#EF4444] text-[20px] font-semibold">
              Nom
            </span>
          </div>
          <p className="text-white text-xs">Swift delivery</p>
        </div>
      </div>

      <div className="flex gap-3 items-center text-[14px]">
        <AddressBar />
        <button
          className="w-fit p-2 bg-white border rounded-full cursor-pointer"
          onClick={() => router.push("/user/sign-up")}
        >
          Sign up
        </button>
        <button
          className="w-fit p-2 bg-[#EF4444] border border-none text-white rounded-full cursor-pointer"
          onClick={() => router.push("/user/sign-in")}
        >
          Log in
        </button>

        {/* data map */}

        <AddToCart
          id={""}
          image={
            "https://res.cloudinary.com/ddtytj1hq/image/upload/v1751622657/salad2_jfcs9t.png"
          }
          foodName={"Sunshine Stackers"}
          price={25000}
          ingredients={
            "Fluffy pancakes stacked with fruits, cream, syrup, and powdered sugar."
          }
          userId={""}
        />

        <button className="w-fit p-2 bg-[#EF4444] border border-none text-white rounded-full cursor-pointer">
          <User />
        </button>
      </div>
    </div>
  );
};

export const AddressBar = () => {
  return (
    <div className="w-fit p-2 gap-3 flex  bg-white border border-none rounded-full items-center">
      <MapPin color="#EF4444" absoluteStrokeWidth />
      <span className="text-[#EF4444]">Delivery address:</span>
      <input
        type="search"
        className=" border border-none "
        placeholder="Add Location"
      />
      <ChevronRight color="#18181B" absoluteStrokeWidth />
    </div>
  );
};
