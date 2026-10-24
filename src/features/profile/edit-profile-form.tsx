"use client";

import { useRef, useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserAvatar } from "@/components/user-avatar";
import { ACCEPTED_IMAGE_TYPES, readImagePreview } from "@/lib/image-file";
import {
  editProfileSchema,
  type EditProfileInput,
} from "@/features/profile/schema";
import { useMe } from "@/features/profile/use-me";
import { useUpdateProfile } from "@/features/profile/use-update-profile";
import type { Profile } from "@/types/api";

type FieldProps = {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
};

function Field({ id, label, error, hint, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-0.5">
      <Label htmlFor={id} className="leading-7 font-bold tracking-[-0.02em]">
        {label}
      </Label>
      {children}
      {error ? (
        <p className="text-sm font-medium tracking-[-0.03em] text-destructive">
          {error}
        </p>
      ) : (
        hint && (
          <p className="text-sm tracking-[-0.03em] text-neutral-400">{hint}</p>
        )
      )}
    </div>
  );
}

function EditProfileFields({ profile }: { profile: Profile }) {
  const router = useRouter();
  const updateProfile = useUpdateProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<EditProfileInput>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: profile.name,
      username: profile.username,
      phone: profile.phone,
      bio: profile.bio ?? "",
    },
  });

  function selectAvatar(file: File | undefined) {
    if (!file) return;

    setValue("avatar", file, { shouldValidate: true });
    setPreviewUrl(null);
    readImagePreview(file, setPreviewUrl);
  }

  function onSubmit(values: EditProfileInput) {
    updateProfile.mutate(values, {
      onSuccess: () => {
        toast.success("Profile updated", { closeButton: true });
        router.push("/me");
      },
    });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-8 md:flex-row md:items-start md:gap-12"
    >
      <div className="flex flex-col items-center gap-4 md:w-40 md:shrink-0">
        <UserAvatar
          name={profile.name}
          avatarUrl={previewUrl ?? profile.avatarUrl}
          className="size-32 md:size-40"
        />
        <input
          ref={fileInputRef}
          id="avatar"
          type="file"
          accept={ACCEPTED_IMAGE_TYPES.join(",")}
          className="sr-only"
          onChange={(event) => {
            selectAvatar(event.target.files?.[0]);
            event.target.value = "";
          }}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="h-12 w-full max-w-40 rounded-full border-neutral-900 bg-transparent text-md font-bold tracking-[-0.02em] dark:bg-transparent"
        >
          Change Photo
        </Button>
        {errors.avatar && (
          <p className="text-center text-sm font-medium tracking-[-0.03em] text-destructive">
            {errors.avatar.message}
          </p>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-5">
        <Field id="name" label="Name" error={errors.name?.message}>
          <Input
            id="name"
            autoComplete="name"
            placeholder="Enter your name"
            aria-invalid={!!errors.name}
            {...register("name")}
          />
        </Field>

        <Field id="username" label="Username" error={errors.username?.message}>
          <Input
            id="username"
            autoComplete="username"
            placeholder="Enter your username"
            aria-invalid={!!errors.username}
            {...register("username")}
          />
        </Field>

        <Field id="email" label="Email" hint="Email can't be changed.">
          <Input
            id="email"
            type="email"
            value={profile.email}
            readOnly
            disabled
          />
        </Field>

        <Field id="phone" label="Number Phone" error={errors.phone?.message}>
          <Input
            id="phone"
            type="tel"
            autoComplete="tel"
            placeholder="Enter your number phone"
            aria-invalid={!!errors.phone}
            {...register("phone")}
          />
        </Field>

        <Field id="bio" label="Bio" error={errors.bio?.message}>
          <textarea
            id="bio"
            rows={4}
            placeholder="Create your bio"
            aria-invalid={!!errors.bio}
            {...register("bio")}
            className="min-h-25 w-full resize-none rounded-xl border border-input bg-neutral-950 px-4 py-2 text-md tracking-[-0.02em] transition-[color,box-shadow] outline-none placeholder:text-neutral-600 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive"
          />
        </Field>

        {updateProfile.error && (
          <p
            role="alert"
            className="text-sm font-medium tracking-[-0.03em] text-destructive"
          >
            {updateProfile.error.message}
          </p>
        )}

        <Button
          type="submit"
          disabled={updateProfile.isPending}
          className="h-12 rounded-full text-md font-bold tracking-[-0.02em]"
        >
          {updateProfile.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}

export function EditProfileForm() {
  const { data, isPending, isError, refetch } = useMe();

  if (isPending) {
    return (
      <div
        className="flex animate-pulse flex-col gap-8 md:flex-row md:gap-12"
        aria-hidden="true"
      >
        <div className="mx-auto size-32 rounded-full bg-neutral-900 md:mx-0 md:size-40" />
        <div className="flex flex-1 flex-col gap-5">
          {Array.from({ length: 5 }, (_, index) => (
            <div key={index} className="h-12 rounded-xl bg-neutral-900" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <p className="text-md font-bold tracking-[-0.02em]">
          Failed to load your profile
        </p>
        <Button
          onClick={() => refetch()}
          className="h-12 rounded-full px-8 text-md font-bold"
        >
          Try again
        </Button>
      </div>
    );
  }

  return <EditProfileFields profile={data.profile} />;
}
