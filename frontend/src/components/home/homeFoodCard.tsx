import { CldImage } from "next-cloudinary";
import { FoodDetails } from "./foodDetails";

export const HomeFoodCard = ({
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
  return (
    <div className="w-auto p-4 bg-white border-amber-300 rounded-xl m-[40px]">
      <div className="w-full h-full gap-6 border rounded-md relative">
        <CldImage
          src={image}
          alt="food"
          width="400"
          height="240"
          crop="fill"
          className="w-full h-[240px]"
        />
        <FoodDetails
          // key={id}
          id={id}
          image={image}
          foodName={foodName}
          price={price}
          ingredients={ingredients}
        />
        <div className="flex justify-between items-center p-[20px]">
          <span>{foodName}</span>
          <span>{price.toString()}</span>
        </div>
        <p className="text-wrap text-xs m-[20px]">{ingredients}</p>
      </div>
    </div>
  );
};
