"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, Check, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeliveryStatusDropDownButton } from "./statusDropDownButton";
import { DataFoodListShow } from "./dataFoodListButton";
import { OrderDatePicker } from "./datepicker";
import { baseUrl } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";

// Backend-с ирэх order data-ийн төрөл
export type OrderData = {
  _id: string;
  user: {
    email: string;
  };
  foodOrderItems: {
    food: {
      _id: string;
      foodName: string;
      price: number;
      image: string;
    };
    quantity: number;
  }[];
  status: "PENDING" | "CANCELED" | "DELIVERED";
  createdAt: string;
  deliveryAddress: string;
};

// Frontend-д харагдах төрөл
export type Payment = {
  id: string;
  email: string;
  food: {
    id: string;
    foodName: string;
    count: number;
    price: number;
    image: string;
  }[];
  date: string;
  amount: number;
  address: string;
  status: "PENDING" | "CANCELED" | "DELIVERED";
  createdAt: Date; // Added for date range filtering
};

// Status badge component
const StatusBadge = ({
  status,
  onStatusChange,
}: {
  status: string;
  onStatusChange?: (newStatus: string) => void;
}) => {
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

export const OrderDataTable = () => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [rowSelection, setRowSelection] = React.useState({});
  const [orders, setOrders] = React.useState<Payment[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [dateRange, setDateRange] = React.useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [isBulkDropdownOpen, setIsBulkDropdownOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const bulkDropdownRef = useRef<HTMLDivElement>(null);

  // Click outside event for bulk dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        bulkDropdownRef.current &&
        !bulkDropdownRef.current.contains(event.target as Node)
      ) {
        setIsBulkDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Backend-с order data татах
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}food-order/`);

      if (response.ok) {
        const responseData = await response.json();
        console.log("Backend response:", responseData); // Debug log

        // Backend response format: { success: true, data: orders[] }
        const orderData: OrderData[] = responseData.data || [];

        // Backend data-г frontend format-руу хөрвүүлэх
        const formattedOrders: Payment[] = orderData.map((order) => ({
          id: order._id,
          email: order.user?.email || "Unknown",
          food: order.foodOrderItems.map((item) => ({
            id: item.food._id,
            foodName: item.food.foodName,
            count: item.quantity,
            price: item.food.price,
            image: item.food.image,
          })),
          date: new Date(order.createdAt)
            .toLocaleDateString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })
            .replace(/(\d+)\/(\d+)\/(\d+)/, "$3/$1/$2"), // MM/DD/YYYY format
          amount: order.foodOrderItems.reduce(
            (total, item) => total + item.food.price * item.quantity,
            0
          ),
          address: order.deliveryAddress || "No address",
          status: order.status,
          createdAt: new Date(order.createdAt), // Original date for filtering
        }));

        setOrders(formattedOrders);
      } else {
        console.error("Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // Order status update хийх
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      console.log("Updating order status:", { orderId, newStatus }); // Debug log

      const response = await fetch(`${baseUrl}food-order/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        console.log("Order status updated successfully");
        // Table refresh хийх
        fetchOrders();
      } else {
        console.error("Failed to update order status");
        const errorData = await response.json();
        console.error("Error details:", errorData);
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  // Сонгосон order-уудын status-г зэрэг солих
  const handleBulkStatusChange = async (newStatus: string) => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;

    if (selectedRows.length === 0) {
      alert("Сонгосон order байхгүй байна!");
      return;
    }

    if (
      confirm(
        `${selectedRows.length} order-ын status-г ${newStatus} болгож өөрчлөх үү?`
      )
    ) {
      try {
        const updatePromises = selectedRows.map((row) =>
          fetch(`${baseUrl}food-order/${row.original.id}/status`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: newStatus }),
          })
        );

        const responses = await Promise.all(updatePromises);
        const allSuccessful = responses.every((response) => response.ok);

        if (allSuccessful) {
          console.log("All selected orders updated successfully");
          // Table refresh хийх
          fetchOrders();
          // Selection clear хийх
          table.toggleAllPageRowsSelected(false);
        } else {
          console.error("Some orders failed to update");
          alert("Зарим order update хийгдээгүй байна!");
        }
      } catch (error) {
        console.error("Error updating bulk orders:", error);
        alert("Алдаа гарлаа!");
      }
    }
  };

  // Modal-аас bulk status change хийх
  const handleModalBulkStatusChange = async () => {
    if (!selectedStatus) {
      alert("Status сонгоно уу!");
      return;
    }

    const selectedRows = table.getFilteredSelectedRowModel().rows;

    if (selectedRows.length === 0) {
      alert("Сонгосон order байхгүй байна!");
      return;
    }

    try {
      const updatePromises = selectedRows.map((row) =>
        fetch(`${baseUrl}food-order/${row.original.id}/status`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: selectedStatus }),
        })
      );

      const responses = await Promise.all(updatePromises);
      const allSuccessful = responses.every((response) => response.ok);

      if (allSuccessful) {
        console.log("All selected orders updated successfully");
        // Table refresh хийх
        fetchOrders();
        // Selection clear хийх
        table.toggleAllPageRowsSelected(false);
        // Modal хаах
        setIsBulkModalOpen(false);
        setSelectedStatus("");
      } else {
        console.error("Some orders failed to update");
        alert("Зарим order update хийгдээгүй байна!");
      }
    } catch (error) {
      console.error("Error updating bulk orders:", error);
      alert("Алдаа гарлаа!");
    }
  };

  // Columns definition
  const columns: ColumnDef<Payment>[] = [
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
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="w-16"
          >
            Nº
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row, table }) => {
        const rowIndex = table
          .getRowModel()
          .rows.findIndex((r) => r.id === row.id);
        return <div className="font-medium w-16">{rowIndex + 1}</div>;
      },
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Customer
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("email")}</div>
      ),
    },
    {
      accessorKey: "food",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Food
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
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
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Total
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
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
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Delivery Address
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="max-w-xs truncate">{row.getValue("address")}</div>
      ),
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

  // Component mount хийхэд data татах
  React.useEffect(() => {
    fetchOrders();
  }, []);

  // Date range filter function
  const filteredOrders = React.useMemo(() => {
    if (!dateRange.from && !dateRange.to) {
      return orders;
    }

    return orders.filter((order) => {
      const orderDate = order.createdAt;

      if (dateRange.from && dateRange.to) {
        return orderDate >= dateRange.from && orderDate <= dateRange.to;
      } else if (dateRange.from) {
        return orderDate >= dateRange.from;
      } else if (dateRange.to) {
        return orderDate <= dateRange.to;
      }

      return true;
    });
  }, [orders, dateRange]);

  const table = useReactTable({
    data: filteredOrders, // Use filtered orders instead of all orders
    columns: columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  if (loading) {
    return (
      <div className="w-full h-full p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading orders...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-6">
      {/* Header section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Orders</h1>
          <span className="text-gray-600">
            {table.getFilteredRowModel().rows.length} items
          </span>
        </div>

        <div className="flex items-center gap-4">
          <OrderDatePicker onDateRangeChange={setDateRange} />
          <div className="relative" ref={bulkDropdownRef}>
            <Button
              variant="outline"
              className="bg-gray-100 hover:bg-gray-200"
              onClick={() => setIsBulkModalOpen(true)}
            >
              Change delivery state
              {table.getFilteredSelectedRowModel().rows.length > 0 && (
                <span className="ml-2 bg-blue-500 text-white text-xs rounded-full px-2 py-1">
                  {table.getFilteredSelectedRowModel().rows.length}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Bulk Status Change Modal */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-gray-200 rounded-lg p-6 w-96 max-w-md shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Change delivery state</h2>
              <button
                onClick={() => {
                  setIsBulkModalOpen(false);
                  setSelectedStatus("");
                }}
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
                onClick={handleModalBulkStatusChange}
                className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 w-full"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="h-24 text-center"
                >
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          &lt;
        </Button>
        <div className="flex space-x-1">
          {Array.from({ length: table.getPageCount() }, (_, i) => i + 1).map(
            (page) => (
              <Button
                key={page}
                variant={
                  page === table.getState().pagination.pageIndex + 1
                    ? "default"
                    : "outline"
                }
                size="sm"
                onClick={() => table.setPageIndex(page - 1)}
              >
                {page}
              </Button>
            )
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          &gt;
        </Button>
      </div>
    </div>
  );
};
