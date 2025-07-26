"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

import { baseUrl } from "@/lib/utils";

export const DeleteFoodButton = () => {
  return (
    <Button
      variant="outline"
      className="border-red-500"
      onClick={() =>
        toast("Dish successfully deleted.", {
          description: "Would you like to undo this action?",
          action: {
            label: "Undo",
            onClick: () => console.log("clicked"),
          },
        })
      }
    >
      <Trash size={32} color="#ff0000" strokeWidth={1.5} />
    </Button>
  );
};
