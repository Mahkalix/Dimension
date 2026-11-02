# Auth0 email/password setup

The app uses `@auth0/nextjs-auth0` v4 with Authorization Code + PKCE (S256), state and nonce verification. Email/password entry, invalid-credential errors, password recovery and account creation are handled by Auth0 Universal Login. The Den does not receive or store passwords. The SDK uses encrypted, HttpOnly cookies; production cookies are Secure. Sessions roll on activity, expire after one day of inactivity and have an absolute lifetime of seven days.

## Application and Database Connection

1. In Auth0 → Applications → Applications, open the application for The Den. Its type must be **Regular Web Application**, with token endpoint authentication set to **Post**. Enable Authorization Code. This is a server application, not a browser-only SPA.
2. In Authentication → Database, enable `Username-Password-Authentication` for this application. Allow email/password signup (turn off **Disable Sign Ups**). If your connection has another name, set `AUTH0_CONNECTION` to that exact name. Disable social connections for this application's login if you want only email/password.
3. Use Universal Login. Set its default language to English. The SDK also requests `ui_locales=en`. Match Auth0 branding to the existing paper/graphite tokens if the hosted screen's branding is configurable on your plan. Local login and account pages already use existing tokens and components.

## Exact URL allowlists

For local development and production, use these comma-separated values:

**Allowed Callback URLs**

```text
http://localhost:3000/auth/callback,http://127.0.0.1:3000/auth/callback,https://dimension-gamma.vercel.app/auth/callback
```

**Allowed Logout URLs**

```text
http://localhost:3000,http://127.0.0.1:3000,https://dimension-gamma.vercel.app
```

**Allowed Web Origins**

```text
http://localhost:3000,http://127.0.0.1:3000,https://dimension-gamma.vercel.app
```

For each stable Vercel preview URL you actually use, add its exact origin to Logout URLs and Web Origins, and that origin followed by `/auth/callback` to Callback URLs. Do not add path segments to Web Origins. Avoid broad wildcard domains. The existing player branch preview is:

```text
https://dimension-git-codex-the-den-player-mahkalixs-projects.vercel.app
```

When using port 3140 or 3141 for a real authentication test, add the corresponding exact localhost origin and callback as well. Protected Vercel previews must allow the browser to return through deployment protection.

## Server environment

Copy `.env.example` into `.env.local`. In Vercel, set values in the required Preview and Production environments:

| Variable | Value |
| --- | --- |
| `AUTH0_DOMAIN` | `dev-s4cqy56nmufsd1nf.us.auth0.com` |
| `AUTH0_CLIENT_ID` | `wu1hMC3jEzhtP8te5ChZ08FpuCfV8C17` |
| `AUTH0_CLIENT_SECRET` | Client Secret from the Auth0 application; server only |
| `AUTH0_SECRET` | A stable, random 32-byte hex string used to encrypt session cookies |
| `AUTH0_CONNECTION` | `Username-Password-Authentication`, or your actual Database Connection name |
| `APP_BASE_URL` | `http://localhost:3000` locally, `https://dimension-gamma.vercel.app` in Production |

Generate `AUTH0_SECRET` with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`. Do not prefix any of these values with `NEXT_PUBLIC_`. Do not commit `.env.local`. Keep the session secret stable between deployments; changing it signs out existing users.

On Vercel Preview, omit `APP_BASE_URL` unless setting it for one specific branch. The app derives the stable origin from `VERCEL_BRANCH_URL`. A globally applied production URL in Preview would send callbacks to the wrong deployment. Redeploy after changing environment variables.

The inspected Vercel project already has Domain, Client ID and a session encryption secret, but lacks the application Client Secret. This task added `AUTH0_CONNECTION` for Preview/Production and `APP_BASE_URL` for Production as new variables, without overwriting credentials. Sign-in therefore stays disabled with a readable message while public playback works. Obsolete provider environment keys must be removed during the deployment cutover; they were not changed by this task because automated approval rejected repurposing existing credential records. Create new keys rather than renaming old credential records.

## Expected behavior and manual verification

- Opening `/account` without a session redirects to `/login?returnTo=%2Faccount`.
- Sign in and sign up use `/auth/login` with the configured Database Connection; signup adds `screen_hint=signup`.
- Auth0 shows incorrect-password and invalid-email errors on its hosted form, plus password reset. A local callback failure never displays raw provider errors or secrets.
- Successful login returns only to `/account` or `/player`. A supplied external return URL is not accepted by the callback.
- Account name, email, avatar and verification status come directly from `session.user`. There is no second user store.
- Signing out uses `/auth/logout` and clears the SDK session.
- Expired cookies return to login; explicit expiry, service/network and callback failures have readable local messages.
- Test a new signup, wrong password, password reset, login, reload, browser restart, expired session and logout with a real test user after configuring the tenant. No real password was supplied or handled during this implementation.

SDK reference: https://github.com/auth0/nextjs-auth0
