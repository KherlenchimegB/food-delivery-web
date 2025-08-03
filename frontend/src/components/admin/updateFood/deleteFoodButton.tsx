"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useState } from "react";
import { baseUrl } from "@/lib/utils";

export const DeleteFoodButton = ({ foodId }: { foodId: string }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Энэ хоолыг устгахдаа итгэлтэй байна уу?")) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`${baseUrl}food/${foodId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Backend error:", errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log("Food deleted successfully");
      toast.success("Dish successfully deleted!");

      // Page refresh хийх
      window.location.reload();
    } catch (error) {
      console.error("Error deleting food:", error);
      toast.error("Failed to delete dish. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Button
      variant="outline"
      className="border-red-500 hover:bg-red-50"
      onClick={handleDelete}
      disabled={isDeleting}
    >
      <Trash size={32} color="#ff0000" strokeWidth={1.5} />
    </Button>
  );
};
