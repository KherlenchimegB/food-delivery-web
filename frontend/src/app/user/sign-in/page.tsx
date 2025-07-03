"use client";
import { SignInCard } from "@/components/sign-in";

export default function Home() {
  return (
    <div className="flex w-screen h-screen">
      <SignInCard />
      <div className="flex justify-center h-full p-5">
        <img
          src="../signup-home.png"
          alt="homepicture"
          className="flex h-full rounded-md "
        />
      </div>
    </div>
  );
}
