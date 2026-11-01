import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { auth, appOrigin } from "../../../../lib/identity";

const redirect = (path) => NextResponse.redirect(new URL(path, appOrigin), 303);
export async function GET(request, { params }) {
  const { action } = await params;
  if (!auth)
    return NextResponse.redirect(new URL("/?error=config", request.url));
  const session = await auth.getSession();
  if (!session)
    return redirect(
      action === "connect"
        ? "/auth/login?returnTo=/api/spotify/connect"
        : "/?error=session",
    );
  const client = process.env.SPOTIFY_CLIENT_ID,
    secret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!client || !secret) return redirect("/?error=spotify-config");
  const callback = new URL("/api/spotify/callback", appOrigin).href;
  if (action === "connect") {
    const state = randomBytes(32).toString("hex");
    await auth.updateSession({
      ...session,
      spotifyRequest: { state, expires: Date.now() + 600000 },
    });
    const url = new URL("https://accounts.spotify.com/authorize");
    url.search = new URLSearchParams({
      client_id: client,
      response_type: "code",
      redirect_uri: callback,
      state,
      scope: "user-read-private",
      show_dialog: "true",
    });
    return NextResponse.redirect(url);
  }
  if (action !== "callback") return new Response(null, { status: 404 });
  const qp = request.nextUrl.searchParams,
    pending = session.spotifyRequest;
  if (
    !pending ||
    pending.expires < Date.now() ||
    pending.state !== qp.get("state")
  )
    return redirect("/?error=state");
  delete session.spotifyRequest;
  await auth.updateSession(session);
  if (qp.has("error") || !qp.get("code")) return redirect("/?error=consent");
  try {
    const token = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization:
          "Basic " + Buffer.from(client + ":" + secret).toString("base64"),
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: qp.get("code"),
        redirect_uri: callback,
      }),
      cache: "no-store",
    });
    if (!token.ok) throw Error();
    const { access_token } = await token.json();
    const profile = await fetch("https://api.spotify.com/v1/me", {
      headers: { Authorization: "Bearer " + access_token },
      cache: "no-store",
    });
    if (!profile.ok) throw Error();
    const data = await profile.json();
    if (!data.id) throw Error();
    await auth.updateSession({
      ...session,
      spotify: {
        id: data.id,
        name: data.display_name || data.id,
        avatar: data.images?.[0]?.url || null,
      },
    });
    return redirect("/player");
  } catch {
    return redirect("/?error=spotify");
  }
}
export async function POST(request, { params }) {
  if ((await params).action !== "disconnect")
    return new Response(null, { status: 404 });
  if (!auth || request.headers.get("origin") !== new URL(appOrigin).origin)
    return new Response(null, { status: 403 });
  const session = await auth.getSession();
  if (!session) return redirect("/?error=session");
  delete session.spotify;
  delete session.spotifyRequest;
  await auth.updateSession(session);
  return redirect("/player");
}
