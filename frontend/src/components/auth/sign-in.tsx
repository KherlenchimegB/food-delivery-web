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
import { useState, useContext, useEffect } from "react";
import { UserContext } from "@/context/userContext";

import { baseUrl } from "@/lib/utils";
import axios from "axios";

const signInSchema = yup.object({
  email: yup
    .string()
    .email("Invalid email. Use a format like example@email.com")
    .required("Please must enter your email"),
  password: yup
    .string()
    .min(6, "Incorrect password. Please try again")
    .required("Please must enter your password"),
});

type SignInFormData = yup.InferType<typeof signInSchema>;

export const SignInCard = ({ prefillEmail }: { prefillEmail?: string | null }) => {
  const router = useRouter();
  const { setUserInfo } = useContext(UserContext);
  const [isFormValid, setIsFormValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<SignInFormData>({
    resolver: yupResolver(signInSchema),
    mode: "onChange",
    defaultValues: {
      email: prefillEmail || "",
    },
  });

  // Form-ийн утгуудыг хянах
  const watchedFields = watch();
  const hasValidData = watchedFields.email && watchedFields.password;

  // prefillEmail өөрчлөгдөх үед form-г шинэчлэх
  useEffect(() => {
    if (prefillEmail) {
      setValue("email", prefillEmail);
    }
  }, [prefillEmail, setValue]);

  const onSubmit = async (formData: SignInFormData) => {
    try {
      const response = await axios.post(`${baseUrl}user/sign-in`, formData);
      
      // Token шалгах
      if (!response.data.token) {
        alert("Login failed: No token received");
        return;
      }
      
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("email", formData.email);
      
      // Role-ийг localStorage-д хадгалах
      const userRole = response.data.user?.role || "USER";
      localStorage.setItem("userRole", userRole);

      // UserInfo-г шинэчлэх (role мэдээлэлтэй)
      setUserInfo({
        email: formData.email,
        role: userRole,
      });

      // Role шалгаж, admin бол admin page рүү үсэрдэх
      if (userRole === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/");
      }

      return response.data.user;
    } catch (error) {
      throw new Error("Failed to fetch data");
    }
  };

  return (
    <div className="flex items-center justify-center w-2/5 h-full">
      <Card className="w-full max-w-sm bg-white shadow-lg">
        <CardHeader className="pb-6">
          <div className="flex items-center border border-gray-200 rounded-md w-fit cursor-pointer p-2 hover:bg-gray-50 transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </div>
          <CardTitle className="mt-6 text-2xl font-bold text-gray-900">
            Log in
          </CardTitle>
          <CardDescription className="text-gray-600 text-base">
            Log in to enjoy your favorite dishes.
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-6">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Input
                  {...register("email")}
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  className={`h-12 px-4 text-base border ${
                    errors.email
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-300 focus:border-gray-900"
                  } focus:ring-1 focus:ring-gray-900 rounded-lg transition-colors`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Input
                  {...register("password")}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className={`h-12 px-4 text-base border ${
                    errors.password
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-300 focus:border-gray-900"
                  } focus:ring-1 focus:ring-gray-900 rounded-lg transition-colors`}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
                
                {/* Show password checkbox */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <input 
                    type="checkbox" 
                    id="showPassword"
                    checked={showPassword}
                    onChange={(e) => setShowPassword(e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <label htmlFor="showPassword" className="cursor-pointer">
                    Show password
                  </label>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className={`w-full h-12 text-base font-medium rounded-lg transition-colors ${
                hasValidData
                  ? "bg-gray-900 text-white hover:bg-gray-800"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              disabled={!hasValidData}
            >
              Let's Go
            </Button>

            <div className="text-center">
              <Link
                href="reset-password"
                className="text-blue-600 text-sm underline-offset-4 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2 pt-0">
          <div className="flex items-center gap-2">
            <span className="text-gray-600 text-sm">
              Don't have an account?
            </span>
            <Link
              href="/user/sign-up"
              className="text-blue-600 text-sm hover:underline font-medium"
            >
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
