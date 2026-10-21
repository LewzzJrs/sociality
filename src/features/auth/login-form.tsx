"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiError } from "@/lib/api";
import { loginSchema, type LoginInput } from "@/features/auth/schema";
import { useLogin } from "@/features/auth/use-login";

export function LoginForm() {
  const login = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  function onSubmit(values: LoginInput) {
    login.mutate(values);
  }

  const serverError =
    login.error instanceof ApiError && login.error.status === 401
      ? "Incorrect email or password. Please try again."
      : login.error?.message;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-5"
    >
      <div className="flex flex-col gap-0.5">
        <Label
          htmlFor="email"
          className="leading-7 font-bold tracking-[-0.02em]"
        >
          Email
        </Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="Enter your email"
          aria-invalid={!!errors.email}
          {...register("email")}
        />
        {errors.email && (
          <p className="text-sm font-medium tracking-[-0.03em] text-destructive">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-0.5">
        <Label
          htmlFor="password"
          className="leading-7 font-bold tracking-[-0.02em]"
        >
          Password
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Enter your password"
            aria-invalid={!!errors.password}
            className="pr-12"
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute top-1/2 right-4 -translate-y-1/2 text-neutral-500"
          >
            {showPassword ? (
              <EyeOff className="size-5" />
            ) : (
              <Eye className="size-5" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-sm font-medium tracking-[-0.03em] text-destructive">
            {errors.password.message}
          </p>
        )}
      </div>

      {serverError && (
        <p
          role="alert"
          className="text-sm font-medium tracking-[-0.03em] text-destructive"
        >
          {serverError}
        </p>
      )}

      <Button
        type="submit"
        disabled={login.isPending}
        className="h-12 rounded-full text-md font-bold tracking-[-0.02em]"
      >
        {login.isPending ? "Logging in..." : "Login"}
      </Button>

      <p className="text-center text-sm font-semibold tracking-[-0.02em] md:text-md">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-bold text-primary-200">
          Register
        </Link>
      </p>
    </form>
  );
}
