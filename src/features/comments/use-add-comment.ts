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
import type { Comment, CommentsData, MeData } from "@/types/api";

export function useAddComment(postId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (text: string) =>
      apiFetch<unknown>(`/api/posts/${postId}/comments`, {
        method: "POST",
        body: JSON.stringify({ text }),
      }),
    onMutate: async (text) => {
      await queryClient.cancelQueries({ queryKey: commentsKey(postId) });
      const previousComments = queryClient.getQueryData<
        InfiniteData<CommentsData>
      >(commentsKey(postId));
      const snapshot = await snapshotPostCaches(queryClient, postId);
      const me = queryClient.getQueryData<MeData>(["me"]);

      if (me) {
        const { id, username, name, avatarUrl } = me.profile;
        const optimisticComment: Comment = {
          id: -Date.now(),
          text,
          createdAt: new Date().toISOString(),
          author: { id, username, name, avatarUrl },
        };

        queryClient.setQueryData<InfiniteData<CommentsData>>(
          commentsKey(postId),
          (old) =>
            old
              ? {
                  ...old,
                  pages: old.pages.map((page, index) =>
                    index === 0
                      ? {
                          ...page,
                          comments: [optimisticComment, ...page.comments],
                        }
                      : page
                  ),
                }
              : old
        );
      }

      updatePostInCaches(queryClient, postId, (post) => ({
        ...post,
        commentCount: post.commentCount + 1,
      }));

      return { previousComments, snapshot };
    },
    onError: (_error, _text, context) => {
      queryClient.setQueryData(commentsKey(postId), context?.previousComments);
      restorePostCaches(queryClient, postId, context?.snapshot);
      toast.error("Failed to post comment. Please try again.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: commentsKey(postId) });
      queryClient.invalidateQueries({ queryKey: postKey(postId) });
      queryClient.invalidateQueries({ queryKey: ["feed"] });
    },
  });
}
