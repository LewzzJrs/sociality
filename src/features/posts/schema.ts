import { z } from "zod";
import { imageFileSchema } from "@/lib/image-file";

export const createPostSchema = z.object({
  image: imageFileSchema,
  caption: z.string().trim().min(1, "Caption is required"),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
