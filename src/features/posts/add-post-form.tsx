"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CloudUpload, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  ACCEPTED_IMAGE_TYPES,
  createPostSchema,
  type CreatePostInput,
} from "@/features/posts/schema";
import { useCreatePost } from "@/features/posts/use-create-post";

export function AddPostForm() {
  const router = useRouter();
  const createPost = useCreatePost();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    resetField,
    formState: { errors },
  } = useForm<CreatePostInput>({
    resolver: zodResolver(createPostSchema),
    defaultValues: { caption: "" },
  });

  function selectImage(file: File | undefined) {
    if (!file) return;

    setValue("image", file, { shouldValidate: true });
    setPreviewUrl(null);
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  }

  function removeImage() {
    resetField("image");
    setPreviewUrl(null);
  }

  function onSubmit(values: CreatePostInput) {
    createPost.mutate(values, {
      onSuccess: () => {
        toast.success("Success Post", { closeButton: true });
        router.push("/feed");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-6"
    >
      <div className="flex flex-col gap-0.5">
        <Label
          htmlFor="image"
          className="leading-7 font-bold tracking-[-0.02em]"
        >
          Photo
        </Label>
        <input
          ref={fileInputRef}
          id="image"
          type="file"
          accept={ACCEPTED_IMAGE_TYPES.join(",")}
          aria-invalid={!!errors.image}
          className="peer sr-only"
          onChange={(event) => {
            selectImage(event.target.files?.[0]);
            event.target.value = "";
          }}
        />

        {previewUrl ? (
          <div
            className={cn(
              "flex flex-col items-center gap-3 rounded-xl border border-dashed border-neutral-900 bg-neutral-950 p-4",
              errors.image && "border-destructive"
            )}
          >
            <div className="relative aspect-square w-full overflow-hidden rounded-lg">
              <Image
                src={previewUrl}
                alt="Selected image preview"
                fill
                unoptimized
                className="object-cover"
              />
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => fileInputRef.current?.click()}
                className="h-10 gap-1.5 rounded-lg bg-neutral-900 px-3 text-sm font-semibold"
              >
                <CloudUpload className="size-5" />
                Change Image
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={removeImage}
                className="h-10 gap-1.5 rounded-lg px-3 text-sm font-semibold text-accent-red hover:text-accent-red"
              >
                <Trash2 className="size-5" />
                Delete Image
              </Button>
            </div>
          </div>
        ) : (
          <label
            htmlFor="image"
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(event) => {
              event.preventDefault();
              setIsDragging(false);
              selectImage(event.dataTransfer.files[0]);
            }}
            className={cn(
              "flex cursor-pointer flex-col items-center gap-1 rounded-xl border border-dashed border-neutral-900 bg-neutral-950 px-6 py-4 text-center transition-colors peer-focus-visible:border-ring",
              isDragging && "border-primary-200 bg-neutral-900",
              errors.image && "border-destructive"
            )}
          >
            <span className="mb-2 flex size-10 items-center justify-center rounded-lg border border-neutral-900">
              <CloudUpload className="size-5" />
            </span>
            <span className="text-sm tracking-[-0.02em]">
              <span className="font-bold text-primary-200">
                Click to upload
              </span>{" "}
              <span className="text-neutral-400">or drag and drop</span>
            </span>
            <span className="text-sm font-semibold tracking-[-0.02em] text-neutral-600">
              PNG, JPG or WEBP (max. 5mb)
            </span>
          </label>
        )}

        {errors.image && (
          <p className="text-sm font-medium tracking-[-0.03em] text-destructive">
            {errors.image.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-0.5">
        <Label
          htmlFor="caption"
          className="leading-7 font-bold tracking-[-0.02em]"
        >
          Caption
        </Label>
        <textarea
          id="caption"
          rows={4}
          placeholder="Create your caption"
          aria-invalid={!!errors.caption}
          {...register("caption")}
          className="min-h-25 w-full resize-none rounded-xl border border-input bg-neutral-950 px-4 py-2 text-md tracking-[-0.02em] transition-[color,box-shadow] outline-none placeholder:text-neutral-600 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive"
        />
        {errors.caption && (
          <p className="text-sm font-medium tracking-[-0.03em] text-destructive">
            {errors.caption.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={createPost.isPending}
        className="h-12 rounded-full text-md font-bold tracking-[-0.02em]"
      >
        {createPost.isPending ? "Sharing..." : "Share"}
      </Button>
    </form>
  );
}
