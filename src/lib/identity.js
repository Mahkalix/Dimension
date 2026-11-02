import NextAuthModule from "next-auth";
import SpotifyModule from "next-auth/providers/spotify";
import { getServerSession } from "next-auth";

const NextAuth=NextAuthModule.default??NextAuthModule;
const SpotifyProvider=SpotifyModule.default??SpotifyModule;
const host =
  process.env.VERCEL_ENV === "preview"
    ? process.env.VERCEL_BRANCH_URL || process.env.VERCEL_URL
    : process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
export const appOrigin =
  process.env.NEXTAUTH_URL ||
  process.env.APP_BASE_URL ||
  (host ? "https://" + host : "http://127.0.0.1:3000");
if (!process.env.NEXTAUTH_URL) process.env.NEXTAUTH_URL = appOrigin;
const secret = process.env.NEXTAUTH_SECRET || process.env.AUTH0_SECRET;
export const configured = Boolean(
  process.env.SPOTIFY_CLIENT_ID && process.env.SPOTIFY_CLIENT_SECRET && secret,
);
export const authOptions = {
  secret,
  providers: configured
    ? [
        SpotifyProvider({
          clientId: process.env.SPOTIFY_CLIENT_ID,
          clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
          authorization: {
            params: { scope: "user-read-private", show_dialog: "true" },
          },
          checks: ["pkce", "state"],
        }),
      ]
    : [],
  session: { strategy: "jwt", maxAge: 7 * 24 * 60 * 60 },
  pages: { signIn: "/profil", error: "/profil" },
  callbacks: {
    async jwt({ token, profile }) {
      if (profile) token.spotifyId = profile.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user) session.user.id = token.spotifyId;
      return session;
    },
  },
};
export const handler = NextAuth(authOptions);
export async function getSession() {
  return configured ? getServerSession(authOptions) : null;
}

