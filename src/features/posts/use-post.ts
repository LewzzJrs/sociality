import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { postKey } from "@/features/posts/post-cache";
import type { Post } from "@/types/api";

export function usePost(postId: number, initialPost?: Post) {
  return useQuery({
    queryKey: postKey(postId),
    queryFn: () => apiFetch<Post>(`/api/posts/${postId}`),
    initialData: initialPost,
  });
}
