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
import { useState, useContext } from "react";
import { UserContext } from "@/context/userContext";
import * as yup from "yup";

import { baseUrl } from "@/lib/utils";

const signUpSchema = yup.object({
  email: yup
    .string()
    .email("Invalid email. Use a format like example@email.com")
    .required("Please must enter your email"),
  password: yup
    .string()
    .min(6, "Please enter 6 characters long password")
    .required("Please must enter your password"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
});

type SignUpFormData = yup.InferType<typeof signUpSchema>;

export default function SignUpPage() {
  const router = useRouter();
  const { setUserInfo } = useContext(UserContext);
  const [isFormValid, setIsFormValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<SignUpFormData>({
    resolver: yupResolver(signUpSchema),
    mode: "onChange",
  });

  // Form-ийн утгуудыг хянах
  const watchedFields = watch();
  const hasValidData =
    watchedFields.email &&
    watchedFields.password &&
    watchedFields.confirmPassword &&
    isValid;

  const onSubmit = async (formData: SignUpFormData) => {
    try {
      const response = await fetch(`${baseUrl}user/sign-up`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const responseData = await response.json();

      // Email localStorage-д хадгалах
      localStorage.setItem("email", formData.email);
      
      // Role-ийг localStorage-д хадгалах (sign-up-д USER role байна)
      localStorage.setItem("userRole", "USER");

      // UserInfo-г шинэчлэх
      setUserInfo({ email: formData.email, role: "USER" });

      router.push("/");
    } catch (error) {
    }
  };

  const onBack = () => router.push("/");
  const onSignIn = () => router.push("/user/sign-in");

  return (
    <div className="flex w-screen h-screen bg-gray-50">
      {/* Зүүн тал - Sign-up form */}
      <div className="flex items-center justify-center w-2/5 h-full">
        <Card className="w-full max-w-sm bg-white shadow-lg">
          <CardHeader className="pb-6">
            <div className="flex items-center border border-gray-200 rounded-md w-fit cursor-pointer p-2 hover:bg-gray-50 transition-colors">
              <ChevronLeft onClick={onBack} className="w-4 h-4" />
            </div>
            <CardTitle className="mt-6 text-2xl font-bold text-gray-900">
              Create your account
            </CardTitle>
            <CardDescription className="text-gray-600 text-base">
              Sign up to explore your favorite dishes.
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-6">
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    required
                    {...register("email")}
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
                    required
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

                <div className="space-y-2">
                  <Input
                    {...register("confirmPassword")}
                    id="confirm"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm password"
                    required
                    className={`h-12 px-4 text-base border ${
                      errors.confirmPassword
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-300 focus:border-gray-900"
                    } focus:ring-1 focus:ring-gray-900 rounded-lg transition-colors`}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                  
                  {/* Show confirm password checkbox */}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <input 
                      type="checkbox" 
                      id="showConfirmPassword"
                      checked={showConfirmPassword}
                      onChange={(e) => setShowConfirmPassword(e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <label htmlFor="showConfirmPassword" className="cursor-pointer">
                      Show confirm password
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
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-2 pt-0">
            <div className="flex items-center gap-2">
              <span className="text-gray-600 text-sm">
                Already have an account?
              </span>
              <Button
                variant="link"
                onClick={onSignIn}
                className="text-blue-600 text-sm hover:underline font-medium p-0 h-auto"
              >
                Log in
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Баруун тал - Background зураг */}
      <div className="flex-1 flex justify-center items-center p-8">
        <div className="relative w-full h-full max-w-2xl">
          <img
            src="/signup-home.png"
            alt="Delivery person with food bag"
            className="w-full h-full object-cover rounded-2xl shadow-2xl"
          />
        </div>
      </div>
    </div>
  );
}
