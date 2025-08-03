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

export const NavigationMenu = () => {
  const router = useRouter();
  const { userInfo, setUserInfo } = useContext(UserContext);
  const [openCart, setOpenCart] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState(""); // Added

  const signOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    setUserInfo({ email: "" });
    router.push("/");
  };

  return (
    <div className="w-full h-[68px] fixed top-0 z-50 bg-black flex justify-between px-[88px] py-[10px]">
      {/* Зүүн тал - Logo */}
      <div className="flex gap-2 items-center">
        <img src="/logos/home-logo.png" alt="logo" className="w-8 h-8" />
        <div className="flex flex-col">
          <div>
            <span className="text-white text-[20px] font-semibold">Nom</span>
            <span className="text-[#EF4444] text-[20px] font-semibold">
              Nom
            </span>
          </div>
          <p className="text-white text-xs">Swift delivery</p>
        </div>
      </div>

      {/* Баруун тал - User controls */}
      <div className="flex gap-3 items-center text-[14px]">
        {userInfo.email === "" && (
          <div className="flex gap-2">
            <button
              className="w-fit px-4 py-2 bg-white border rounded-full cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => router.push("/user/sign-up")}
            >
              Sign up
            </button>
            <button
              className="w-fit px-4 py-2 bg-[#EF4444] border border-none text-white rounded-full cursor-pointer hover:bg-red-600 transition-colors"
              onClick={() => router.push("/user/sign-in")}
            >
              Log in
            </button>
          </div>
        )}

        {userInfo.email !== "" && (
          <div className="flex gap-3 items-center">
            <AddressBar
              deliveryAddress={deliveryAddress}
              setDeliveryAddress={setDeliveryAddress}
            />

            <AddToCart
              openCart={openCart}
              setOpenCart={setOpenCart}
              deliveryAddress={deliveryAddress}
              setDeliveryAddress={setDeliveryAddress}
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
                className="w-56 bg-white border border-gray-200 shadow-lg rounded-lg"
              >
                <DropdownMenuLabel className="font-normal p-4">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-gray-900">
                      {userInfo.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-gray-900 focus:text-gray-900 focus:bg-gray-50 cursor-pointer p-4"
                  onClick={signOut}
                >
                  <span className="text-sm">Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </div>
  );
};

export const AddressBar = ({
  deliveryAddress,
  setDeliveryAddress,
}: {
  deliveryAddress: string;
  setDeliveryAddress: (address: string) => void;
}) => {
  return (
    <div className="w-fit px-4 py-2 gap-3 flex bg-white border border-none rounded-full items-center shadow-sm">
      <MapPin color="#EF4444" absoluteStrokeWidth className="w-4 h-4" />
      <span className="text-[#EF4444] text-sm font-medium">
        Delivery address:
      </span>
      <input
        type="search"
        className="border border-none outline-none text-sm placeholder-gray-400 flex-1 min-w-[120px]"
        placeholder="Add Location"
        value={deliveryAddress}
        onChange={(e) => setDeliveryAddress(e.target.value)}
      />
      <ChevronRight color="#18181B" absoluteStrokeWidth className="w-4 h-4" />
    </div>
  );
};
