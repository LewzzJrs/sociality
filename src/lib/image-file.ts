import { z } from "zod";

export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export const imageFileSchema = z
  .instanceof(File, { error: "Please upload an image" })
  .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
    error: "Only PNG, JPG or WEBP images are allowed",
  })
  .refine((file) => file.size <= MAX_IMAGE_SIZE, {
    error: "Image must be 5MB or smaller",
  });

export function readImagePreview(
  file: File,
  onLoad: (dataUrl: string) => void
) {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) return;

  const reader = new FileReader();
  reader.onload = () => {
    if (typeof reader.result === "string") onLoad(reader.result);
  };
  reader.readAsDataURL(file);
}
