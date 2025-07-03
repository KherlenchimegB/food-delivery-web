"use client";
import {
  ForgotPassword,
  VerifyEmail,
  ResetPassword,
} from "@/components/components/reset-password";
import { useState } from "react";

export default function Home() {
  const [step, setStep] = useState(1);
  return (
    <div className="flex w-screen h-screen">
      {step === 1 && <ForgotPassword />}

      {step === 2 && <VerifyEmail />}

      {step === 3 && <ResetPassword />}

      <div className="flex justify-center h-full p-5">
        <img
          src="./signup-home.png"
          alt="homepicture"
          className="flex h-full rounded-md "
        />
      </div>
    </div>
  );
}
