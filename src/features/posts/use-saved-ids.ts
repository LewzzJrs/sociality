import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import type { SavedPostsData } from "@/types/api";

const LIMIT = 50;

export const SAVED_IDS_KEY = ["saved", "ids"];

async function fetchAllSavedIds() {
  const ids: number[] = [];
  let page = 1;
  let totalPages = 1;

  do {
    const data = await apiFetch<SavedPostsData>(
      `/api/me/saved?page=${page}&limit=${LIMIT}`
    );
    ids.push(...data.posts.map((post) => post.id));
    totalPages = data.pagination.totalPages;
    page += 1;
  } while (page <= totalPages);

  return ids;
}

export function useSavedIds() {
  return useQuery({
    queryKey: SAVED_IDS_KEY,
    queryFn: fetchAllSavedIds,
    staleTime: 5 * 60 * 1000,
  });
}
