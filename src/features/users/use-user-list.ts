import { useInfiniteQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import type { UserListData } from "@/types/api";

const LIMIT = 20;

export const USER_LISTS_KEY = ["user-list"];

export const userListKey = (path: string) => [...USER_LISTS_KEY, path];

export function useUserList(path: string, enabled: boolean) {
  return useInfiniteQuery({
    queryKey: userListKey(path),
    queryFn: ({ pageParam }) =>
      apiFetch<UserListData>(`${path}?page=${pageParam}&limit=${LIMIT}`),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.page < lastPage.pagination.totalPages
        ? lastPage.pagination.page + 1
        : undefined,
    enabled,
  });
}
