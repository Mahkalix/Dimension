import assert from "node:assert/strict";
const origin = process.env.TEST_URL || "http://localhost:3141";
// Run against a server configured with an ephemeral test client secret.
// This verifies SDK wiring and the authorization request, not a real account.
for (const signup of [false, true]) {
  const response = await fetch(
    origin +
      "/auth/login?returnTo=%2Faccount" +
      (signup ? "&screen_hint=signup" : ""),
    { redirect: "manual" },
  );
  assert.equal(response.status, 307);
  const destination = new URL(response.headers.get("location"));
  assert.equal(
    destination.hostname,
    process.env.AUTH0_DOMAIN || "dev-s4cqy56nmufsd1nf.us.auth0.com",
  );
  assert.equal(destination.pathname, "/authorize");
  assert.equal(destination.searchParams.get("response_type"), "code");
  assert.equal(destination.searchParams.get("code_challenge_method"), "S256");
  assert.ok(destination.searchParams.get("code_challenge")?.length >= 43);
  assert.ok(destination.searchParams.get("state"));
  assert.ok(destination.searchParams.get("nonce"));
  assert.equal(
    destination.searchParams.get("connection"),
    "Username-Password-Authentication",
  );
  assert.equal(destination.searchParams.get("ui_locales"), "en");
  assert.equal(
    destination.searchParams.get("redirect_uri"),
    origin + "/auth/callback",
  );
  if (signup)
    assert.equal(destination.searchParams.get("screen_hint"), "signup");
  const cookie = response.headers.get("set-cookie");
  assert.match(cookie, /HttpOnly/i);
  assert.match(cookie, /SameSite=lax/i);
}
const invalid = await fetch(
  origin + "/auth/callback?code=invalid&state=invalid",
  { redirect: "manual" },
);
assert.match(invalid.headers.get("location"), /\/login\?error=auth$/);
const protectedPage = await fetch(origin + "/account", { redirect: "manual" });
// Next.js streams a redirect marker after the account loading boundary.
if (protectedPage.status === 307)
  assert.match(protectedPage.headers.get("location"), /^\/login\?returnTo=/);
else {
  assert.equal(protectedPage.status, 200);
  assert.match(
    await protectedPage.text(),
    /NEXT_REDIRECT;replace;\/login\?returnTo=/,
  );
}
const logout = await fetch(origin + "/auth/logout", { redirect: "manual" });
assert.equal(logout.status, 307);
assert.equal(
  new URL(logout.headers.get("location")).hostname,
  process.env.AUTH0_DOMAIN || "dev-s4cqy56nmufsd1nf.us.auth0.com",
);
assert.match(
  logout.headers.get("set-cookie"),
  /__session=.*?(Max-Age=0|Expires=Thu, 01 Jan 1970)/i,
);
console.log(
  "Auth0 SDK: code + PKCE S256, state, nonce, Database Connection, English login/signup, HttpOnly transaction cookie, invalid callback and protected route passed.",
);
