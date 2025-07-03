export const Appetizers = ({
  id,
  foodName,
  price,
  ingredients,
}: {
  id: String;
  foodName: String;
  price: String;
  ingredients: String;
}) => {
  return (
    <div className="w-[300px] p-4 bg-white border rounded-xl m-[40px]">
      <div className="w-full gap-6">
        <img src="./food.png" alt="food" className="border-none rounded-md" />
        <div className="flex justify-between items-center">
          <span>{foodName}</span>
          <span>{price}</span>
        </div>
        <p className="text-wrap text-xs">{ingredients}</p>
      </div>
    </div>
  );
};
