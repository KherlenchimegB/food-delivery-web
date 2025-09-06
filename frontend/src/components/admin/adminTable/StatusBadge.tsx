"use client";

import { useState, useEffect, useRef } from "react";
import { Check, X, ChevronDown } from "lucide-react";

interface StatusBadgeProps {
  status: string;
  onStatusChange?: (newStatus: string) => void;
}

export const StatusBadge = ({ status, onStatusChange }: StatusBadgeProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Click outside event
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-red-100 text-red-800 border-red-200";
      case "DELIVERED":
        return "bg-green-100 text-green-800 border-green-200";
      case "CANCELED":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return <Check size={16} />;
      case "CANCELED":
        return <X size={16} />;
      default:
        return null;
    }
  };

  const handleStatusChange = (newStatus: string) => {
    onStatusChange?.(newStatus);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className={`flex items-center gap-2 px-3 py-1 rounded-full border cursor-pointer ${getStatusStyle(
          status
        )}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-sm font-medium">{status}</span>
        {getStatusIcon(status)}
        <ChevronDown size={16} className="text-gray-500" />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border rounded-md shadow-lg z-10 min-w-[120px]">
          <div className="flex flex-col py-1">
            <button
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
              onClick={() => handleStatusChange("PENDING")}
            >
              PENDING
            </button>
            <button
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
              onClick={() => handleStatusChange("DELIVERED")}
            >
              DELIVERED
            </button>
            <button
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
              onClick={() => handleStatusChange("CANCELED")}
            >
              CANCELED
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
