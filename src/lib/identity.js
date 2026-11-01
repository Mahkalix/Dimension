import { Auth0Client } from "@auth0/nextjs-auth0/server";
import { NextResponse } from "next/server";

export const configured = [
  "APP_BASE_URL",
  "AUTH0_DOMAIN",
  "AUTH0_CLIENT_ID",
  "AUTH0_CLIENT_SECRET",
  "AUTH0_SECRET",
].every((k) => Boolean(process.env[k]));
export const auth = configured
  ? new Auth0Client({
      async onCallback(error, context) {
        const target = new URL("/", process.env.APP_BASE_URL);
        if (error) target.searchParams.set("error", "auth");
        else if (context.returnTo === "/api/spotify/connect")
          target.pathname = context.returnTo;
        return NextResponse.redirect(target);
      },
    })
  : null;
