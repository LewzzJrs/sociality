import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { USER_LISTS_KEY } from "@/features/users/use-user-list";
import { userProfileKey } from "@/features/users/use-user-profile";
import type { UserListData, UserProfile } from "@/types/api";

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
      await Promise.all([
        queryClient.cancelQueries({ queryKey: USER_LISTS_KEY }),
        queryClient.cancelQueries({ queryKey: userProfileKey(username) }),
      ]);
      const previousLists = queryClient.getQueriesData<
        InfiniteData<UserListData>
      >({ queryKey: USER_LISTS_KEY });
      const previousProfile = queryClient.getQueryData<UserProfile>(
        userProfileKey(username)
      );

      queryClient.setQueryData<UserProfile>(userProfileKey(username), (old) =>
        old && old.isFollowing !== follow
          ? {
              ...old,
              isFollowing: follow,
              counts: {
                ...old.counts,
                followers: Math.max(
                  0,
                  old.counts.followers + (follow ? 1 : -1)
                ),
              },
            }
          : old
      );

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

      return { previousLists, previousProfile };
    },
    onError: (_error, { username }, context) => {
      context?.previousLists.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
      queryClient.setQueryData(
        userProfileKey(username),
        context?.previousProfile
      );
      toast.error("Failed to update follow. Please try again.");
    },
    onSettled: (_data, _error, { username }) => {
      queryClient.invalidateQueries({ queryKey: USER_LISTS_KEY });
      queryClient.invalidateQueries({ queryKey: userProfileKey(username) });
      queryClient.invalidateQueries({ queryKey: ["me"] });
      queryClient.invalidateQueries({ queryKey: ["feed"] });
    },
  });
}
