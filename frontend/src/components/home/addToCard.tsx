"use client";

import * as React from "react";
import {
  CircleMinus,
  CirclePlus,
  ShoppingCart,
  CircleX,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useState, useContext } from "react";
import {
  BadgeNotif,
  EmptyCard,
  OrderHistory,
  OrderPlacedCard,
} from "@/components/home/cardNotification";
import { CldImage } from "next-cloudinary";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { CartContext } from "@/context/cardContext";
import { UserContext } from "@/context/userContext";
import { Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";
import { baseUrl } from "@/lib/utils";

export const AddToCart = ({
  openCart,
  setOpenCart,
  deliveryAddress,
  setDeliveryAddress,
}: {
  openCart: boolean;
  setOpenCart: Dispatch<SetStateAction<boolean>>;
  deliveryAddress: string;
  setDeliveryAddress: Dispatch<SetStateAction<string>>;
}) => {
  const {
    cartItems,
    removeCartItem,
    updateQuantity,
    getTotalPrice,
    getTotalItems,
    clearCart,
  } = useContext(CartContext);

  const { userInfo } = useContext(UserContext);
  const router = useRouter();
  const [orderHistory, setOrderHistory] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  // const [deliveryAddress, setDeliveryAddress] = useState(""); // Removed - now passed as props

  // Cart-аас item хасах функц
  const handleDeleteClick = (itemId: string) => {
    removeCartItem(itemId);
  };

  // Quantity нэмэх функц
  const handleAddClick = (itemId: string, currentQuantity: number) => {
    updateQuantity(itemId, currentQuantity + 1);
  };

  // Quantity хасах функц
  const handleMinusClick = (itemId: string, currentQuantity: number) => {
    updateQuantity(itemId, currentQuantity - 1);
  };

  // Order placed функц
  const handleOrderPlaced = () => {
    clearCart();
    setOpenCart(false);
  };

  // User-ийн order history татах
  const fetchOrderHistory = async () => {
    if (!userInfo?.email) return;

    try {
      setLoadingOrders(true);
      const response = await fetch(`${baseUrl}food-order/`);

      if (response.ok) {
        const data = await response.json();
        // Зөвхөн тухайн user-ийн order-уудыг filter хийх
        const userOrders = data.data.filter(
          (order: any) => order.user?.email === userInfo.email
        );
        setOrderHistory(userOrders);
      }
    } catch (error) {
      console.error("Error fetching order history:", error);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Cart drawer нээгдэх үед order history татах
  React.useEffect(() => {
    if (openCart && userInfo?.email) {
      fetchOrderHistory();
    }
  }, [openCart, userInfo?.email]);

  // Login alert харуулах
  const showLoginAlert = () => {
    return (
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
    );
  };

  return (
    <>
      {/* Login Alert */}
      {openCart && userInfo.email === "" && showLoginAlert()}

      <Drawer open={openCart} onOpenChange={setOpenCart} direction="right">
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            className="w-fit border rounded-full relative p-3"
          >
            <ShoppingCart
              color="#ff0000"
              strokeWidth={1.25}
              className="w-6 h-6"
            />
            {getTotalItems() > 0 && (
              <div className="absolute -top-2 -right-2">
                <BadgeNotif number={getTotalItems()} />
              </div>
            )}
          </Button>
        </DrawerTrigger>
        <DrawerContent className="h-screen">
          <DrawerHeader className="w-full flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart
                  color="#ff0000"
                  strokeWidth={1.25}
                  className="w-6 h-6"
                />
                <DrawerDescription className="text-2xl font-bold">
                  Order detail
                </DrawerDescription>
              </div>
              <DrawerClose asChild>
                <Button variant="ghost" size="icon">
                  <X className="h-4 w-4" />
                </Button>
              </DrawerClose>
            </div>
          </DrawerHeader>

          <div className="flex w-full flex-col flex-1 overflow-hidden">
            <Tabs defaultValue="cart" className="w-full h-full flex flex-col">
              <TabsList className="w-full bg-gray-200 flex-shrink-0">
                <TabsTrigger
                  value="cart"
                  className="w-1/2 text-black data-[state=active]:bg-white"
                >
                  Cart
                </TabsTrigger>
                <TabsTrigger
                  value="order"
                  className="w-1/2 text-black data-[state=active]:bg-white"
                >
                  Order
                </TabsTrigger>
              </TabsList>

              <TabsContent value="cart" className="flex-1 overflow-y-auto">
                <Card className="bg-white/95 h-full flex flex-col py-2">
                  <div className="w-full flex-shrink-0 px-4">
                    <p className="text-2xl font-bold mb-0">My cart</p>
                  </div>

                  <div className="flex flex-col gap-1 px-4 flex-1 overflow-y-auto">
                    {cartItems.length > 0 ? (
                      cartItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between gap-2 p-3 bg-gray-50 rounded-lg"
                        >
                          <CldImage
                            src={item.image}
                            alt="food"
                            width="100"
                            height="100"
                            crop="fill"
                            className="border-none rounded-md w-[80px] h-[80px] object-cover"
                          />
                          <div className="flex flex-col justify-between space-y-0 flex-1">
                            <div className="flex justify-between">
                              <p className="text-red-500 font-semibold">
                                {item.foodName}
                              </p>
                              <CircleX
                                size={20}
                                color="#ff0000"
                                strokeWidth={1}
                                onClick={() => handleDeleteClick(item.id)}
                                className="cursor-pointer hover:opacity-70"
                              />
                            </div>
                            <div className="flex justify-between items-center gap-4">
                              <p className="text-wrap text-xs text-gray-600">
                                {item.ingredients}
                              </p>
                            </div>
                            <div className="flex flex-row justify-between items-center">
                              <div className="flex gap-2.5 text-xl font-bold items-center">
                                <CircleMinus
                                  size={28}
                                  color="#000000"
                                  strokeWidth={0.5}
                                  onClick={() =>
                                    handleMinusClick(item.id, item.quantity)
                                  }
                                  className="cursor-pointer hover:opacity-70"
                                />
                                <span className="min-w-[20px] text-center">
                                  {item.quantity}
                                </span>
                                <CirclePlus
                                  size={28}
                                  color="#000000"
                                  strokeWidth={0.5}
                                  onClick={() =>
                                    handleAddClick(item.id, item.quantity)
                                  }
                                  className="cursor-pointer hover:opacity-70"
                                />
                              </div>
                              <div className="gap-2">
                                <span className="text-xl font-bold">
                                  {new Intl.NumberFormat("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                  }).format(item.quantity * item.price)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <EmptyCard />
                    )}

                    {cartItems.length > 0 && (
                      <div className="gap-1">
                        <p className="text-2xl font-semibold mb-2 mt-0">
                          Delivery location
                        </p>
                        <textarea
                          rows={3}
                          className="border border-gray-200 bg-white w-full resize-none rounded-lg pt-2.5 text-gray-900 outline-none focus:ring-2 focus:ring-black/5 focus:ring-offset-0"
                          placeholder="Please share your complete address"
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                        />
                      </div>
                    )}
                  </div>

                  <div className="bg-gray-50 p-4 rounded-b-lg flex-shrink-0">
                    <p className="font-semibold mb-2">Payment info</p>
                    <div className="flex justify-between mb-1">
                      <p className="text-gray-600">Items</p>
                      <div className="gap-2">
                        <span className="text-xl font-bold">
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                          }).format(getTotalPrice())}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between mb-1">
                      <p className="text-gray-600">Shipping</p>
                      <div className="gap-2">
                        <span className="text-xl font-bold">$0.99</span>
                      </div>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <p className="font-semibold">Total</p>
                      <div className="gap-2">
                        <span className="text-xl font-bold">
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                          }).format(getTotalPrice() + 0.99)}
                        </span>
                      </div>
                    </div>

                    {cartItems.length > 0 && (
                      <OrderPlacedCard deliveryAddress={deliveryAddress} />
                    )}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="order" className="flex-1 overflow-y-auto">
                <Card className="bg-white/95 h-full">
                  <CardHeader>
                    <CardTitle>Order History</CardTitle>
                    <CardDescription>Order history</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-6 overflow-y-auto">
                    {loadingOrders ? (
                      <div className="text-center py-4">
                        <p className="text-gray-500">
                          Loading order history...
                        </p>
                      </div>
                    ) : orderHistory.length > 0 ? (
                      orderHistory.map((order: any) => (
                        <OrderHistory
                          key={order._id}
                          price={order.foodOrderItems.reduce(
                            (total: number, item: any) =>
                              total + item.food.price * item.quantity,
                            0
                          )}
                          status={order.status}
                          orderId={`ORDER #${order._id
                            .slice(-8)
                            .toUpperCase()}`}
                          orderDate={new Date(
                            order.createdAt
                          ).toLocaleDateString()}
                          foodItems={order.foodOrderItems.map((item: any) => ({
                            name: item.food.foodName,
                            quantity: item.quantity,
                          }))}
                        />
                      ))
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-gray-500">No order history found</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};
