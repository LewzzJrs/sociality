import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { removeToken } from "@/lib/token";

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return function logout() {
    removeToken();
    queryClient.clear();
    router.replace("/login");
  };
}
