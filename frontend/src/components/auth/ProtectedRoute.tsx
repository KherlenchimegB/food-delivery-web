"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/userContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "ADMIN" | "USER";
}

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const router = useRouter();
  const { userInfo } = useUser();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const userRole = localStorage.getItem("userRole");

      console.log("=== PROTECTED ROUTE DEBUG ===");
      console.log("Token:", token ? "Present" : "Missing");
      console.log("User role from localStorage:", userRole);
      console.log("User info from context:", userInfo);
      console.log("Required role:", requiredRole);

      // Token байхгүй бол sign-in хуудас руу шилжүүлэх
      if (!token) {
        console.log("No token found, redirecting to sign-in");
        router.push("/user/sign-in");
        return;
      }

      // Role шаардлагатай бол шалгах
      if (requiredRole) {
        const currentRole = userInfo.role || userRole;
        console.log("Current role:", currentRole);
        console.log("Required role:", requiredRole);
        
        if (currentRole !== requiredRole) {
          console.log("Insufficient permissions, redirecting to sign-in");
          router.push("/user/sign-in");
          return;
        }
      }

      console.log("Authentication successful");
      setIsLoading(false);
    };

    // User info context-ээс ирэх хүртэл хүлээх
    if (userInfo.email !== undefined) {
      checkAuth();
    }
  }, [userInfo, router, requiredRole]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return <>{children}</>;
};
