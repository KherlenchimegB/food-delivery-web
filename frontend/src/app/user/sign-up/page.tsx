"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { yupResolver } from "@hookform/resolvers/yup";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const baseurl = "http://localhost:8000/";

const signUpSchema = yup.object({
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Please must enter your email"),
  password: yup
    .string()
    .min(6, "Please enter 6 characters long password")
    .required("Please must enter your password"),
  confirmPassword: yup
    .string()
    .min(6, "Please enter 6 characters long password")
    .required("Please must enter your password"),
});

type SignUpFormData = yup.InferType<typeof signUpSchema>; // typescript utility type

export default function SignUpPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: yupResolver(signUpSchema), // connect with yup validation
    mode: "onChange",
  });

  const onSubmit = async (formData: SignUpFormData) => {
    try {
      const response = await fetch(`${baseurl}user/sign-up`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const responseData = await response.json();
      router.push("/");
    } catch (error) {
      console.log("error", error);
    }
  };

  const onBack = () => router.push("/");
  const onSignIn = () => router.push("/user/sign-in");

  return (
    <div className="flex w-screen h-screen">
      <div className="flex items-center justify-center w-2/5 h-full">
        <Card className="w-full max-w-sm ">
          <CardHeader>
            <div className="flex items-center border border-[#E4E4E7] rounded-md w-fit cursor-pointer p-2">
              <ChevronLeft onClick={onBack} />
            </div>
            <CardTitle className="mt-[30px] text-[24px]">
              Create your account
            </CardTitle>
            <CardDescription>
              Sign up to explore your favorite dishes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    required
                    {...register("email")}
                    className={`${
                      errors.email ? " border border-red-400" : ""
                    }`}
                  />
                </div>
                <div className="grid gap-2">
                  <Input
                    {...register("password")}
                    id="password"
                    type="password"
                    placeholder="Password"
                    required
                    className={`${
                      errors.password ? " border border-red-400" : ""
                    }`}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs">
                      {errors.password.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Input
                    {...register("confirmPassword")}
                    id="confirm"
                    type="password"
                    placeholder="Confirm"
                    required
                    className={`${
                      errors.confirmPassword ? " border border-red-400" : ""
                    }`}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs">
                      {errors.confirmPassword?.message}
                    </p>
                  )}
                </div>
              </div>
              <Button type="submit" className="w-full bg-gray-300">
                Let's Go
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <div className="flex items-center">
              <span>Already have an account?</span>
              <Button
                variant="link"
                onClick={onSignIn}
                className="mouse-pointer"
              >
                Log in
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>

      <div className="flex justify-center h-full p-5">
        <img
          src="../signup-home.png"
          alt="homepicture"
          className="flex h-full rounded-md "
        />
      </div>
    </div>
  );
}
