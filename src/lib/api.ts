import type { ApiResponse } from "@/types/api";
import { getToken, removeToken } from "@/lib/token";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function redirectToLogin() {
  removeToken();
  const loginUrl = new URL("/login", window.location.origin);
  loginUrl.searchParams.set(
    "returnTo",
    window.location.pathname + window.location.search
  );
  window.location.assign(loginUrl);
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const body: ApiResponse<T> | null = await res.json().catch(() => null);

  if (!res.ok || !body) {
    if (res.status === 401 && token) {
      redirectToLogin();
    }
    throw new ApiError(
      body?.message ?? "Something went wrong. Please try again later.",
      res.status
    );
  }

  return body.data;
}
