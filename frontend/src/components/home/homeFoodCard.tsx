import { FoodDetails } from "./foodDetails";
import Image from "next/image";
import { UpdateDishButton } from "../admin/updateFood/updateFoodButton";

export const HomeFoodCard = ({
  id,
  foodName,
  image,
  price,
  ingredients,
  isHome,
  categoryName,
}: {
  id: string;
  image: string;
  foodName: string;
  price: number;
  ingredients: string;
  isHome: Boolean;
  categoryName: string;
}) => {
  return (
    <div className="w-auto p-4 bg-white border rounded-xl m-[20px] gap-5">
      <div className="w-full h-auto gap-5 border-none rounded-md relative">
        <div className="aspect-[4/3] relative overflow-hidden rounded-t-2xl">
          <Image
            src={image}
            alt="food"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        {isHome && (
          <FoodDetails
            id={id}
            image={image}
            foodName={foodName}
            price={price}
            ingredients={ingredients}
          />
        )}
        <div className="flex justify-between items-center">
          <span className="text-red-500">{foodName}</span>
          <span>{price.toString()}</span>
        </div>
        <p className="text-wrap text-xs">{ingredients}</p>

        {!isHome && (
          <UpdateDishButton
            id={id}
            image={image}
            foodName={foodName}
            price={price}
            ingredients={ingredients}
            categoryName={categoryName}
          />
        )}
      </div>
    </div>
  );
};
