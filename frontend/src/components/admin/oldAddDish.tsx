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
import { Textarea } from "../ui/textarea";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { baseUrl } from "@/lib/utils";
import { CldUploadButton } from "next-cloudinary";
import { toast } from "sonner";
import { useState } from "react";
import type { CloudinaryUploadWidgetInfo } from "next-cloudinary";

const addDishSchema = yup.object({
  foodName: yup.string().required("Please must enter Food name"),
  price: yup.number().required("Please must enter Food price"),
  ingredients: yup.string().required("Please must enter ingredients"),
  image: yup.string().required("Please must enter ingredients") || undefined,
});

type AddDishFormData = yup.InferType<typeof addDishSchema>;

export const AddDishesButton = () => {
  console.log("----------- add dish huudas");
  const [previewUrl, setPreviewUrl] = useState("");
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AddDishFormData>({
    resolver: yupResolver(addDishSchema), // connect with yup validation
    mode: "onChange",
  });

  const onSubmit = async (formData: AddDishFormData) => {
    try {
      const response = await fetch(`${baseUrl}food`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const responseData = await response.json();
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-11 h-11 rounded-full bg-red-500 text-2xl text-white"
        >
          +
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add new Dish to Appetizers</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex gap-4 items-center justify-center">
            <div className="flex flex-col">
              <span>Food name</span>
              <Input
                {...register("foodName")}
                id="foodName"
                placeholder="Type food name"
                className={`w-full ${
                  errors.foodName ? "border border-red-400" : ""
                }`}
              />
            </div>
            <div className="flex flex-col">
              <span>Food price</span>
              <Input
                {...register("price")}
                id="foodPrice"
                placeholder="Enter price"
                className={`w-full ${
                  errors.price ? "border border-red-400" : ""
                }`}
              />
            </div>
          </div>

          <span>Ingredients</span>
          <Textarea
            placeholder="List ingredients..."
            {...register("ingredients")}
          />

          <div className="grid w-full max-w-sm items-center gap-3">
            <span>Food image</span>

            <CldUploadButton
              uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
              options={{
                cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
              }}
              onSuccess={(results) => {
                if (
                  typeof results === "object" &&
                  results !== null &&
                  "info" in results &&
                  typeof results.info === "object" &&
                  results.info !== null &&
                  "secure_url" in results.info
                ) {
                  const secureUrl = (results.info as { secure_url: string })
                    .secure_url;
                  setPreviewUrl(secureUrl);
                  setValue("image", secureUrl);
                  console.log(results);
                }
              }}
              className="w-full h-[200px] border border-dashed border-gray-400 text-center"
            >
              Upload Image
            </CldUploadButton>
          </div>
          <DialogFooter>
            {/* <Button type="submit">Add Dish</Button> */}
            <Button
              variant="outline"
              type="submit"
              className="bg-black text-white"
              onClick={() => toast("New dish is being added to the menu")}
            >
              Add dish
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
