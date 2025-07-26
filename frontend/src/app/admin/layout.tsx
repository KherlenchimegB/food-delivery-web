import { AppSidebar } from "@/components/admin/sideBar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
// import { CartContextProvider } from "@/context/cardContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    // <CartContextProvider>
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
    // </CartContextProvider>
  );
}
