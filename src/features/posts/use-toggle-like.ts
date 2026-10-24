import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import type { FeedData, Post } from "@/types/api";

type ToggleLikeInput = {
  postId: number;
  liked: boolean;
};

function applyLike(post: Post, liked: boolean): Post {
  if (post.likedByMe === liked) return post;
  return {
    ...post,
    likedByMe: liked,
    likeCount: Math.max(0, post.likeCount + (liked ? 1 : -1)),
  };
}

export function useToggleLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, liked }: ToggleLikeInput) =>
      apiFetch<unknown>(`/api/posts/${postId}/like`, {
        method: liked ? "POST" : "DELETE",
      }),
    onMutate: async ({ postId, liked }) => {
      await queryClient.cancelQueries({ queryKey: ["feed"] });
      const previousFeed = queryClient.getQueryData<InfiniteData<FeedData>>([
        "feed",
      ]);

      queryClient.setQueryData<InfiniteData<FeedData>>(["feed"], (old) =>
        old
          ? {
              ...old,
              pages: old.pages.map((page) => ({
                ...page,
                items: page.items.map((post) =>
                  post.id === postId ? applyLike(post, liked) : post
                ),
              })),
            }
          : old
      );

      return { previousFeed };
    },
    onError: (_error, _input, context) => {
      if (context?.previousFeed) {
        queryClient.setQueryData(["feed"], context.previousFeed);
      }
      toast.error("Failed to update like. Please try again.");
    },
    onSettled: (_data, _error, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      queryClient.invalidateQueries({ queryKey: ["post-likes", postId] });
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}
