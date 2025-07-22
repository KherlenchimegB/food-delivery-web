"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";

const baseurl = "http://localhost:8000/";

const signInSchema = yup.object({
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Please must enter your email"),
  password: yup
    .string()
    .min(6, "Please enter 6 characters long password")
    .required("Please must enter your password"),
});

type SignInFormData = yup.InferType<typeof signInSchema>; // typescript utility type

export const SignInCard = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: yupResolver(signInSchema), // connect with yup validation
    mode: "onChange",
  });

  const onSubmit = async (formData: SignInFormData) => {
    try {
      const response = await fetch(`${baseurl}user/sign-in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const responseData = await response.json();
      router.push("/");
      console.log("responseData", responseData);
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div className="flex items-center justify-center w-2/5 h-full">
      <Card className="w-full max-w-sm ">
        <CardHeader>
          <div className="flex items-center border border-[#E4E4E7] rounded-md w-fit cursor-pointer p-2">
            <ChevronLeft />
          </div>
          <CardTitle className="mt-[30px] text-[24px]">Log in</CardTitle>
          <CardDescription>
            Log in to enjoy your favorite dishes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Input
                  {...register("email")}
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  className={`${errors.email ? " border border-red-400" : ""}`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500">{errors.email.message}</p>
              )}
              <div className="grid gap-2">
                <Input
                  {...register("password")}
                  id="password"
                  type="password"
                  placeholder="Password"
                />
              </div>
              {errors.password && (
                <p className="text-red-500">{errors.password.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full bg-gray-300">
              Let's Go
            </Button>
            <Link
              href="reset-password"
              className=" text-sm underline-offset-4 hover:underline text-[#71717A]"
            >
              Forgot password?
            </Link>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[#71717A]">Don't have an account?</span>
            <Link href="/user/sign-up" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
