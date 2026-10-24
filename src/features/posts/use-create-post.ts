import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import type { CreatePostInput } from "@/features/posts/schema";
import { MY_POSTS_KEY } from "@/features/profile/use-my-posts";
import type { Post } from "@/types/api";

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ image, caption }: CreatePostInput) => {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("caption", caption);

      return apiFetch<Post>("/api/posts", { method: "POST", body: formData });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      queryClient.invalidateQueries({ queryKey: ["me"] });
      queryClient.invalidateQueries({ queryKey: MY_POSTS_KEY });
    },
  });
}
