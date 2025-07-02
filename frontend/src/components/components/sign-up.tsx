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

export function SignUpCard() {
  const [inputEmail, setInputEmail] = useState("");

  const createUser = async (user: any) => {
    try {
      const response = await fetch(`${baseurl}user/sign-up`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      const responseData = await response.json();

      console.log("responseData", responseData);
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div className="flex items-center justify-center w-2/5 h-full">
      <Card className="w-full max-w-sm ">
        <CardHeader>
          <CardTitle className="mt-[30px] text-[24px]">
            Create your account
          </CardTitle>
          <CardDescription>
            Sign up to explore your favorite dishes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
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
            Let's Go
          </Button>
          <div className="flex items-center">
            <span>Already have an account?</span>
            <Button variant="link">Log in</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
