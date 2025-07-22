import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { LayoutDashboard, Truck } from "lucide-react";

export const AppSidebar = () => {
  return (
    <div>
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
                  <SidebarMenuButton asChild>
                    {/* <a href={"/admin/menu"}> */}
                    <button>
                      <LayoutDashboard size={40} strokeWidth={2} />
                      Food menu
                    </button>
                    {/* </a> */}
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <button>
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
    </div>
  );
};
