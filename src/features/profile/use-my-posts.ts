import { useInfiniteQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import type { FeedData } from "@/types/api";

const LIMIT = 12;

export const MY_POSTS_KEY = ["my-posts"];

export function useMyPosts() {
  return useInfiniteQuery({
    queryKey: MY_POSTS_KEY,
    queryFn: ({ pageParam }) =>
      apiFetch<FeedData>(`/api/me/posts?page=${pageParam}&limit=${LIMIT}`),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.page < lastPage.pagination.totalPages
        ? lastPage.pagination.page + 1
        : undefined,
  });
}
