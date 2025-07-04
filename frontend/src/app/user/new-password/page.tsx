"use client";
import { NewPassword } from "@/components/auth/new-password";

export default function Home() {
  return (
    <div className="flex w-screen h-screen">
      <NewPassword />
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
