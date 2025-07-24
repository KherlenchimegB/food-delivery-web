"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, PencilLine } from "lucide-react";
import { useEffect, useState } from "react";
import React from "react";
const baseurl = "http://localhost:8000/";

export const CategoryDropDownMenu = ({
  id,
  categoryName,
}: {
  id: String;
  categoryName: string;
}) => {
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  useEffect(() => {
    fetchCategories();
    setValue(categoryName);
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${baseurl}food-category`);
      const responseData = await response.json();
      setCategoryData(responseData.data);
    } catch (error) {
      console.log("Error fetching category:", error);
    }
  };

  return (
    <div className="flex justify-between">
      <span className="text-xs text-[#7171A]">Dish category</span>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-2/3 justify-between text-gray-500"
          >
            {value
              ? categoryData.find(
                  (categoryData) => categoryData.categoryName === value
                )?.categoryName
              : "Select category..."}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-2/3 p-0">
          <Command className="w-full h-fit text-gray-600">
            <CommandList>
              <CommandEmpty>No data found.</CommandEmpty>
              <CommandGroup>
                {categoryData.map((category) => (
                  <CommandItem
                    key={category._id}
                    value={category.categoryName}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    {category.categoryName}
                    <Check
                      className={cn(
                        "ml-auto text-gray-600",
                        value === category.categoryName
                          ? "opacity-100 text-gray-600"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
