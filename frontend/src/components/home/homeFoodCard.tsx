import { CldImage } from "next-cloudinary";
import { FoodDetails } from "./foodDetails";
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
  id: String;
  image: string;
  foodName: String;
  price: Number;
  ingredients: String;
  isHome: Boolean;
  categoryName: string;
}) => {
  return (
    <div className="w-auto p-4 bg-white border rounded-xl m-[20px] gap-5">
      <div className="w-full h-auto gap-5 border-none rounded-md relative">
        <div className="w-full h-auto border-none rounded-md">
          <CldImage
            src={image}
            alt="food"
            width="650"
            height="240"
            crop="fill"
            className="border-none rounded-md"
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
