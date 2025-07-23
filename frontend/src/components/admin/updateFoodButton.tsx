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
import { Pen } from "lucide-react";
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
            className="w-11 h-11 rounded-full bg-red-500 text-2xl text-white"
          >
            <Pen color="#ffffff" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Dishes info</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex">
              <span>Dish name</span>
              <Input
                {...register("foodName")}
                id="foodName"
                name="foodName"
                placeholder={`${foodName}`}
                className={`${
                  errors.foodName ? "w-full border border-red-400" : "w-full"
                }`}
              />
            </div>
            <div className="flex ">
              <span>Dish category</span>
              <Input
                {...register("categoryName")}
                id="categoryName"
                name="categoryName"
                placeholder={`${categoryName}`}
                className={`${
                  errors.categoryName
                    ? "w-full border border-red-400"
                    : "w-full"
                }`}
              />
            </div>

            <div className="flex gap-3">
              <span>Ingredients</span>
              <Textarea
                placeholder={`${ingredients}`}
                {...register("ingredients")}
              />
            </div>

            <div className="flex w-full gap-3">
              <span>Image</span>
              <img src={`${image}`} alt="food image" className="w-[300px]" />
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
