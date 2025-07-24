"use client";
import { createContext, useState } from "react";

const UserContext = createContext(null);
export const UserContextProvider = ({ children }: any) => {
  const [userInfo, setUserInfo] = useState("");
  return (
    <UserContext value={{ userInfo, setUserInfo }}>{children}</UserContext>
  );
};
