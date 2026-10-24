import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import type { PostsData, UserProfile } from "@/types/api";

const LIMIT = 12;

export const userProfileKey = (username: string) => ["user", username];

export function useUserProfile(username: string) {
  return useQuery({
    queryKey: userProfileKey(username),
    queryFn: () =>
      apiFetch<UserProfile>(`/api/users/${encodeURIComponent(username)}`),
  });
}

export function useUserPosts(username: string, kind: "posts" | "likes") {
  return useInfiniteQuery({
    queryKey: ["user-posts", username, kind],
    queryFn: ({ pageParam }) =>
      apiFetch<PostsData>(
        `/api/users/${encodeURIComponent(username)}/${kind}?page=${pageParam}&limit=${LIMIT}`
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.page < lastPage.pagination.totalPages
        ? lastPage.pagination.page + 1
        : undefined,
  });
}
