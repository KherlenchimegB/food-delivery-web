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
import { ArrowUpDown } from "lucide-react";
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

const data: Payment[] = [
  {
    id: "685925155b7e2aa757b061a9",
    email: "bold10@gmail.com",
    food: [
      {
        id: "68527cbff6e759b7ded59fac",
        foodName: "Brie Crostini Appetizer",
        count: 2,
        price: 35000,
        image:
          "https://res.cloudinary.com/ddtytj1hq/image/upload/v1751622625/food4_lngefv.png",
      },
    ],

    date: "2025-06-26",
    amount: 70000, //total
    address: "BGD 24-8-101",
    status: "PENDING",
  },
  {
    id: "685925155b7e2aa757b061a9",
    email: "bataa@gmail.com",
    food: [
      {
        id: "68527cbff6e759b7ded59fac",
        foodName: "Brie Crostini Appetizer",
        count: 2,
        price: 25000,
        image:
          "https://res.cloudinary.com/ddtytj1hq/image/upload/v1751622625/food4_lngefv.png",
      },
    ],

    date: "2025-05-26",
    amount: 50000,
    address: "BGD 24-8-101",
    status: "DELIVERED",
  },
];

export type Payment = {
  id: string;
  email: string;
  food: [
    {
      id: string;
      foodName: string;
      count: number;
      price: number;
      image: string;
    }
  ];
  date: string;
  amount: number; //total
  address: string;
  status: "PENDING" | "CANCELED" | "DELIVERED";
};

export const columns: ColumnDef<Payment>[] = [
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
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Customer
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "food",
    header: () => <div className="text-left">Foods</div>,
    cell: ({ row }) => (
      <div className="flex justify-start capitalize w-40 gap-5  ">
        {/* backendees data oruulah */}
        <DataFoodListShow
          image={
            "https://res.cloudinary.com/ddtytj1hq/image/upload/v1751622625/food4_lngefv.png"
          }
          foodName={"Brie Crostini Appetizer"}
          count={2}
        />
        <div>
          {/* {row.getValue("food")}  */}
          foods
        </div>
      </div>
    ),
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
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div className="capitalize">{row.getValue("date")}</div>,
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Total</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("mn-MN", {
        style: "currency",
        currency: "MNT",
      }).format(amount);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "address",
    header: () => <div className="text-center">Delivery address</div>,
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("address")}</div>
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
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="flex justify-between capitalize w-40 gap-5 border px-2 rounded-full">
        {row.getValue("status")}
        <DeliveryStatusDropDownButton />
      </div>
    ),
  },
];

export const OrderDataTable = () => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
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
  });

  return (
    <div className="w-full">
      <div className="flex justify-between w-full m-5 h-[60px] border rounded-md p-2">
        <div className="flex flex-col items-center">
          <h1 className="font-bold">Orders</h1>
          <span className="text-xs">
            {table.getFilteredRowModel().rows.length} items
          </span>
        </div>
        <div className="flex items-center py-4">
          <Input
            placeholder="Filter emails..."
            value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("email")?.setFilterValue(event.target.value)
            }
            className="w-[300px]"
          />
        </div>
        <OrderDatePicker />
        <div className="flex justify-between gap-4">
          <button className="bg-[#18181B] border rounded-full px-2 text-white opacity-20">
            Change delivery state
          </button>
        </div>
      </div>

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
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

// {
//             "_id": "685925155b7e2aa757b061a9",
//             "user": null,
//             "foodOrderItems": [
//                 {
//                     "food": {
//                         "_id": "68527bc3c6e83776b3b2a525",
//                         "foodName": "Finger food",
//                         "price": 35000,
//                         "image": "https://res.cloudinary.com/ddtytj1hq/image/upload/v1751622574/Food_hqfdux.png",
//                         "ingredients": "Fluffy pancakes stacked with fruits, cream, syrup, and powdered sugar.",
//                         "createdAt": "2025-06-18T08:41:39.890Z",
//                         "updatedAt": "2025-06-18T08:41:39.890Z",
//                         "__v": 0,
//                         "category": "6853d7b26f210e91a7353a78"
//                     },
//                     "quantity": 4,
//                     "_id": "685925155b7e2aa757b061aa"
//                 },
//             ],
//             "status": "PENDING",
//             "createdAt": "2025-06-23T09:57:41.209Z",
//             "updatedAt": "2025-06-23T09:57:41.209Z",
//             "__v": 0
//         },
