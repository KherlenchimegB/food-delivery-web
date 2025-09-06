"use client";
import { FoodMenu } from "@/components/admin/foodMenu";
import { OrderDataTable } from "@/components/admin/adminTable/OrderDataTable";
import { useAdmin } from "@/context/adminContext";

export default function Home() {
  const { select } = useAdmin();

  return (
    <div className="flex-1 overflow-auto">
      {select === 1 && <OrderDataTable />}
      {select === 2 && <FoodMenu />}
    </div>
  );
}
