"use client";

import axios from "axios";
import { createContext, Dispatch, SetStateAction, useState } from "react";
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

export const UserContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [userInfo, setUserInfo] = useState<User>({ email: "" });

  const getCurrentUser = async () => {
    const userToken = localStorage.getItem("token");
    const userEmail = localStorage.getItem("email");

    // Token байхгүй бол user info-г хоосон болгох
    if (!userToken) {
      setUserInfo({ email: "" });
      return;
    }

    try {
      const response = await axios.get(`${baseUrl}user/currentUser`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      setUserInfo(response.data);
      console.log("userInfo response.data", response.data);
    } catch (error) {
      console.error(error);
      // API error үед ч user info-г хоосон болгох
      setUserInfo({ email: "" });
      // Token-г хасах
      localStorage.removeItem("token");
      localStorage.removeItem("email");
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
