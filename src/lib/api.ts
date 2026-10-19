import type { ApiResponse } from "@/types/api";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const body: ApiResponse<T> | null = await res.json().catch(() => null);

  if (!res.ok || !body) {
    throw new ApiError(
      body?.message ?? "Terjadi kesalahan pada server. Coba lagi nanti.",
      res.status
    );
  }

  return body.data;
}
