import { ChevronLeft } from "lucide-react";
import { useState } from "react";
// import Link from "next/link";
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
import { Label } from "@/components/ui/label";

import { baseUrl } from "@/lib/utils";

export function ForgotPassword() {
  const [inputEmail, setInputEmail] = useState("");

  return (
    <div className="flex items-center justify-center w-2/5 h-full">
      <Card className="w-full max-w-sm ">
        <CardHeader>
          <div className="flex items-center border border-[#E4E4E7] rounded-md w-fit cursor-pointer p-2">
            <ChevronLeft />
          </div>
          <CardTitle className="mt-[30px] text-[24px]">
            Reset your password
          </CardTitle>
          <CardDescription>
            Enter your email to receive a password reset link.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@gamil.com"
                  required
                  onChange={(event) => {
                    setInputEmail(event.target.value);
                  }}
                  value={inputEmail}
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button
            type="submit"
            className="w-full bg-gray-300"
            // onClick={() => createUser(user)}
          >
            Send link
          </Button>
          <div className="flex items-center">
            <span>Don't have an account?</span>
            <Button variant="link">Sign up</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
export const VerifyEmail = () => {
  const [inputEmail, setInputEmail] = useState("");
  const verifyUserEmail = (user: any) => {};
  return (
    <div className="flex items-center justify-center w-2/5 h-full">
      <Card className="w-full max-w-sm ">
        <CardHeader>
          <div className="flex items-center border border-[#E4E4E7] rounded-md w-fit cursor-pointer p-2">
            <ChevronLeft />
          </div>
          <CardTitle className="mt-[30px] text-[24px]">
            Please verify Your Email
          </CardTitle>
          <CardDescription>
            We just sent an email to Test@gmail.com. Click the link in the email
            to verify your account.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex-col gap-2">
          <Button
            type="submit"
            className="w-full "
            // onClick={() => verifyUserEmail(user)}
          >
            Resend email
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export function ResetPassword() {
  const [inputPassword, setInputPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isHide, setIsHide] = useState(false);

  function comparePassword(user: any): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="flex items-center justify-center w-2/5 h-full">
      <Card className="w-full max-w-sm ">
        <CardHeader>
          <div className="flex items-center border border-[#E4E4E7] rounded-md w-fit cursor-pointer p-2">
            <ChevronLeft />
          </div>
          <CardTitle className="mt-[30px] text-[24px]">
            Create new password
          </CardTitle>
          <CardDescription>
            Set a new password with a combination of letters and numbers for
            better security.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Input
                  id="password"
                  type="password"
                  placeholder="Password"
                  required
                  onChange={(event) => {
                    setInputPassword(event.target.value);
                  }}
                  value={inputPassword}
                />
              </div>
              <div className="grid gap-2">
                <Input
                  id="confirm"
                  type="password"
                  placeholder="Confirm"
                  required
                  onChange={(event) => {
                    setConfirmPassword(event.target.value);
                  }}
                  value={confirmPassword}
                />
              </div>

              <div className="flex items-center gap-2 text-[14px] text-[#71717A]">
                <input type="checkbox" />
                <span>Show password</span>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full bg-gray-300">
            Create password
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
