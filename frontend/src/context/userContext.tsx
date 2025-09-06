"use client";

import axios from "axios";
import { createContext, Dispatch, SetStateAction, useState, useContext } from "react";
import { useEffect } from "react";
import { baseUrl } from "@/lib/utils";

type User = {
  email: string;
  role?: string;
};

type UserContextProps = {
  userInfo: User;
  setUserInfo: Dispatch<SetStateAction<User>>;
};

export const UserContext = createContext<UserContextProps>({
  userInfo: { email: "" },
  setUserInfo: () => {},
});

// Hook for using UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserContextProvider");
  }
  return context;
};

export const UserContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [userInfo, setUserInfo] = useState<User>({ email: "" });

  const getCurrentUser = async () => {
    const userToken = localStorage.getItem("token");
    const userEmail = localStorage.getItem("email");
    const userRole = localStorage.getItem("userRole");

    // Token байхгүй бол user info-г хоосон болгох
    if (!userToken) {
      setUserInfo({ email: "" });
      return;
    }

    try {
      const response = await axios.get(`${baseUrl}user/currentUser`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      
      // Response-оос role-ийг авах, хэрэв байхгүй бол localStorage-аас авах
      const userData = {
        email: response.data.email || userEmail || "",
        role: response.data.role || userRole || "USER"
      };
      
      setUserInfo(userData);
      
      // localStorage-д role-ийг хадгалах
      if (response.data.role) {
        localStorage.setItem("userRole", response.data.role);
      }
    } catch (error) {
      // API error үед ч user info-г хоосон болгох
      setUserInfo({ email: "" });
      // Token-г хасах
      localStorage.removeItem("token");
      localStorage.removeItem("email");
      localStorage.removeItem("userRole");
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </UserContext.Provider>
  );
};
