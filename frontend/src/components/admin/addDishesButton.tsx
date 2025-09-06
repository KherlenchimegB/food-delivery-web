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
import { baseUrl } from "@/lib/utils";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";

// Constants
const CLOUDINARY_CONFIG = {
  cloudName: "ddtytj1hq",
  uploadPreset: "picture",
  folder: "food-delivery",
  maxFileSize: 10000000, // 10MB
};

// Schema
const addDishSchema = yup.object({
  foodName: yup.string().required("Please must enter Food name"),
  price: yup
    .number()
    .min(0, "Price must be at least 0")
    .max(1000, "Price must be at most 1000")
    .positive("The price must be a positive number.")
    .required("Enter price"),
  ingredients: yup.string().required("Enter the ingredients."),
  image: yup.string().required("Please insert a picture."),
  categoryName: yup.string().required("Please select a category."),
});

type AddDishFormData = yup.InferType<typeof addDishSchema>;

export const AddDishesButton = ({
  categoryProp,
  children,
}: {
  categoryProp?: string;
  children?: React.ReactNode;
}) => {
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const resetForm = () => {
    reset();
    setPreviewUrl("");
  };

  // Form-ийн анхны утгуудыг тохируулах
  useEffect(() => {
    if (categoryProp) {
      setValue("categoryName", categoryProp);
    }
  }, [categoryProp, setValue]);

  // Handle form submission
  const onSubmit = async (formData: AddDishFormData) => {
    // Image validation
    if (!previewUrl) {
      toast.error("Please upload an image first.");
      return;
    }

    // Form validation
    if (!formData.foodName || !formData.price || !formData.ingredients) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Category-г автоматаар нэмэх
      const dataToSend = {
        ...formData,
        image: previewUrl,
        categoryName: categoryProp || "Other Foods",
      };

      const response = await fetch(`${baseUrl}food`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      toast.success("Dish has been added successfully!");
      resetForm();
      setIsOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Form submit error:", error);
      toast.error("There was an error adding food. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
      toast.error(`The file is too large. must be less than ${maxSizeMB}MB. `);
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
          console.error("FileReader error:", error);
          reject(error);
        };
        reader.readAsDataURL(file);
      });

      // Upload to Cloudinary
      const imageUrl = await uploadToCloudinary(base64);

      // Update form
      setPreviewUrl(imageUrl);
      setValue("image", imageUrl, { shouldValidate: true });
      toast.success("Image uploaded successfully.");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(
        `Upload error: ${
          error instanceof Error ? error.message : "Unspecified error"
        }`
      );
    }
  };

  // Image upload area component
  const ImageUploadArea = () => (
    <div
      className={`w-full h-[200px] border-2 border-dashed  bg-gray-100 ${
        errors.image ? "border-red-400" : "border-gray-300"
      } rounded-lg flex items-center justify-center text-center hover:border-gray-400 transition-colors cursor-pointer`}
      onClick={() => document.getElementById("file-input")?.click()}
    >
      {previewUrl ? (
        <div className="relative w-full h-full">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-full object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-lg">
            <span className="text-white text-sm">Change picture</span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-2xl">
            📷
          </div>
          <div className="text-center">
            <div className="text-sm font-medium text-gray-700 mb-1">
              Choose a file or drag & drop it here
            </div>
            <div className="text-xs text-gray-400 mt-1">
              JPG, PNG, WebP (max 10MB)
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <div className="w-full h-full flex flex-col justify-center items-center cursor-pointer group">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-4 group-hover:bg-red-600 transition-colors">
              <Plus size={32} className="text-white" />
            </div>
          </div>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add new Dish to {categoryProp || "Appetizers"}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex gap-2 items-center justify-between">
            <div className="flex flex-col w-1/2">
              <label htmlFor="foodName" className="text-sm font-medium mb-1">
                FoodName *
              </label>
              <Input
                {...register("foodName")}
                id="foodName"
                placeholder="Type food name"
                className={errors.foodName ? "border-red-400" : ""}
              />
              {errors.foodName && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.foodName.message}
                </span>
              )}
            </div>

            <div className="flex flex-col w-1/2">
              <label htmlFor="price" className="text-sm font-medium mb-1">
                Price *
              </label>
              <Input
                {...register("price", { valueAsNumber: true })}
                id="price"
                type="number"
                min="0"
                max="1000"
                step="0.01"
                placeholder="Enter price..."
                className={errors.price ? "border-red-400" : ""}
              />
              {errors.price && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.price.message}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col">
            <label htmlFor="ingredients" className="text-sm font-medium mb-1">
              Ingredients *
            </label>
            <Textarea
              {...register("ingredients")}
              id="ingredients"
              placeholder="List ingredients..."
              className={`min-h-[80px] ${
                errors.ingredients ? "border-red-400" : ""
              }`}
            />
            {errors.ingredients && (
              <span className="text-red-500 text-xs mt-1">
                {errors.ingredients.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium">Image *</label>

            <ImageUploadArea />

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

            {errors.image && (
              <span className="text-red-500 text-xs">
                {errors.image.message}
              </span>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsOpen(false);
                resetForm();
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-red-500 hover:bg-red-600 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add dish"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
