import { useInfiniteQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import type { CommentsData } from "@/types/api";

const LIMIT = 10;

export const commentsKey = (postId: number) => ["comments", postId];

export function useComments(postId: number) {
  return useInfiniteQuery({
    queryKey: commentsKey(postId),
    queryFn: ({ pageParam }) =>
      apiFetch<CommentsData>(
        `/api/posts/${postId}/comments?page=${pageParam}&limit=${LIMIT}`
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.page < lastPage.pagination.totalPages
        ? lastPage.pagination.page + 1
        : undefined,
  });
}
