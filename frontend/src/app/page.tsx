import { Appetizers } from "@/components/components/appetizers";
import { Navigation } from "@/components/components/navigation";

export default function Home() {
  return (
    <div className="flex w-screen flex-col bg-[#404040]">
      <Navigation />
      <div className="w-full">
        <img src="./asset.png" alt="asset" className="w-full " />
      </div>
      <div className="w-full">
        <img src="./asset.png" alt="asset" className="w-full " />
      </div>
      <div className="grid grid-cols-5">
        <Appetizers
          id={"6853b61cd45e1c5eeb7c49a7"}
          foodName={"Food name"}
          price={"25000"}
          ingredients={
            "Fluffy pancakes stacked with fruits, cream, syrup, and powdered sugar."
          }
        />
      </div>
    </div>
  );
}
