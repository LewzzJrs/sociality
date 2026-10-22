import type { Metadata } from "next";
import Image from "next/image";
import { RegisterForm } from "@/features/auth/register-form";

export const metadata: Metadata = {
  title: "Register | Sociality",
};

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-10">
      <div className="flex w-full max-w-130.75 flex-col gap-4 rounded-2xl border border-neutral-900 bg-black/20 px-4 py-8 backdrop-blur-[100px] md:gap-6 md:px-6 md:py-10">
        <div className="flex items-center justify-center gap-2.75">
          <Image src="/logo.svg" alt="" width={30} height={30} loading="eager" />
          <span className="text-display-xs font-bold">Sociality</span>
        </div>
        <h1 className="text-center text-xl font-bold md:text-display-xs">
          Register
        </h1>
        <RegisterForm />
      </div>
    </main>
  );
}