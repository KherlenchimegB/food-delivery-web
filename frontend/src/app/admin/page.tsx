"use client";
import { DataTable } from "@/components/admin/adminTable/dataTable";
import { useState } from "react";
import { LayoutDashboard, Truck } from "lucide-react";
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
import { CategoryNames } from "@/components/admin/categoryNames";
import { OrderDataTable } from "@/components/admin/adminTable/orderDataTable";

export default function Home() {
  const [select, setSelect] = useState(1);
  const handleSelect = () => {
    if (select === 1) setSelect(2);
    else setSelect(1);
  };
  return (
    <div className="w-screen">
      <Sidebar>
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
        </SidebarContent>
      </Sidebar>
      {select === 1 && <OrderDataTable />}
      {select === 2 && <CategoryNames />}
      {select === 2 && <FoodMenu />}
    </div>
  );
}
