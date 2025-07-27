"use client";
import { ChevronRight, LogOut, MapPin, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { AddToCart } from "./addToCard";
import { useContext, useState } from "react";
import { UserContext } from "@/context/userContext";
import { Button } from "../ui/button";
import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { id } from "date-fns/locale";

export const NavigationMenu = () => {
  const router = useRouter();
  // const handleAddToCart = () => {

  // };
  const { userInfo } = useContext(UserContext);
  const [openCart, setOpenCart] = useState(false);
  const signOut = () => {
    localStorage.removeItem("email");
  };
  return (
    <div className="w-full h-[68px] fixed top-0 z-50 bg-black flex justify-between pl-[88px] pr-[88px] p-[10px]">
      <div className="flex gap-2 items-center">
        <img src="../logos/home-logo.png" alt="logo" />
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
        {userInfo.email === "" && (
          <div>
            {" "}
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
            </button>{" "}
          </div>
        )}
        {userInfo.email !== "" && (
          <div>
            <AddressBar />

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
              userId={"userInfo"}
            />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-red-500 text-white border-red-500 hover:bg-red-600 rounded-full"
                >
                  <User className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 bg-white border border-gray-200 shadow-lg"
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Account:</p>
                    <p className="text-xs leading-none text-gray-500">
                      {userInfo.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                  onClick={signOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
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
