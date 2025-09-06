"use client";
import {
  ForgotPassword,
  VerifyEmail,
  ResetPassword,
} from "@/components/auth/reset-password";
import { useState } from "react";

export default function Home() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  
  return (
    <div className="flex w-screen h-screen">
      {step === 1 && <ForgotPassword onNext={() => setStep(2)} onEmailChange={setEmail} />}

      {step === 2 && <VerifyEmail email={email} onNext={() => setStep(3)} onBack={() => setStep(1)} />}

      {step === 3 && <ResetPassword onBack={() => setStep(2)} />}

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
