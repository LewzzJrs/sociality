import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import type { MeData } from "@/types/api";

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: () => apiFetch<MeData>("/api/me"),
  });
}
