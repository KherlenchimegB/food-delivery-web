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
import { baseUrl } from "@/lib/utils";
import { toast } from "sonner";
import { useState } from "react";

const addCategorySchema = yup.object({
  categoryName: yup.string().required("Please must enter Category name"),
});

type AddCategoryFormData = yup.InferType<typeof addCategorySchema>;

export const AddCategoryButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddCategoryFormData>({
    resolver: yupResolver(addCategorySchema),
    mode: "onChange",
  });

  const onSubmit = async (formData: AddCategoryFormData) => {
    setIsSubmitting(true);
    try {
      console.log("Adding category:", formData);

      const response = await fetch(`${baseUrl}food-category`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Backend error:", errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log("Category added successfully:", responseData);

      toast.success("Category added successfully!");
      setIsOpen(false);
      reset();

      // Page refresh хийх эсвэл parent component-д мэдэгдэх
      window.location.reload();
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error("Failed to add category. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setIsOpen(false);
    reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-11 h-11 rounded-full bg-red-500 hover:bg-red-600 text-2xl text-white"
        >
          +
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="pb-4">
            <DialogTitle>Add new category</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-6">
            <div className="space-y-2">
              <label htmlFor="categoryName" className="text-sm font-medium">
                Category name
              </label>
              <Input
                {...register("categoryName")}
                id="categoryName"
                name="categoryName"
                placeholder="Type category name"
                className={`${errors.categoryName ? "border-red-400" : ""}`}
              />
              {errors.categoryName && (
                <p className="text-red-500 text-sm">
                  {errors.categoryName.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter className="pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-black hover:bg-gray-800"
            >
              {isSubmitting ? "Adding..." : "Add Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
