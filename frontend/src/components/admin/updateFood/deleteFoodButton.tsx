"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import axios from "axios";
const baseurl = "http://localhost:8000/";

export const DeleteFoodButton = () => {
  // const deleteFood = async (id: string) => {
  //   try {
  //     const response = await axios.delete(`${baseurl}food`, {
  //       id: id,
  //     });
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

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
