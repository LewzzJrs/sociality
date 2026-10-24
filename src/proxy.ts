import { NextResponse, type NextRequest } from "next/server";
import { TOKEN_KEY } from "@/lib/token";

const AUTH_PAGES = ["/login", "/register"];

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const hasToken = request.cookies.has(TOKEN_KEY);
  const isAuthPage = AUTH_PAGES.includes(pathname);

  if (!hasToken && !isAuthPage) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("returnTo", pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  if (hasToken && isAuthPage) {
    return NextResponse.redirect(new URL("/feed", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/feed/:path*",
    "/posts/:path*",
    "/me/:path*",
    "/login",
    "/register",
  ],
};
