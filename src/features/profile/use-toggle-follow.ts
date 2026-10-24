import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { USER_LISTS_KEY } from "@/features/users/use-user-list";
import type { UserListData } from "@/types/api";

type ToggleFollowInput = {
  username: string;
  follow: boolean;
};

export function useToggleFollow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ username, follow }: ToggleFollowInput) =>
      apiFetch<unknown>(`/api/follow/${encodeURIComponent(username)}`, {
        method: follow ? "POST" : "DELETE",
      }),
    onMutate: async ({ username, follow }) => {
      await queryClient.cancelQueries({ queryKey: USER_LISTS_KEY });
      const previousLists = queryClient.getQueriesData<
        InfiniteData<UserListData>
      >({ queryKey: USER_LISTS_KEY });

      queryClient.setQueriesData<InfiniteData<UserListData>>(
        { queryKey: USER_LISTS_KEY },
        (old) =>
          old
            ? {
                ...old,
                pages: old.pages.map((page) => ({
                  ...page,
                  users: page.users.map((user) =>
                    user.username === username
                      ? { ...user, isFollowedByMe: follow }
                      : user
                  ),
                })),
              }
            : old
      );

      return { previousLists };
    },
    onError: (_error, _input, context) => {
      context?.previousLists.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
      toast.error("Failed to update follow. Please try again.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: USER_LISTS_KEY });
      queryClient.invalidateQueries({ queryKey: ["me"] });
      queryClient.invalidateQueries({ queryKey: ["feed"] });
    },
  });
}
