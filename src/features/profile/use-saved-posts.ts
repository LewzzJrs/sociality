import { useInfiniteQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import type { SavedPostsData } from "@/types/api";

const LIMIT = 12;

export function useSavedPosts() {
  return useInfiniteQuery({
    queryKey: ["saved", "posts"],
    queryFn: ({ pageParam }) =>
      apiFetch<SavedPostsData>(
        `/api/me/saved?page=${pageParam}&limit=${LIMIT}`
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.page < lastPage.pagination.totalPages
        ? lastPage.pagination.page + 1
        : undefined,
  });
}
