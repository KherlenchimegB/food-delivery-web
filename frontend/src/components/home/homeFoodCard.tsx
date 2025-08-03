import { FoodDetails } from "./foodDetails";
import Image from "next/image";
import { UpdateDishButton } from "../admin/updateFood/updateFoodButton";
import { useContext, useState } from "react";
import { CartContext } from "@/context/cardContext";
import { UserContext } from "@/context/userContext";
import { Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Check as CheckIcon, CircleMinus, CirclePlus } from "lucide-react";
import { CldImage } from "next-cloudinary";
import { useRouter } from "next/navigation";

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
  const { cartItems, addToCart } = useContext(CartContext);
  const { userInfo } = useContext(UserContext);
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [foodCount, setFoodCount] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [showLoginAlert, setShowLoginAlert] = useState(false);

  // Тухайн хоол сагсанд байгаа эсэхийг шалгах
  const isInCart = cartItems.some((item) => item.id === id);

  const handleAddToCart = () => {
    // Хэрэглэгч нэвтрээгүй байвал login шаардлагатай
    if (userInfo.email === "") {
      setShowLoginAlert(true);
      setTimeout(() => {
        setShowLoginAlert(false);
      }, 3000);
      return;
    }

    // Modal нээх
    setIsOpen(true);
  };

  const handleAddClick = () => {
    setFoodCount((prevNumber) => prevNumber + 1);
  };

  const handleMinusClick = () => {
    if (foodCount > 0) setFoodCount((prevNumber) => prevNumber - 1);
  };

  const handleModalAddToCart = () => {
    addToCart({
      id: id,
      foodName: foodName,
      price: price,
      image: image,
      ingredients: ingredients,
      userId: "user123",
    });

    setIsAdded(true);
    setIsOpen(false);

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

      {/* Success Notification */}
      {isAdded && (
        <div className="fixed top-[80px] left-1/2 transform -translate-x-1/2 z-[60] bg-black text-white px-4 py-2 rounded-md flex items-center gap-2 shadow-lg">
          <CheckIcon className="w-4 h-4" />
          <span className="text-sm">Food is being added to the cart!</span>
        </div>
      )}

      <div className="w-auto p-6 bg-white shadow-lg border rounded-xl m-[20px] gap-5 hover:shadow-xl transition-shadow">
        <div className="w-full h-auto gap-5 border-none rounded-md relative">
          <div className="aspect-[4/3] relative overflow-hidden rounded-t-2xl mb-4">
            <Image
              src={image}
              alt="food"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Add to cart button - зурган дээр байрлуулсан */}
            <div className="absolute bottom-2 right-2 z-10">
              {isInCart ? (
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </div>
              ) : (
                isHome && (
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-8 h-8 bg-white text-red-500 hover:bg-gray-100 border-0 rounded-full"
                    onClick={handleAddToCart}
                  >
                    <Plus className="w-5 h-5" />
                  </Button>
                )
              )}
            </div>

            {/* Update button - зурган дээр баруун дээд буланд байрлуулсан */}
            {!isHome && (
              <div className="absolute top-2 right-2 z-10">
                <UpdateDishButton
                  id={id}
                  image={image}
                  foodName={foodName}
                  price={price}
                  ingredients={ingredients}
                  categoryName={categoryName}
                />
              </div>
            )}
          </div>

          <div className="flex justify-between items-center mb-2">
            <span className="text-red-500 font-semibold text-lg">
              {foodName}
            </span>
            <span className="font-bold text-lg">${price.toFixed(2)}</span>
          </div>

          <p className="text-wrap text-sm text-gray-600 leading-relaxed mb-4">
            {ingredients}
          </p>
        </div>
      </div>

      {/* Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
                onClick={handleModalAddToCart}
              >
                Add to cart
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
