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
import { Input } from "@/components/ui/input";
import { Textarea } from "../../ui/textarea";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// import axios from "axios";
import { PencilLine } from "lucide-react";
import { useEffect, useState } from "react";
import React from "react";
import { CategoryDropDownMenu } from "./categoryDropDown";
import { DeleteFoodButton } from "./deleteFoodButton";
import { baseUrl } from "@/lib/utils";

const addDishSchema = yup.object({
  foodName: yup.string().required("Please must enter Food name"),
  price: yup.number().required("Please must enter Food price"),
  ingredients: yup.string().required("Please must enter ingredients"),
  categoryName: yup.string().required("Please must enter Food name"),
  // image: yup.string() || undefined,
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
  id: string;
  image: string;
  categoryName: string;
  foodName: string;
  price: number;
  ingredients: string;
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

  useEffect(() => {
    fetchFoods();
  }, [foodData]);

  const fetchFoods = async () => {
    try {
      const response = await fetch(`${baseUrl}food`);
      const responseData = await response.json();
      setFoodData(responseData.data);
    } catch (error) {
      console.log("Error fetching food:", error);
    }
  };

  const onSubmit = async (formData: AddDishFormData) => {
    console.log("ajillalaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    try {
      const response = await fetch(`${baseUrl}food/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const responseData = await response.json();
      console.log("responseData", responseData);
      console.log("update food button ajillalaa");
      console.log("formdata", formData);
    } catch (error) {
      console.log("error", error);
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-11 h-11 rounded-full text-2xl text-white"
        >
          <PencilLine color="#ff0000" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle className="text-2xl">Dishes info</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between">
              <span className="text-xs text-[#7171AA]">Dish name</span>
              <Input
                {...register("foodName")}
                id="foodName"
                name="foodName"
                defaultValue={foodName}
                className={`${
                  errors.foodName ? " w-2/3 border border-red-400" : " w-2/3"
                }`}
              />
            </div>
            <CategoryDropDownMenu id={id} categoryName={categoryName} />

            <div className="flex gap-3 justify-between">
              <span className="text-xs text-[#7171AA]">Ingredients</span>
              <Textarea
                className="w-2/3"
                defaultValue={ingredients}
                {...register("ingredients")}
              />
            </div>

            <div className="flex gap-3 justify-between">
              <span className="text-xs text-[#7171AA]">Price</span>
              <Input
                {...register("price")}
                id="price"
                name="price"
                defaultValue={price}
                className={`${
                  errors.price ? " w-4/5 border border-red-400" : " w-2/3"
                }`}
              />
            </div>

            <div className="flex w-full gap-3 justify-between">
              <span className="text-xs text-[#7171AA]">Image</span>
              <img
                src={image}
                alt="food image"
                className="w-full h-45 border rounded-md"
              />
            </div>
          </div>
          <DialogFooter>
            <div className="w-full flex justify-between">
              <DeleteFoodButton />
              <Button type="submit">Save changes</Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
