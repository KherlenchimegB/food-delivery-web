"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { StatusBadge } from "./StatusBadge";
import { Payment } from "./types";

interface TableColumnsProps {
  handleStatusChange: (orderId: string, newStatus: string) => void;
}

export const createTableColumns = ({ handleStatusChange }: TableColumnsProps): ColumnDef<Payment>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: () => <div className="w-16">Nº</div>,
    cell: ({ row, table }) => {
      const rowIndex = table
        .getRowModel()
        .rows.findIndex((r) => r.id === row.id);
      return <div className="font-medium w-16">{rowIndex + 1}</div>;
    },
  },
  {
    accessorKey: "email",
    header: () => <div>Customer</div>,
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("email")}</div>
    ),
  },
  {
    accessorKey: "food",
    header: () => <div>Food</div>,
    cell: ({ row }) => {
      const foods = row.getValue("food") as any[];
      const [isExpanded, setIsExpanded] = React.useState(false);

      return (
        <div className="flex flex-col gap-1">
          {!isExpanded ? (
            // Collapsed view - "X foods" + dropdown
            <div className="flex items-center gap-2">
              <span className="text-sm">{foods.length} foods</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(true)}
                className="h-4 w-4 p-0"
              >
                <ChevronDown size={12} />
              </Button>
            </div>
          ) : (
            // Expanded view - individual food items
            <div className="flex flex-col gap-1">
              {foods.map((food, index) => (
                <div key={index} className="flex items-center gap-2">
                  <img
                    src={food.image}
                    alt={food.foodName}
                    className="w-6 h-6 rounded object-cover"
                  />
                  <span className="text-sm">
                    {food.foodName} x{food.count}
                  </span>
                </div>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(false)}
                className="h-4 w-4 p-0 self-start"
              >
                <ChevronDown size={12} className="rotate-180" />
              </Button>
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("date")}</div>
    ),
  },
  {
    accessorKey: "amount",
    header: () => <div>Total</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("mn-MN", {
        style: "currency",
        currency: "MNT",
      }).format(amount);
      return <div className="text-center font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "address",
    header: () => <div>Delivery Address</div>,
    cell: ({ row }) => {
      const address = row.getValue("address") as string;
      const truncatedAddress = address.length > 30 ? address.substring(0, 30) + "..." : address;
      return (
        <div className="max-w-xs" title={address}>
          {truncatedAddress}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Delivery state
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <StatusBadge
        status={row.getValue("status")}
        onStatusChange={(newStatus) =>
          handleStatusChange(row.original.id, newStatus)
        }
      />
    ),
  },
];
