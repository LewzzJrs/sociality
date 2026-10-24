import { useInfiniteQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import type { FeedData } from "@/types/api";

const LIMIT = 10;

export function useFeed() {
  return useInfiniteQuery({
    queryKey: ["feed"],
    queryFn: ({ pageParam }) =>
      apiFetch<FeedData>(`/api/feed?page=${pageParam}&limit=${LIMIT}`),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.page < lastPage.pagination.totalPages
        ? lastPage.pagination.page + 1
        : undefined,
  });
}