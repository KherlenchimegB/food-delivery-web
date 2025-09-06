"use client";

import { X } from "lucide-react";
import { Table } from "@tanstack/react-table";
import { Payment } from "./types";

interface BulkStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  onConfirm: () => void;
  table: Table<Payment>;
}

export const BulkStatusModal = ({
  isOpen,
  onClose,
  selectedStatus,
  setSelectedStatus,
  onConfirm,
  table,
}: BulkStatusModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-gray-200 rounded-lg p-6 w-96 max-w-md shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Change delivery state</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            You are about to change the status of{" "}
            {table.getFilteredSelectedRowModel().rows.length} selected
            orders.
          </p>

          <div className="flex gap-2">
            <button
              className={`flex-1 py-2 px-4 rounded-full border ${
                selectedStatus === "DELIVERED"
                  ? "bg-purple-100 text-purple-700 border-purple-300"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
              onClick={() => setSelectedStatus("DELIVERED")}
            >
              Delivered
            </button>
            <button
              className={`flex-1 py-2 px-4 rounded-full border ${
                selectedStatus === "PENDING"
                  ? "bg-purple-100 text-purple-700 border-purple-300"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
              onClick={() => setSelectedStatus("PENDING")}
            >
              Pending
            </button>
            <button
              className={`flex-1 py-2 px-4 rounded-full border ${
                selectedStatus === "CANCELED"
                  ? "bg-purple-100 text-purple-700 border-purple-300"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
              onClick={() => setSelectedStatus("CANCELED")}
            >
              Cancelled
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onConfirm}
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 w-full"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
