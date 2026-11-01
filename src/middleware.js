import { NextResponse } from "next/server";
import { auth } from "./lib/identity";
export function middleware(request) {
  if (auth) return auth.middleware(request);
  if (request.nextUrl.pathname.startsWith("/auth/"))
    return NextResponse.redirect(new URL("/?error=config", request.url));
  return NextResponse.next();
}
export const config = {
  matcher: ["/((?!_next/static|_next/image|.*\\..*).*)"],
};
