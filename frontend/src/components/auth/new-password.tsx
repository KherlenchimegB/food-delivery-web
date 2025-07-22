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
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const baseurl = "http://localhost:8000/";

const newPasSchema = yup.object({
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

type NewPassFormData = yup.InferType<typeof newPasSchema>;

export const NewPassword = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewPassFormData>({
    resolver: yupResolver(newPasSchema), // connect with yup validation
    mode: "onChange",
  });

  function comparePassword(user: any): void {
    throw new Error("Function not implemented.");
  }

  const onSubmit = async (formData: NewPassFormData) => {
    if (formData.password === formData.confirmPassword) {
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
        console.log("responseData", responseData);
      } catch (error) {
        console.log("error", error);
      }
    }
  };

  return (
    <div className="flex items-center justify-center w-2/5 h-full">
      <Card className="w-full max-w-sm ">
        <CardHeader>
          <CardTitle className="mt-[30px] text-[24px]">
            Create a strong password
          </CardTitle>
          <CardDescription>
            Create a strong password with letters, numbers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
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

              <div className="flex items-center gap-2 text-[14px] text-[#71717A]">
                <input type="checkbox" />
                <span>Show password</span>
              </div>
            </div>
            <Button type="submit" className="w-full bg-gray-300">
              Let's Go
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <div className="flex items-center">
            <span className="text-[#71717A]">Already have an account?</span>
            <Button variant="link" className="text-[#2563EB]">
              Log in
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
