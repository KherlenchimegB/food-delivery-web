"use client";

import * as React from "react";
import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrderDatePicker } from "./datepicker";
import { createTableColumns } from "./TableColumns";
import { BulkStatusModal } from "./BulkStatusModal";
import { useOrderData } from "./useOrderData";
import { Payment } from "./types";
import { useState, useEffect, useRef } from "react";

export const OrderDataTable = () => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = React.useState({});
  const [dateRange, setDateRange] = React.useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const bulkDropdownRef = useRef<HTMLDivElement>(null);

  const {
    orders,
    loading,
    handleStatusChange,
    handleModalBulkStatusChange,
  } = useOrderData();

  // Click outside event for bulk dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        bulkDropdownRef.current &&
        !bulkDropdownRef.current.contains(event.target as Node)
      ) {
        setIsBulkModalOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Create columns with the handleStatusChange function
  const columns = React.useMemo(() => createTableColumns({ handleStatusChange }), [handleStatusChange]);

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
    data: filteredOrders,
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

  const handleModalConfirm = async () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    await handleModalBulkStatusChange(selectedStatus, selectedRows);
    
    // Selection clear хийх
    table.toggleAllPageRowsSelected(false);
    // Modal хаах
    setIsBulkModalOpen(false);
    setSelectedStatus("");
  };

  const handleModalClose = () => {
    setIsBulkModalOpen(false);
    setSelectedStatus("");
  };

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
      <BulkStatusModal
        isOpen={isBulkModalOpen}
        onClose={handleModalClose}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        onConfirm={handleModalConfirm}
        table={table}
      />

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

// export { OrderDataTable };