import { NextResponse } from "next/server";
export async function GET(request) {
  return NextResponse.redirect(new URL("/profil", request.url));
}
export async function POST(request) {
  return NextResponse.redirect(new URL("/api/auth/signout", request.url), 303);
}
