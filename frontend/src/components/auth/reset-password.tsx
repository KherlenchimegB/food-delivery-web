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

export function ForgotPassword({ onNext, onEmailChange }: { onNext: () => void; onEmailChange: (email: string) => void }) {
  const [inputEmail, setInputEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputEmail) return;

    setIsLoading(true);
    try {
      // Backend API call for password reset
      const response = await fetch(`${baseUrl}user/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: inputEmail }),
      });

      if (response.ok) {
        const data = await response.json();
        // Development-д token localStorage-д хадгалах
        if (data.resetToken) {
          localStorage.setItem('resetToken', data.resetToken);
        }
        // Email-г localStorage-д хадгалах (password reset дараа login page руу дамжуулах)
        localStorage.setItem('resetEmail', inputEmail);
        onEmailChange(inputEmail);
        onNext();
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

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
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@gmail.com"
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
            className={`w-full ${inputEmail ? "bg-black hover:bg-gray-800" : "bg-gray-300"}`}
            disabled={!inputEmail || isLoading}
            onClick={handleSubmit}
          >
            {isLoading ? "Sending..." : "Send link"}
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
export const VerifyEmail = ({ email, onNext, onBack }: { email: string; onNext: () => void; onBack: () => void }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleResendEmail = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${baseUrl}user/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.resetToken) {
          localStorage.setItem('resetToken', data.resetToken);
        }
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  // Development-д мэйл илгээхгүйгээр шууд next step руу шилжих
  const handleSkipEmailVerification = () => {
    onNext();
  };

  return (
    <div className="flex items-center justify-center w-2/5 h-full">
      <Card className="w-full max-w-sm ">
        <CardHeader>
          <div className="flex items-center border border-[#E4E4E7] rounded-md w-fit cursor-pointer p-2" onClick={onBack}>
            <ChevronLeft />
          </div>
          <CardTitle className="mt-[30px] text-[24px]">
            Please verify Your Email
          </CardTitle>
          <CardDescription>
            We just sent an email to {email}. Click the link in the email
            to verify your account.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex-col gap-2">
          <Button
            type="button"
            className="w-full bg-black hover:bg-gray-800"
            onClick={handleResendEmail}
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Resend email"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleSkipEmailVerification}
          >
            Skip email verification (Development)
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export function ResetPassword({ onBack }: { onBack: () => void }) {
  const [inputPassword, setInputPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (inputPassword !== confirmPassword) {
      return;
    }

    if (inputPassword.length < 6) {
      return;
    }

    setIsLoading(true);
    try {
      // Get token from URL or localStorage
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token') || localStorage.getItem('resetToken');
      
      if (!token) {
        alert("No reset token found. Please start the password reset process again.");
        return;
      }

      const response = await fetch(`${baseUrl}user/reset-password/confirm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          token,
          newPassword: inputPassword 
        }),
      });

      if (response.ok) {
        // Password reset successful
        localStorage.removeItem('resetToken');
        // Get email from token or localStorage
        const userEmail = localStorage.getItem('resetEmail') || 'user@example.com';
        localStorage.removeItem('resetEmail');
        // Redirect to sign in page with email parameter
        window.location.href = `/user/sign-in?email=${encodeURIComponent(userEmail)}`;
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = inputPassword && confirmPassword && inputPassword === confirmPassword && inputPassword.length >= 6;

  return (
    <div className="flex items-center justify-center w-2/5 h-full">
      <Card className="w-full max-w-sm ">
        <CardHeader>
          <div className="flex items-center border border-[#E4E4E7] rounded-md w-fit cursor-pointer p-2" onClick={onBack}>
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
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
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
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm"
                  required
                  onChange={(event) => {
                    setConfirmPassword(event.target.value);
                  }}
                  value={confirmPassword}
                />
              </div>

              <div className="flex items-center gap-2 text-[14px] text-[#71717A]">
                <input 
                  type="checkbox" 
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                />
                <span>Show password</span>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button 
            type="submit" 
            className={`w-full ${isFormValid ? "bg-black hover:bg-gray-800" : "bg-gray-300"}`}
            disabled={!isFormValid || isLoading}
            onClick={handleSubmit}
          >
            {isLoading ? "Creating..." : "Create password"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
