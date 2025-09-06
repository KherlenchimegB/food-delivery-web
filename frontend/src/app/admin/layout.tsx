"use client";
import { LayoutDashboard, Truck, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { AdminProvider, useAdmin } from "@/context/adminContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { select, setSelect } = useAdmin();

  const handleSignOut = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("adminActiveTab");
    localStorage.removeItem("userRole");
    router.push("/user/sign-in");
  };

  return (
    <div className="flex h-screen bg-[#F4F4F5]">
      {/* Sidebar */}
      <div className="w-64 bg-white text-black flex-shrink-0 border-r border-gray-200 flex flex-col">
        <div className="p-6 flex-1">
          {/* Logo */}
          <div className="flex gap-3 items-center mb-8">
            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xl font-bold">N</span>
            </div>
            <div className="flex flex-col">
              <div>
                <span className="text-[20px] font-semibold text-black">NomNom</span>
              </div>
              <p className="text-xs text-gray-600">Swift delivery</p>
            </div>
          </div>
          
          {/* Navigation */}
          <div className="space-y-4">
            <button 
              onClick={() => setSelect(2)}
              className={`w-full flex items-center gap-4 p-3 rounded-full transition-colors ${
                select === 2 
                  ? "bg-black text-white" 
                  : "bg-transparent text-black hover:bg-gray-100"
              }`}
            >
              <LayoutDashboard size={24} strokeWidth={2} />
              <span className="text-lg">Food menu</span>
            </button>
            
            <button 
              onClick={() => setSelect(1)}
              className={`w-full flex items-center gap-4 p-3 rounded-full transition-colors ${
                select === 1 
                  ? "bg-black text-white" 
                  : "bg-transparent text-black hover:bg-gray-100"
              }`}
            >
              <Truck size={24} strokeWidth={2} />
              <span className="text-lg">Order</span>
            </button>
          </div>
        </div>
        
        {/* Sign-out button - доод буланд */}
        <div className="p-6">
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-4 py-2 rounded-full text-base bg-black text-white hover:bg-gray-800 transition-colors"
          >
            <LogOut size={20} />
            <span className="text-center">Sign out</span>
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white flex items-center justify-end px-6 border-b border-gray-200">
          <div className="w-10 h-10 bg-purple-400 rounded-full flex items-center justify-center">
            <span className="text-white text-lg font-semibold">U</span>
          </div>
        </header>
        
        {/* Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <AdminProvider>
        <AdminLayoutContent>{children}</AdminLayoutContent>
      </AdminProvider>
    </ProtectedRoute>
  );
}
