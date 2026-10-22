import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { setToken } from "@/lib/token";
import type { AuthData } from "@/types/api";
import type { LoginInput } from "@/features/auth/schema";

export function useLogin() {
  return useMutation({
    mutationFn: (input: LoginInput) =>
      apiFetch<AuthData>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(input),
      }),
    onSuccess: (data) => {
      setToken(data.token);
    },
  });
}