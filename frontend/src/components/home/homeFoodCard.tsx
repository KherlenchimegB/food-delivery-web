import { CldImage } from "next-cloudinary";
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
    <div className="w-auto p-4 bg-white border rounded-xl m-[40px]">
      <div className="w-full gap-6">
        {/* <img src={image} alt="food" className="border-none rounded-md" /> */}
        <CldImage src={image} alt={"food"} width={"400"} height={"340"} />
        <div className="flex justify-between items-center">
          <span>{foodName}</span>
          <span>{price.toString()}</span>
        </div>
        <p className="text-wrap text-xs">{ingredients}</p>
      </div>
    </div>
  );
};
