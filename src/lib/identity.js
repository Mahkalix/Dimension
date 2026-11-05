import { Auth0Client } from "@auth0/nextjs-auth0/server";
import { NextResponse } from "next/server";
const host =
  process.env.VERCEL_ENV === "preview"
    ? process.env.VERCEL_BRANCH_URL || process.env.VERCEL_URL
    : process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
export const appOrigin =
  process.env.APP_BASE_URL ||
  (host ? "https://" + host : "http://localhost:3000");
export const configured = Boolean(
  process.env.AUTH0_DOMAIN &&
    process.env.AUTH0_CLIENT_ID &&
    process.env.AUTH0_CLIENT_SECRET &&
    /^[a-f0-9]{64}$/i.test(process.env.AUTH0_SECRET || ""),
);
export const auth0 = configured
  ? new Auth0Client({
      appBaseUrl: appOrigin,
      authorizationParameters: {
        scope: "openid profile email",
        connection:
          process.env.AUTH0_CONNECTION || "Username-Password-Authentication",
        ui_locales: "en",
      },
      signInReturnToPath: "/account",
      enableAccessTokenEndpoint: false,
      session: {
        rolling: true,
        inactivityDuration: 30 * 24 * 60 * 60,
        absoluteDuration: 30 * 24 * 60 * 60,
        cookie: { transient: false },
      },
      onCallback: async (error, context) => {
        if (error)
          return NextResponse.redirect(new URL("/login?error=auth", appOrigin));
        const destination = ["/account", "/player"].includes(context.returnTo)
          ? context.returnTo
          : "/account";
        return NextResponse.redirect(
          new URL(
            destination === "/player"
              ? "/login?returnTo=%2Fplayer"
              : destination,
            appOrigin,
          ),
        );
      },
    })
  : null;
export async function getSession() {
  return auth0 ? auth0.getSession() : null;
}
