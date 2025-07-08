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
        <div className="w-full h-[240px] border-none rounded-md">
          <CldImage
            src={image}
            alt="food"
            width="600"
            height="240"
            // fill={true}
            crop="fill"
            className="border-none rounded-md"
          />
        </div>
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
