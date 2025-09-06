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
import { PencilLine, X, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import React from "react";
import { CategoryDropDownMenu } from "./categoryDropDown";
import { DeleteFoodButton } from "./deleteFoodButton";
import { baseUrl } from "@/lib/utils";
import { toast } from "sonner";

const addDishSchema = yup.object({
  foodName: yup.string().required("Please must enter Food name"),
  price: yup.number().required("Please must enter Food price"),
  ingredients: yup.string().required("Please must enter ingredients"),
  categoryName: yup.string().required("Please must enter Food name"),
  image: yup.string().required("Please must enter image"),
});

type AddDishFormData = yup.InferType<typeof addDishSchema>;

// Cloudinary config
const CLOUDINARY_CONFIG = {
  cloudName: "ddtytj1hq",
  uploadPreset: "picture",
  folder: "food-delivery",
  maxFileSize: 10000000, // 10MB
};

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
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentImage, setCurrentImage] = useState(image);
  const [isImageRemoved, setIsImageRemoved] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<AddDishFormData>({
    resolver: yupResolver(addDishSchema),
    mode: "onChange",
  });

  // Form-ийн анхны утгуудыг тохируулах
  useEffect(() => {
    setValue("foodName", foodName);
    setValue("price", price);
    setValue("ingredients", ingredients);
    setValue("categoryName", categoryName);
    setValue("image", image);
    setCurrentImage(image);
    setIsImageRemoved(false);
  }, [foodName, price, ingredients, categoryName, image, setValue]);

  const handleModalClose = () => {
    setIsOpen(false);
    reset();
    setCurrentImage(image);
    setIsImageRemoved(false);
  };

  // Upload image to Cloudinary
  const uploadToCloudinary = async (base64: string): Promise<string> => {
    const formData = new FormData();
    formData.append("file", base64);
    formData.append("upload_preset", CLOUDINARY_CONFIG.uploadPreset);
    formData.append("cloud_name", CLOUDINARY_CONFIG.cloudName);
    formData.append("folder", CLOUDINARY_CONFIG.folder);

    const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`;

    const response = await fetch(uploadUrl, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Upload failed (${response.status}): ${errorText}`);
    }

    const result = await response.json();

    if (!result.secure_url) {
      throw new Error("secure_url not found");
    }
    return result.secure_url;
  };

  // Handle file upload
  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // File size check
    if (file.size > CLOUDINARY_CONFIG.maxFileSize) {
      const sizeMB = (file.size / 1024 / 1024).toFixed(2);
      const maxSizeMB = (CLOUDINARY_CONFIG.maxFileSize / 1024 / 1024).toFixed(
        2
      );
      toast.error(`The file is too large. must be less than ${maxSizeMB}MB.`);
      return;
    }

    // File type check
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files can be uploaded.");
      return;
    }

    try {
      // Convert to base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result as string;
          resolve(result);
        };
        reader.onerror = (error) => {
          reject(error);
        };
        reader.readAsDataURL(file);
      });

      // Upload to Cloudinary
      const imageUrl = await uploadToCloudinary(base64);

      // Update form and display
      setCurrentImage(imageUrl);
      setValue("image", imageUrl, { shouldValidate: true });
      setIsImageRemoved(false);
      toast.success("Image uploaded successfully.");
    } catch (error) {
      toast.error(
        `Upload error: ${
          error instanceof Error ? error.message : "Unspecified error"
        }`
      );
    }
  };

  const handleRemoveImage = () => {
    setCurrentImage("");
    setValue("image", "");
    setIsImageRemoved(true);
    toast.info("Image removed. Please upload a new image.");
  };

  const onSubmit = async (formData: AddDishFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`${baseUrl}food/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      toast.success("Dish updated successfully!");
      setIsOpen(false);
      window.location.reload();
    } catch (error) {
      toast.error("Failed to update dish. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="w-full h-full flex items-center justify-center cursor-pointer">
          <PencilLine size={16} className="text-red-500" />
        </div>
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
            <CategoryDropDownMenu
              id={id}
              categoryName={categoryName}
              onCategoryChange={(categoryName) =>
                setValue("categoryName", categoryName)
              }
            />

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
                {...register("price", { valueAsNumber: true })}
                id="price"
                name="price"
                type="number"
                step="0.01"
                defaultValue={price}
                className={`${
                  errors.price ? " w-4/5 border border-red-400" : " w-2/3"
                }`}
              />
            </div>

            <div className="flex w-full gap-3 justify-between">
              <span className="text-xs text-[#7171AA]">Image</span>
              <div className="relative w-full">
                {currentImage ? (
                  <div className="relative">
                    <img
                      src={currentImage}
                      alt="food image"
                      className="w-full h-45 border rounded-md object-cover"
                    />
                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    
                    {/* Change picture button */}
                    <button
                      type="button"
                      onClick={() => document.getElementById("file-input")?.click()}
                      className="absolute bottom-2 left-2 bg-white text-black px-3 py-1 rounded-md text-sm font-medium hover:bg-gray-100 shadow-md"
                    >
                      Change picture
                    </button>
                  </div>
                ) : (
                  <div
                    className="w-full h-45 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
                    onClick={() =>
                      document.getElementById("file-input")?.click()
                    }
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="w-8 h-8 text-gray-400" />
                      <span className="text-sm text-gray-500">
                        Click to upload image
                      </span>
                    </div>
                  </div>
                )}

                {/* Hidden file input */}
                <input
                  id="file-input"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleFileUpload(file);
                    }
                    e.target.value = "";
                  }}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <div className="w-full flex justify-between">
              <DeleteFoodButton foodId={id} />
              <Button
                type="submit"
                disabled={isSubmitting || !currentImage}
                className="bg-black text-white hover:bg-gray-800"
              >
                {isSubmitting ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
