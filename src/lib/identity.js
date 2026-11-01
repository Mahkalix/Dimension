import { Auth0Client } from "@auth0/nextjs-auth0/server";
import { NextResponse } from "next/server";

const deploymentHost =
  process.env.VERCEL_ENV === "preview"
    ? process.env.VERCEL_BRANCH_URL || process.env.VERCEL_URL
    : process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
export const appOrigin =
  process.env.APP_BASE_URL ||
  (deploymentHost ? "https://" + deploymentHost : "http://127.0.0.1:3000");
export const configured = [
  "AUTH0_DOMAIN",
  "AUTH0_CLIENT_ID",
  "AUTH0_CLIENT_SECRET",
  "AUTH0_SECRET",
].every((k) => Boolean(process.env[k]));
export const auth = configured
  ? new Auth0Client({
      appBaseUrl: appOrigin,
      async onCallback(error, context) {
        const target = new URL("/player", appOrigin);
        if (error) {
          target.pathname = "/";
          target.searchParams.set("error", "auth");
        } else if (context.returnTo === "/api/spotify/connect")
          target.pathname = context.returnTo;
        return NextResponse.redirect(target);
      },
    })
  : null;
