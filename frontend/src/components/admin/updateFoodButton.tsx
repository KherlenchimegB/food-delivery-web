"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// import axios from "axios";
import { Check, ChevronsUpDown, PencilLine } from "lucide-react";
import { useEffect, useState } from "react";
import React from "react";
const baseurl = "http://localhost:8000/";

const addDishSchema = yup.object({
  foodName: yup.string().required("Please must enter Food name"),
  price: yup.number().required("Please must enter Food price"),
  ingredients: yup.string().required("Please must enter ingredients"),
  categoryName: yup.string().required("Please must enter Food name"),
  //   image: yup.string() || undefined,
});

type AddDishFormData = yup.InferType<typeof addDishSchema>;

export const UpdateDishButton = ({
  id,
  foodName,
  categoryName,
  image,
  price,
  ingredients,
}: {
  id: String;
  image: string;
  categoryName: string;
  foodName: String;
  price: Number;
  ingredients: String;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddDishFormData>({
    resolver: yupResolver(addDishSchema), // connect with yup validation
    mode: "onChange",
  });
  const [foodData, setFoodData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  useEffect(() => {
    fetchCategories();
    fetchFoods();
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

  const fetchFoods = async () => {
    try {
      const response = await fetch(`${baseurl}food`);
      const responseData = await response.json();
      setFoodData(responseData.data);
    } catch (error) {
      console.log("Error fetching food:", error);
    }
  };
  const onSubmit = async (formData: AddDishFormData) => {
    console.log("ajillalaa");
    try {
      const response = await fetch(`${baseurl}food`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const responseData = await response.json();
      console.log("responseData", responseData);
      console.log("ajillalaa");
      console.log("formdata", formData);
    } catch (error) {
      console.log("error", error);
    }
  };
  return (
    <Dialog>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="w-11 h-11 rounded-full text-2xl text-white"
          >
            <PencilLine color="#ff0000" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl">Dishes info</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between">
              <span>Dish name</span>
              <Input
                {...register("foodName")}
                id="foodName"
                name="foodName"
                placeholder={`${foodName}`}
                className={`${
                  errors.foodName ? " w-1/2 border border-red-400" : " w-1/2"
                }`}
              />
            </div>
            <div className="flex justify-between">
              <span>Dish category</span>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                  >
                    {value
                      ? categoryData.find(
                          (categoryData) => categoryData.value === value
                        )?.label
                      : "Select category..."}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search framework..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>No data found.</CommandEmpty>
                      <CommandGroup>
                        {categoryData.map((category) => (
                          <CommandItem
                            key={category.value}
                            value={category.categoryName}
                            onSelect={(currentValue) => {
                              setValue(
                                currentValue === value ? "" : currentValue
                              );
                              setOpen(false);
                            }}
                          >
                            {category.label}
                            <Check
                              className={cn(
                                "ml-auto",
                                value === category.value
                                  ? "opacity-100"
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
              {/* {categoryData.map((category) => (
                <SelectGroup>
                  <SelectItem value="apple" key={category._id}>
                    {category.categoryName}
                  </SelectItem>
                </SelectGroup>
              ))} */}
            </div>

            <div className="flex gap-3 justify-between">
              <span>Ingredients</span>
              <Textarea
                placeholder={`${ingredients}`}
                {...register("ingredients")}
              />
            </div>

            <div className="flex w-full gap-3 justify-between">
              <span>Image</span>
              <img
                src={`${image}`}
                alt="food image"
                className="w-[300px] h-45 border rounded-md"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};
