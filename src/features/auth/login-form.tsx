"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PasswordInput } from "@/components/password-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiError } from "@/lib/api";
import { loginSchema, type LoginInput } from "@/features/auth/schema";
import { useLogin } from "@/features/auth/use-login";

function getReturnTo() {
  const returnTo = new URLSearchParams(window.location.search).get("returnTo");
  const origin = window.location.origin;

  if (!returnTo || !URL.canParse(returnTo, origin)) return "/feed";

  const url = new URL(returnTo, origin);
  if (url.origin !== origin) return "/feed";

  return url.pathname + url.search;
}

export function LoginForm() {
  const login = useLogin();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  function onSubmit(values: LoginInput) {
    login.mutate(values, {
      onSuccess: () => {
        router.replace(getReturnTo());
      },
    });
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
        <PasswordInput
          id="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          aria-invalid={!!errors.password}
          {...register("password")}
        />
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
