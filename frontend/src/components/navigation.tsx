"use client";
import { ChevronRight, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

export const Navigation = () => {
  const router = useRouter();
  return (
    <div className="w-full h-[68px] bg-black flex justify-between pl-[88px] pr-[88px] p-[10px]">
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
