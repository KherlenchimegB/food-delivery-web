"use client";
import { SignUpCard } from "@/components/components/sign-up";

export default function Home() {
  return (
    <div className="flex w-screen h-screen">
      <SignUpCard />
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
