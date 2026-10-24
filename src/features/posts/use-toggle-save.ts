import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { SAVED_IDS_KEY } from "@/features/posts/use-saved-ids";

type ToggleSaveInput = {
  postId: number;
  saved: boolean;
};

export function useToggleSave() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, saved }: ToggleSaveInput) =>
      apiFetch<{ saved: boolean }>(`/api/posts/${postId}/save`, {
        method: saved ? "POST" : "DELETE",
      }),
    onMutate: async ({ postId, saved }) => {
      await queryClient.cancelQueries({ queryKey: SAVED_IDS_KEY });
      const previousIds = queryClient.getQueryData<number[]>(SAVED_IDS_KEY);

      queryClient.setQueryData<number[]>(SAVED_IDS_KEY, (old = []) =>
        saved
          ? old.includes(postId)
            ? old
            : [...old, postId]
          : old.filter((id) => id !== postId)
      );

      return { previousIds };
    },
    onError: (_error, _input, context) => {
      queryClient.setQueryData(SAVED_IDS_KEY, context?.previousIds);
      toast.error("Failed to update saved posts. Please try again.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["saved"] });
    },
  });
}
