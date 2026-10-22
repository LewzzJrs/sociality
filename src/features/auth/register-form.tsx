"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/password-input";
import { registerSchema, type RegisterInput } from "@/features/auth/schema";
import { useRegister } from "@/features/auth/use-register";

const labelClassName = "leading-7 font-bold tracking-[-0.02em]";
const errorClassName =
  "text-sm font-medium tracking-[-0.03em] text-destructive";

export function RegisterForm() {
  const registerUser = useRegister();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  function onSubmit(values: RegisterInput) {
    registerUser.mutate(values, {
      onSuccess: () => {
        router.replace("/feed");
      },
    });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-5"
    >
      <div className="flex flex-col gap-0.5">
        <Label htmlFor="name" className={labelClassName}>
          Name
        </Label>
        <Input
          id="name"
          autoComplete="name"
          placeholder="Enter your name"
          aria-invalid={!!errors.name}
          {...register("name")}
        />
        {errors.name && (
          <p className={errorClassName}>{errors.name.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-0.5">
        <Label htmlFor="username" className={labelClassName}>
          Username
        </Label>
        <Input
          id="username"
          autoComplete="username"
          placeholder="Enter your username"
          aria-invalid={!!errors.username}
          {...register("username")}
        />
        {errors.username && (
          <p className={errorClassName}>{errors.username.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-0.5">
        <Label htmlFor="email" className={labelClassName}>
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
          <p className={errorClassName}>{errors.email.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-0.5">
        <Label htmlFor="phone" className={labelClassName}>
          Number Phone
        </Label>
        <Input
          id="phone"
          type="tel"
          autoComplete="tel"
          placeholder="Enter your number phone"
          aria-invalid={!!errors.phone}
          {...register("phone")}
        />
        {errors.phone && (
          <p className={errorClassName}>{errors.phone.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-0.5">
        <Label htmlFor="password" className={labelClassName}>
          Password
        </Label>
        <PasswordInput
          id="password"
          autoComplete="new-password"
          placeholder="Enter your password"
          aria-invalid={!!errors.password}
          {...register("password")}
        />
        {errors.password && (
          <p className={errorClassName}>{errors.password.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-0.5">
        <Label htmlFor="confirmPassword" className={labelClassName}>
          Confirm Password
        </Label>
        <PasswordInput
          id="confirmPassword"
          autoComplete="new-password"
          placeholder="Enter your confirm password"
          aria-invalid={!!errors.confirmPassword}
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p className={errorClassName}>{errors.confirmPassword.message}</p>
        )}
      </div>

      {registerUser.error && (
        <p role="alert" className={errorClassName}>
          {registerUser.error.message}
        </p>
      )}

      <Button
        type="submit"
        disabled={registerUser.isPending}
        className="h-12 rounded-full text-md font-bold tracking-[-0.02em]"
      >
        {registerUser.isPending ? "Submitting..." : "Submit"}
      </Button>

      <p className="text-center text-sm font-semibold tracking-[-0.02em] md:text-md">
        Already have an account?{" "}
        <Link href="/login" className="font-bold text-primary-200">
          Log in
        </Link>
      </p>
    </form>
  );
}