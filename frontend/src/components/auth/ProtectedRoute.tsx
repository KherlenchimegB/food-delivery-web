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

      // Token байхгүй бол sign-in хуудас руу шилжүүлэх
      if (!token) {
        router.push("/user/sign-in");
        return;
      }

      // Role шаардлагатай бол шалгах
      if (requiredRole) {
        const currentRole = userInfo.role || userRole;
        
        if (currentRole !== requiredRole) {
          router.push("/user/sign-in");
          return;
        }
      }

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
