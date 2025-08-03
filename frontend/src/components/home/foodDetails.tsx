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
import { Check, CircleMinus, CirclePlus, X } from "lucide-react";
import { CldImage } from "next-cloudinary";
import { useState, useContext } from "react";
import { CartContext } from "@/context/cardContext";
import { UserContext } from "@/context/userContext";
import { useRouter } from "next/navigation";

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
  const [isAdded, setIsAdded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const { addToCart } = useContext(CartContext);
  const { userInfo } = useContext(UserContext);
  const router = useRouter();

  const handleAddClick = () => {
    setFoodCount((prevNumber) => prevNumber + 1);
  };

  const handleMinusClick = () => {
    if (foodCount > 0) setFoodCount((prevNumber) => prevNumber - 1);
  };

  // Cart-д нэмэх функц
  const handleAddToCart = () => {
    // Хэрэглэгч нэвтрээгүй байвал login шаардлагатай
    if (userInfo.email === "") {
      setShowLoginAlert(true);
      setTimeout(() => {
        setShowLoginAlert(false);
      }, 3000);
      return;
    }

    addToCart({
      id: id.toString(),
      foodName: foodName.toString(),
      price: Number(price),
      image: image,
      ingredients: ingredients.toString(),
      userId: "user123", // Энэ утгыг дараа нь user context-ээс авна
    });

    setIsAdded(true);
    setIsOpen(false); // Modal хаах

    // 3 секундын дараа notification-г арилгана
    setTimeout(() => {
      setIsAdded(false);
    }, 3000);
  };

  return (
    <>
      {/* Login Alert */}
      {showLoginAlert && (
        <div className="fixed top-[80px] left-1/2 transform -translate-x-1/2 z-[60] bg-black text-white px-4 py-2 rounded-md flex items-center gap-2 shadow-lg">
          <span className="text-sm">You need to log in first</span>
          <Button
            variant="outline"
            size="sm"
            className="bg-white text-black hover:bg-gray-100"
            onClick={() => router.push("/user/sign-in")}
          >
            Login
          </Button>
        </div>
      )}

      {/* Notification - дэлгэцийн дээд хэсэгт */}
      {isAdded && (
        <div className="fixed top-[80px] left-1/2 transform -translate-x-1/2 z-[60] bg-black text-white px-4 py-2 rounded-md flex items-center gap-2 shadow-lg">
          <Check className="w-4 h-4" />
          <span className="text-sm">Food is being added to the cart!</span>
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <form>
          <DialogTrigger asChild>
            <Button variant="outline" className="">
              +
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[640px] max-w-[90vw] flex items-center p-6">
            <div className="grid gap-4 flex-1">
              <CldImage
                src={image}
                alt="food"
                width="300"
                height="300"
                crop="fill"
                className="w-full h-[300px] object-cover rounded-lg"
              />
            </div>

            <div className="flex flex-col gap-4 flex-1 pl-6">
              <div className="flex justify-between items-start">
                <DialogTitle className="text-red-500 text-xl font-semibold">
                  {foodName}
                </DialogTitle>
              </div>

              <div className="flex justify-between items-center gap-4">
                <p className="text-wrap text-sm text-gray-600 leading-relaxed">
                  {ingredients}
                </p>
              </div>

              <div className="flex flex-row justify-between items-center">
                <div className="gap-2">
                  <p className="text-wrap text-xs text-gray-500">Total price</p>
                  <span className="text-xl font-bold">
                    ${(foodCount * Number(price)).toFixed(2)}
                  </span>
                </div>
                <div className="flex gap-2 items-center">
                  <CircleMinus
                    size={28}
                    color="#000000"
                    strokeWidth={0.75}
                    onClick={handleMinusClick}
                    className="cursor-pointer hover:opacity-70"
                  />
                  <span className="text-lg font-semibold min-w-[20px] text-center">
                    {foodCount}
                  </span>
                  <CirclePlus
                    size={28}
                    color="#000000"
                    strokeWidth={0.75}
                    onClick={handleAddClick}
                    className="cursor-pointer hover:opacity-70"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 bg-black text-white hover:bg-gray-800"
                  onClick={handleAddToCart}
                >
                  Add to cart
                </Button>
              </div>
            </div>
          </DialogContent>
        </form>
      </Dialog>
    </>
  );
};
