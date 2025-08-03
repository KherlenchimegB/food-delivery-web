"use client";
import { SignInCard } from "@/components/auth/sign-in";

export default function Home() {
  return (
    <div className="flex w-screen h-screen bg-gray-50">
      {/* Зүүн тал - Sign-in form */}
      <SignInCard />

      {/* Баруун тал - Background зураг */}
      <div className="flex-1 flex justify-center items-center p-8">
        <div className="relative w-full h-full max-w-2xl">
          <img
            src="/signup-home.png"
            alt="Delivery person with food bag"
            className="w-full h-full object-cover rounded-2xl shadow-2xl"
          />
          {/* Зурган дээр overlay эсвэл текст нэмэх боломжтой */}
        </div>
      </div>
    </div>
  );
}
