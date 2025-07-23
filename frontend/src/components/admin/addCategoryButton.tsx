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
const baseurl = "http://localhost:8000/";

const addCategorySchema = yup.object({
  categoryName: yup.string().required("Please must enter Category name"),
});

type AddCategoryFormData = yup.InferType<typeof addCategorySchema>;

export const AddCategoryButton = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddCategoryFormData>({
    resolver: yupResolver(addCategorySchema), // connect with yup validation
    mode: "onChange",
  });

  const onSubmit = async (formData: AddCategoryFormData) => {
    console.log("ajillalaa");
    try {
      const response = await fetch(`${baseurl}food-category`, {
        method: "POST",
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
            className="w-11 h-11 rounded-full bg-red-500 text-2xl text-white"
          >
            +
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add new category</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <span>Category name</span>
            <Input
              {...register("categoryName")}
              id="categoryName"
              name="categoryName"
              placeholder="Type category name"
              className={`${
                errors.categoryName ? "w-full border border-red-400" : "w-full"
              }`}
            />
          </div>
          <DialogFooter>
            <Button type="submit">Add Category</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};
