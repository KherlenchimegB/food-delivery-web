import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, useContext } from "react";
import { CartContext } from "@/context/cardContext";
import { UserContext } from "@/context/userContext";
import { useRouter } from "next/navigation";
import axios from "axios";
import { baseUrl } from "@/lib/utils";
import { toast } from "sonner";

export const BadgeNotif = ({ number }: { number: number }) => {
  return (
    <Badge className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center p-0">
      {number > 99 ? "99+" : number}
    </Badge>
  );
};

export const EmptyCard = () => {
  return (
    <div className="w-full h-fit flex flex-col items-center justify-center py-8">
      <img
        src="/logos/home-logo.png"
        alt="logo"
        className="w-[30px] h-[30px] mb-4"
      />
      <p className="text-2xl font-bold mb-2">Your cart is empthy</p>
      <p className="text-sm text-gray-600 text-center max-w-[200px]">
        Add some delicious dishes to your cart and satisfy your cravings!
      </p>
    </div>
  );
};

export const OrderPlacedCard = ({
  deliveryAddress,
  setOpenCart,
}: {
  deliveryAddress: string;
  setOpenCart?: (open: boolean) => void;
}) => {
  const router = useRouter();
  const { clearCart, cartItems, getTotalPrice } = useContext(CartContext);
  const { userInfo } = useContext(UserContext);
  // const [isOpen, setIsOpen] = useState(false); // Dialog арилгасан тул ашиглахгүй
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    // Хэрэглэгч нэвтрээгүй бол sign-in хуудас руу үсэрдэг
    if (userInfo.email === "") {
      router.push("/user/sign-in");
      return;
    }

    // Delivery address шалгах
    if (!deliveryAddress.trim()) {
      toast.error("Please enter delivery address", {
        description: "Delivery address is required to place an order.",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Order data бэлтгэх
      const orderData = {
        user: userInfo.email,
        foodOrderItems: cartItems.map((item) => ({
          food: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        totalPrice: getTotalPrice() + 0.99, // Shipping cost нэмэх
        status: "PENDING",
        deliveryAddress: deliveryAddress.trim(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Backend рүү order илгээх
      const token = localStorage.getItem("token");

      const response = await axios.post(`${baseUrl}food-order/`, orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.success) {
        // Cart цэвэрлэх
        clearCart();
        
        // Success toast notification харуулах
        toast.success("Order placed successfully!", {
          description: "Your order has been received and will be delivered soon.",
          duration: 3000,
        });
        
        // Cart dialog хаах
        if (setOpenCart) {
          setOpenCart(false);
        }
        
        // Order амжилттай үүссэний дараа role-оос хамааран үсэрдэг
        setTimeout(() => {
          if (userInfo.role === "ADMIN") {
            router.push("/admin");
          } else {
            router.push("/");
          }
        }, 1500); // 1.5 секунд хүлээгээд үсэрдэг
      } else {
        toast.error("Order failed", {
          description: "Please try again.",
        });
      }
    } catch (error: any) {
      if (error.response) {
        toast.error("Order failed", {
          description: error.response.data.message || "Please try again.",
        });
      } else {
        toast.error("Order failed", {
          description: "Please try again.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Dialog-г арилгаж, зөвхөн toast notification ашиглах
  // const handleBackToHome = () => {
  //   setIsOpen(false);
  //   router.push("/");
  // };

  return (
    <>
      <Button
        variant="outline"
        className="bg-red-500 text-white rounded-[24px] hover:bg-red-600 transition-colors w-full"
        onClick={handleCheckout}
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : "Checkout"}
      </Button>

      {/* Success dialog-г арилгаж, зөвхөн toast notification ашиглах */}
      {/* <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md flex flex-col items-center p-8">
          <DialogHeader className="text-center">
            <DialogTitle className="text-2xl font-bold mb-4">
              Your order has been successfully placed!
            </DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="w-32 h-32 bg-red-500 rounded-full flex items-center justify-center relative">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0.5 h-8 bg-gray-400"></div>
              </div>
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                  <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="sm:justify-center w-full">
            <Button
              type="button"
              variant="secondary"
              className="w-full bg-gray-200 text-black hover:bg-gray-300"
              onClick={handleBackToHome}
            >
              Back to home
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
    </>
  );
};

export const OrderHistory = ({
  price,
  status,
  orderId,
  orderDate,
  foodItems,
}: {
  price: number;
  status: string;
  orderId: string;
  orderDate?: string;
  foodItems?: { name: string; quantity: number }[];
}) => {
  return (
    <div className="w-full p-4 bg-gray-50 rounded-lg border">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <p className="font-bold text-lg">${price.toFixed(2)}</p>
          <p className="text-gray-600 text-sm">{orderId}</p>
          {orderDate && (
            <p className="text-xs text-gray-500">{orderDate}</p>
          )}
          {foodItems && foodItems.length > 0 && (
            <p className="text-sm text-gray-500">
              {foodItems[0].name} x{foodItems[0].quantity}
              {foodItems.length > 1 && ` +${foodItems.length - 1} more`}
            </p>
          )}
        </div>
        <button
          className={`px-3 py-1 rounded-md text-sm font-medium ${
            status === "DELIVERED"
              ? "bg-green-100 text-green-800"
              : status === "PENDING"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {status}
        </button>
      </div>
    </div>
  );
};
