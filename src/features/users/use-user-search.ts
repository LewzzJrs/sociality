import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import type { UserListData } from "@/types/api";

const LIMIT = 10;

export function useUserSearch(keyword: string) {
  return useQuery({
    queryKey: ["user-search", keyword],
    queryFn: () =>
      apiFetch<UserListData>(
        `/api/users/search?q=${encodeURIComponent(keyword)}&limit=${LIMIT}`
      ),
    enabled: keyword.length > 0,
    placeholderData: keepPreviousData,
  });
}
