import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { MY_POSTS_KEY } from "@/features/profile/use-my-posts";
import type { FeedData } from "@/types/api";

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: number) =>
      apiFetch<unknown>(`/api/posts/${postId}`, { method: "DELETE" }),
    onSuccess: (_data, postId) => {
      queryClient.setQueryData<InfiniteData<FeedData>>(["feed"], (old) =>
        old
          ? {
              ...old,
              pages: old.pages.map((page) => ({
                ...page,
                items: page.items.filter((post) => post.id !== postId),
              })),
            }
          : old
      );
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      queryClient.invalidateQueries({ queryKey: MY_POSTS_KEY });
      queryClient.invalidateQueries({ queryKey: ["me"] });
      queryClient.invalidateQueries({ queryKey: ["saved"] });
      queryClient.invalidateQueries({ queryKey: ["user-posts"] });
      toast.success("Post deleted", { closeButton: true });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
