"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AdminContextType {
  select: number;
  setSelect: (value: number) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [select, setSelect] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("adminActiveTab");
      return saved ? parseInt(saved) : 2;
    }
    return 2;
  });

  const handleSetSelect = (value: number) => {
    setSelect(value);
    if (typeof window !== "undefined") {
      localStorage.setItem("adminActiveTab", value.toString());
    }
  };

  return (
    <AdminContext.Provider value={{ select, setSelect: handleSetSelect }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};
