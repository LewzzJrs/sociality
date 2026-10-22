export const TOKEN_KEY = "sociality_token";
const MAX_AGE = 60 * 60 * 24 * 7;

export function getToken(): string | null {
  if (typeof document === "undefined") return null;

  const row = document.cookie
    .split("; ")
    .find((item) => item.startsWith(`${TOKEN_KEY}=`));

  return row ? decodeURIComponent(row.slice(TOKEN_KEY.length + 1)) : null;
}

export function setToken(token: string) {
  const secure = location.protocol === "https:" ? "; Secure" : "";

  document.cookie = `${TOKEN_KEY}=${encodeURIComponent(token)}; path=/; max-age=${MAX_AGE}; SameSite=Lax${secure}`;
}

export function removeToken() {
  document.cookie = `${TOKEN_KEY}=; path=/; max-age=0`;
}
