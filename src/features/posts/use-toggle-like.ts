import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import {
  postKey,
  restorePostCaches,
  snapshotPostCaches,
  updatePostInCaches,
} from "@/features/posts/post-cache";
import { userListKey } from "@/features/users/use-user-list";
import type { Post } from "@/types/api";

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
      const snapshot = await snapshotPostCaches(queryClient, postId);
      updatePostInCaches(queryClient, postId, (post) => applyLike(post, liked));
      return { snapshot };
    },
    onError: (_error, { postId }, context) => {
      restorePostCaches(queryClient, postId, context?.snapshot);
      toast.error("Failed to update like. Please try again.");
    },
    onSettled: (_data, _error, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      queryClient.invalidateQueries({ queryKey: postKey(postId) });
      queryClient.invalidateQueries({
        queryKey: userListKey(`/api/posts/${postId}/likes`),
      });
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}
