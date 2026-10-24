import { z } from "zod";
import { imageFileSchema } from "@/lib/image-file";

export const editProfileSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  username: z.string().trim().min(1, "Username is required"),
  phone: z.string().trim().min(1, "Number phone is required"),
  bio: z.string().trim(),
  avatar: imageFileSchema.optional(),
});

export type EditProfileInput = z.infer<typeof editProfileSchema>;
