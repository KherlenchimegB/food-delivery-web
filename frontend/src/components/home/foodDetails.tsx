import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Check, CircleMinus, CirclePlus } from "lucide-react";
import { CldImage } from "next-cloudinary";
import { useState } from "react";

export const FoodDetails = ({
  id,
  foodName,
  image,
  price,
  ingredients,
}: {
  id: String;
  image: string;
  foodName: String;
  price: Number;
  ingredients: String;
}) => {
  const [foodCount, setFoodCount] = useState(1);

  const handleAddClick = () => {
    setFoodCount((prevNumber) => prevNumber + 1);
  };
  const handleMinusClick = () => {
    if (foodCount > 0) setFoodCount((prevNumber) => prevNumber - 1);
  };

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline">+</Button>
        </DialogTrigger>
        <DialogContent className="w-[640px] flex items-center">
          <div className="grid gap-4">
            <CldImage
              src={image}
              alt="food"
              width="300"
              height="300"
              crop="fill"
              className="w-[300px] h-[240px]"
            />
          </div>

          <div className="flex flex-col gap-4">
            <DialogTitle className="text-red-500">{foodName}</DialogTitle>
            <div className="flex justify-between items-center gap-4">
              <p className="text-wrap text-xs ">{ingredients}</p>
            </div>
            <div className="flex flex-row justify-between">
              <div className="gap-2">
                <p className="text-wrap text-xs">Total price</p>
                <span>₮{foodCount * price}</span>
              </div>
              <div className="flex gap-1">
                <CircleMinus
                  size={28}
                  color="#000000"
                  strokeWidth={0.75}
                  onClick={handleMinusClick}
                />
                <span>{foodCount}</span>
                <CirclePlus
                  size={28}
                  color="#000000"
                  strokeWidth={0.75}
                  onClick={handleAddClick}
                />
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full  bg-black text-white"
                >
                  Add to cart
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full" align="start">
                <DropdownMenuLabel className="w-full bg-black text-white flex gap-1 border-none rounded-md">
                  <Check /> Food is being added to the cart!
                </DropdownMenuLabel>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </DialogContent>
      </form>
    </Dialog>
  );
};
