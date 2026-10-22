import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { setToken } from "@/lib/token";
import type { AuthData } from "@/types/api";
import type { RegisterInput } from "@/features/auth/schema";

export function useRegister() {
  return useMutation({
    mutationFn: (input: RegisterInput) =>
      apiFetch<AuthData>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: input.name,
          username: input.username,
          email: input.email,
          phone: input.phone,
          password: input.password,
        }),
      }),
    onSuccess: (data) => {
      setToken(data.token);
    },
  });
}