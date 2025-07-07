import { Button } from "@/components/ui/button";
import { CldImage } from "next-cloudinary";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CircleMinus, CirclePlus } from "lucide-react";
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
  const [foodCount, setFoodCount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const handleAddClick = ({ price }: { price: Number }) => {
    setFoodCount((prevNumber) => prevNumber + 1);
    setTotalPrice(price);
  };
  const handleMinusClick = () => {
    if (foodCount > 0) setFoodCount((prevNumber) => prevNumber - 1);
  };
  const totalPriceFood = ({ price }: { price: Number }) => {
    setTotalPrice(foodCount * price);
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
            <div className="flex flex-row">
              <div className="gap-2">
                <p className="text-wrap text-xs">Total price</p>
                <span>₮{totalPrice.toString()}</span>
              </div>
              <div className="flex">
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
            <Button type="submit" className="w-full">
              Add to cart
            </Button>
          </div>
        </DialogContent>
      </form>
    </Dialog>
  );
};
