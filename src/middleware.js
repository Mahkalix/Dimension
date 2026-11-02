import { NextResponse } from "next/server";
export function middleware(request) {
  return NextResponse.redirect(
    new URL(
      request.nextUrl.pathname === "/auth/logout"
        ? "/api/auth/signout"
        : "/profil",
      request.url,
    ),
  );
}
export const config = { matcher: ["/auth/:path*"] };
