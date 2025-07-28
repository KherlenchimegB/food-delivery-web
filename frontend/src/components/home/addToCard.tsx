"use client";

import * as React from "react";
import { CircleMinus, CirclePlus, ShoppingCart, CircleX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import {
  BadgeNotif,
  EmptyCard,
  OrderHistory,
  OrderPlacedCard,
} from "@/components/home/cardNotification";
import { CldImage } from "next-cloudinary";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { CartContext } from "@/context/cardContext";
import { Dispatch, SetStateAction } from "react";
import { useContext } from "react";
export const AddToCart = ({
  id,
  foodName,
  image,
  price,
  ingredients,
  userId,
  openCart,
  setOpenCart,
}: {
  id: string;
  image: string;
  foodName: string;
  price: number;
  ingredients: string;
  userId: string;
  openCart: boolean;
  setOpenCart: Dispatch<SetStateAction<boolean>>;
}) => {
  const [foodCount, setFoodCount] = useState(1);

  const handleAddClick = () => {
    setFoodCount((prevNumber) => prevNumber + 1);
  };
  const handleMinusClick = () => {
    if (foodCount > 0) setFoodCount((prevNumber) => prevNumber - 1);
  };
  const handleDeleteClick = () => {
    setFoodCount(0);
    console.log("delete daragdlaa");
  };
  const { cartItem } = useContext(CartContext);
  return (
    <Drawer direction="top" open={openCart} onOpenChange={setOpenCart}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-fit border rounded-full">
          <ShoppingCart color="#ff0000" strokeWidth={1.25} />
          {foodCount > 0 && (
            <div className="flex w-full flex-wrap gap-1">
              <BadgeNotif number={foodCount} />
            </div>
          )}
        </Button>
      </DrawerTrigger>

      <DrawerContent
        className=" outline-none w-[400px] flex p-2 inset-1 bg-black/90 gap-1"
        style={
          { "--initial-transform": "calc(100% + 8px)" } as React.CSSProperties
        }
      >
        <div className="mx-auto w-full">
          <DrawerHeader className="flex flex-row items-center justify-between">
            <ShoppingCart color="#ff0000" strokeWidth={1.25} />
            <DrawerDescription className="text-2xl font-bold">
              Order detail
            </DrawerDescription>
            <DrawerClose asChild>
              <Button variant="outline" className="w-fit  rounded-full ">
                X
              </Button>
            </DrawerClose>
          </DrawerHeader>
          <div className="flex w-full max-w-sm flex-col ">
            <Tabs defaultValue="cart" className="w-full h-full">
              <TabsList className="w-full">
                <TabsTrigger value="cart" className="w-1/2">
                  Cart
                </TabsTrigger>
                <TabsTrigger value="order" className="w-1/2">
                  Order
                </TabsTrigger>
              </TabsList>
              <TabsContent value="cart">
                <Card>
                  <CardHeader className="w-full">
                    <CardTitle className="text-2xl">My cart</CardTitle>
                  </CardHeader>
                  <div className="flex flex-col gap-1 p-2">
                    {foodCount > 0 && (
                      <div className="flex justify-between gap-2">
                        <CldImage
                          src={image}
                          alt="food"
                          width="100"
                          height="100"
                          crop="fill"
                          className="border-none rounded-md"
                        />
                        <div className="flex flex-col justify-between space-y-0">
                          <div className="flex justify-between">
                            <p className="text-red-500">{foodName}</p>
                            <CircleX
                              size={20}
                              color="#ff0000"
                              strokeWidth={1}
                              onClick={handleDeleteClick}
                            />
                          </div>
                          <div className="flex justify-between items-center gap-4">
                            <p className="text-wrap text-xs ">{ingredients}</p>
                          </div>
                          <div className="flex flex-row justify-between">
                            <div className="flex gap-2.5 text-xl font-bold">
                              <CircleMinus
                                size={28}
                                color="#000000"
                                strokeWidth={0.5}
                                onClick={handleMinusClick}
                              />
                              <span>{foodCount}</span>
                              <CirclePlus
                                size={28}
                                color="#000000"
                                strokeWidth={0.5}
                                onClick={handleAddClick}
                              />
                            </div>
                            <div className="gap-2">
                              <span className="text-xl font-bold">
                                {new Intl.NumberFormat("mn-MN", {
                                  style: "currency",
                                  currency: "MNT",
                                }).format(foodCount * price)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <Separator className="my-1" />

                    {foodCount > 0 && (
                      <div className=" gap-1">
                        <p className="text-2xl">Delivery location</p>
                        <textarea
                          rows={3}
                          className="border border-gray-200 bg-white w-full resize-none rounded-lg  pt-2.5 text-gray-900 outline-none focus:ring-2 focus:ring-black/5 focus:ring-offset-0"
                          placeholder="Please share your complete address"
                        />
                      </div>
                    )}
                    {foodCount === 0 && <EmptyCard />}
                  </div>
                  <DrawerFooter>
                    <p>Payment info</p>
                    <div className="flex justify-between">
                      <p>Items</p>
                      <div className="gap-2">
                        <span className="text-xl font-bold">
                          {new Intl.NumberFormat("mn-MN", {
                            style: "currency",
                            currency: "MNT",
                          }).format(foodCount * price)}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <p>Total</p>
                      <div className="gap-2">
                        <span className="text-xl font-bold">
                          {new Intl.NumberFormat("mn-MN", {
                            style: "currency",
                            currency: "MNT",
                          }).format(foodCount * price)}
                        </span>
                      </div>
                    </div>

                    <DrawerClose asChild onClick={handleDeleteClick}>
                      <OrderPlacedCard />
                    </DrawerClose>
                  </DrawerFooter>
                </Card>
              </TabsContent>
              <TabsContent value="order">
                <Card>
                  <CardHeader>
                    <CardTitle>Order history</CardTitle>
                    <CardDescription>Order history</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-6">
                    <OrderHistory price={25000} status={"PENDING"} orderId="" />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
