import { useInfiniteQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import type { UserListData } from "@/types/api";

const LIMIT = 20;

export function usePostLikes(postId: number, enabled: boolean) {
  return useInfiniteQuery({
    queryKey: ["post-likes", postId],
    queryFn: ({ pageParam }) =>
      apiFetch<UserListData>(
        `/api/posts/${postId}/likes?page=${pageParam}&limit=${LIMIT}`
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.page < lastPage.pagination.totalPages
        ? lastPage.pagination.page + 1
        : undefined,
    enabled,
  });
}
