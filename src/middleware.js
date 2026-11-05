import { NextResponse } from "next/server";
import { auth0 } from "./lib/identity";
export async function middleware(request) {
  if (!auth0) {
    if (request.nextUrl.pathname.startsWith("/auth/"))
      return NextResponse.redirect(new URL("/login?error=config", request.url));
    return NextResponse.next();
  }
  try {
    return await auth0.middleware(request);
  } catch {
    return NextResponse.redirect(new URL("/login?error=network", request.url));
  }
}
export const config = {
  runtime: "nodejs",
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|music/|images/|brand/|.*\\.(?:svg|png|jpg|ico|json)$).*)",
  ],
};
