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
import { useState, useEffect } from "react";

const baseurl = "http://localhost:8000/";

export function NewPassword() {
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
          <CardTitle className="mt-[30px] text-[24px]">
            Create a strong password
          </CardTitle>
          <CardDescription>
            Create a strong password with letters, numbers.
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
                <span
                // onChange={inputPassword.type === "password"?  }
                >
                  Show password
                </span>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button
            type="submit"
            className="w-full bg-gray-300"
            // onClick={() => comparePassword(user)}
          >
            Let's Go
          </Button>
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
}
