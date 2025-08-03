"use client";
import { useContext, useState } from "react";
import { LayoutDashboard, Truck, LogOut } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { FoodMenu } from "@/components/admin/foodMenu";
import { OrderDataTable } from "@/components/admin/adminTable/orderDataTable";
import { useRouter } from "next/navigation";
// import { cardContext } from "@/context/cardContext";

export default function Home() {
  // const { cart, setCart } = useContext(cardContext);
  const router = useRouter();

  const [select, setSelect] = useState(() => {
    // localStorage-ээс утга авах, байхгүй бол 1 (Order)
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("adminActiveTab");
      return saved ? parseInt(saved) : 1;
    }
    return 1;
  });

  const handleSelect = () => {
    const newSelect = select === 1 ? 2 : 1;
    setSelect(newSelect);
    // localStorage-д хадгалах
    if (typeof window !== "undefined") {
      localStorage.setItem("adminActiveTab", newSelect.toString());
    }
  };

  // Sign-out function
  const handleSignOut = () => {
    // Clear user data from localStorage
    localStorage.removeItem("userToken");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("adminActiveTab");

    // Redirect to sign-in page
    router.push("/user/sign-in");
  };

  console.log(
    "==================admin huudas render=================="
    // cart,
    // setCart
  );

  return (
    <div className="flex h-screen">
      <Sidebar className="w-64 flex-shrink-0">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="pt-3 h-fit">
              <div className="flex gap-2 items-center">
                <img src="./logos/home-logo.png" alt="logo" />
                <div className="flex-col">
                  <div>
                    <span className=" text-[20px] font-semibold ">NomNom</span>
                  </div>
                  <p className=" text-xs">Swift delivery</p>
                </div>
              </div>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="pt-3 gap-4">
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className={`rounded-full text-xl ${
                      select === 2 ? "bg-black text-white" : "bg-white"
                    }`}
                  >
                    {/* <a href={"/admin/menu"}> */}
                    <button onClick={handleSelect}>
                      <LayoutDashboard size={40} strokeWidth={2} />
                      Food menu
                    </button>
                    {/* </a> */}
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className={`rounded-full text-xl ${
                      select === 1 ? "bg-black text-white" : "bg-white"
                    }`}
                  >
                    <button onClick={handleSelect}>
                      <Truck size={40} strokeWidth={2} />
                      Order
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Sign-out button at bottom */}
          <div className="mt-auto p-4 pb-6 flex justify-center">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-base bg-black hover:bg-gray-800 text-white transition-colors"
            >
              <LogOut size={20} />
              <span className="text-center">Sign out</span>
            </button>
          </div>
        </SidebarContent>
      </Sidebar>
      <div className="flex-1 overflow-auto">
        {select === 1 && <OrderDataTable />}
        {select === 2 && <FoodMenu />}
      </div>
    </div>
  );
}
