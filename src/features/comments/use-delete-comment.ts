import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { commentsKey } from "@/features/comments/use-comments";
import {
  postKey,
  restorePostCaches,
  snapshotPostCaches,
  updatePostInCaches,
} from "@/features/posts/post-cache";
import type { CommentsData } from "@/types/api";

export function useDeleteComment(postId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: number) =>
      apiFetch<unknown>(`/api/comments/${commentId}`, { method: "DELETE" }),
    onMutate: async (commentId) => {
      await queryClient.cancelQueries({ queryKey: commentsKey(postId) });
      const previousComments = queryClient.getQueryData<
        InfiniteData<CommentsData>
      >(commentsKey(postId));
      const snapshot = await snapshotPostCaches(queryClient, postId);

      queryClient.setQueryData<InfiniteData<CommentsData>>(
        commentsKey(postId),
        (old) =>
          old
            ? {
                ...old,
                pages: old.pages.map((page) => ({
                  ...page,
                  comments: page.comments.filter(
                    (comment) => comment.id !== commentId
                  ),
                })),
              }
            : old
      );
      updatePostInCaches(queryClient, postId, (post) => ({
        ...post,
        commentCount: Math.max(0, post.commentCount - 1),
      }));

      return { previousComments, snapshot };
    },
    onSuccess: () => {
      toast.success("Comment deleted");
    },
    onError: (_error, _commentId, context) => {
      queryClient.setQueryData(commentsKey(postId), context?.previousComments);
      restorePostCaches(queryClient, postId, context?.snapshot);
      toast.error("Failed to delete comment. Please try again.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: commentsKey(postId) });
      queryClient.invalidateQueries({ queryKey: postKey(postId) });
      queryClient.invalidateQueries({ queryKey: ["feed"] });
    },
  });
}
