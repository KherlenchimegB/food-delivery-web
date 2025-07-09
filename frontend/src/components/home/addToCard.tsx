"use client";

import * as React from "react";
import { CircleMinus, CirclePlus, ShoppingCart } from "lucide-react";
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

export const AddToCart = ({
  id,
  foodName,
  image,
  price,
  ingredients,
  userId,
}: {
  id: String;
  image: string;
  foodName: String;
  price: Number;
  ingredients: String;
  userId: String;
}) => {
  const [foodCount, setFoodCount] = useState(1);

  const handleAddClick = () => {
    setFoodCount((prevNumber) => prevNumber + 1);
  };
  const handleMinusClick = () => {
    if (foodCount > 0) setFoodCount((prevNumber) => prevNumber - 1);
  };
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-fit border rounded-full">
          <ShoppingCart color="#ff0000" strokeWidth={1.25} />
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <div className="mx-auto w-[600px]">
          <DrawerHeader className="flex flex-row items-center gap-10">
            <ShoppingCart color="#ff0000" strokeWidth={1.25} />
            <DrawerDescription>Order detail</DrawerDescription>
            <DrawerClose asChild>
              <Button
                variant="outline"
                className="w-fit border-black rounded-full "
              >
                X
              </Button>
            </DrawerClose>
          </DrawerHeader>
          <div className="flex w-full max-w-sm flex-col gap-6">
            <Tabs defaultValue="cart">
              <TabsList>
                <TabsTrigger value="cart" className="w-1/2">
                  Cart
                </TabsTrigger>
                <TabsTrigger value="Order" className="w-1/2">
                  Order
                </TabsTrigger>
              </TabsList>
              <TabsContent value="cart">
                <Card>
                  <CardHeader className="w-full">
                    <CardTitle>My cart</CardTitle>
                  </CardHeader>
                  {/* <CardContent className="grid gap-6">
               
                  </CardContent> */}
                  <div className="flex flex-col gap-4">
                    <p className="text-red-500">{foodName}</p>
                    <div className="flex justify-between items-center gap-4">
                      <p className="text-wrap text-xs ">{ingredients}</p>
                    </div>
                    <div className="flex flex-row justify-between">
                      <div className="gap-2">
                        <p className="text-wrap text-xs">Total price</p>
                        <span>
                          {new Intl.NumberFormat("mn-MN", {
                            style: "currency",
                            currency: "MNT",
                          }).format(foodCount * price)}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <CircleMinus
                        size={28}
                        color="#000000"
                        strokeWidth={0.75}
                        onClick={handleMinusClick}
                      />
                      <span>{foodCount}</span>
                      <CirclePlus
                        size={28}
                        color="#000000"
                        strokeWidth={0.75}
                        onClick={handleAddClick}
                      />
                    </div>
                  </div>
                  <DrawerFooter>
                    <p>Payment info</p>

                    <Button className="bg-red-500 text-white rounded-[24px]">
                      Checkout
                    </Button>
                  </DrawerFooter>
                </Card>
              </TabsContent>
              <TabsContent value="Order">
                <Card>
                  <CardHeader>
                    <CardTitle>Order history</CardTitle>
                    <CardDescription>Order history</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-6">
                    <OrderHistory price={25000} status={"PENDING"} />
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
export const OrderHistory = ({
  price,
  status,
  orderId,
}: {
  price: number;
  status: string;
  orderId: string;
}) => {
  return (
    <div className="w-full m-2.5">
      <div className="flex justify-between items-center">
        <div className="flex gap-5 font-bold">
          <p>{price}</p>
          <p>({orderId})</p>
        </div>
        <button className="border rounded-md ">{status}</button>
      </div>
    </div>
  );
};
