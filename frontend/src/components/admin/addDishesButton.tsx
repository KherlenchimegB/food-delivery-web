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

const addDishSchema = yup.object({
  foodName: yup.string().required("Please must enter Food name"),
  price: yup.number().required("Please must enter Food price"),
  ingredients: yup.string().required("Please must enter ingredients"),
  //   foodImage: yup.string() || undefined,
});

type AddDishFormData = yup.InferType<typeof addDishSchema>;

export const AddDishesButton = () => {
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
            <DialogTitle>Add new Dish to Appetizers</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex gap-4 items-center justify-center">
              <div className="flex flex-col">
                <span>Food name</span>
                <Input
                  {...register("foodName")}
                  id="foodName"
                  name="foodName"
                  placeholder="Type food name"
                  className={`${
                    errors.foodName ? "w-full border border-red-400" : "w-full"
                  }`}
                />
              </div>
              <div className="flex flex-col">
                <span>Food price</span>
                <Input
                  {...register("price")}
                  id="foodPrice"
                  name="foodPrice"
                  placeholder="Enter price"
                  //   defaultValue="Enter price"
                  className={`${
                    errors.price ? "w-full border border-red-400" : "w-full"
                  }`}
                />
              </div>
            </div>
            <div className="grid gap-3"></div>
            <span>Ingredients</span>
            <Textarea
              placeholder="List ingredients..."
              {...register("ingredients")}
            />

            <div className="grid w-full max-w-sm items-center gap-3">
              <span>Food image</span>
              <Input
                id="foodImage"
                type="file"
                //   {...register("foodImage")}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Add Dish</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};
