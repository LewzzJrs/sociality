import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { MY_POSTS_KEY } from "@/features/profile/use-my-posts";
import type { EditProfileInput } from "@/features/profile/schema";

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ name, username, phone, bio, avatar }: EditProfileInput) => {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("username", username);
      formData.append("phone", phone);
      formData.append("bio", bio);
      if (avatar) formData.append("avatar", avatar);

      return apiFetch<unknown>("/api/me", { method: "PATCH", body: formData });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      queryClient.invalidateQueries({ queryKey: MY_POSTS_KEY });
    },
  });
}
