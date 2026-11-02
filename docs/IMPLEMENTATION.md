# Implementation report

Branch: `codex/auth0-english-library`, created before edits from `codex/the-den-player`.

## 1. Previous streaming integration

Removed its OAuth provider, API compatibility route, account button, SDK dependency, environment templates and unused icon. Also removed unreferenced legacy screens and entry points containing obsolete integrations or non-English copy. The active Next.js architecture is unchanged. Repository searches for the removed provider return no matches. Local obsolete environment entries were removed without exposing values.

Vercel's existing credential variables remain unchanged. Automated approval rejected repurposing two old credential records because this would destroy credentials and could break the currently deployed branch. A separate attempt to change a Sensitive variable's type was rejected by Vercel. Instead, new `AUTH0_CONNECTION` (Preview/Production) and `APP_BASE_URL` (Production only) variables were created successfully. Remove obsolete provider credentials during cutover, after the new branch and Auth0 configuration are ready.

## 2. Auth0

Installed the official Next.js SDK v4. Email/password uses an Auth0 Database Connection through hosted Universal Login, Authorization Code + PKCE S256, state and nonce. Server-only environment values, encrypted HttpOnly sessions, login/signup/logout, account protection, loading and error screens are implemented. The account identity comes directly from SDK session claims. Sessions roll on activity, expire after one day of inactivity and at seven days absolute.

The SDK's login/signup request parameters, transaction cookie, logout cookie clearing, invalid callback handling and protected route were verified using a temporary local wiring-test client secret. This does not establish a real authenticated session. The real application Client Secret is missing; new-user signup, successful password login, incorrect-password handling, persistent real session and expiry must be exercised after dashboard configuration. Universal Login handles invalid credentials and password reset.

Exact dashboard allowlists, application type and environment values: [AUTHENTICATION.md](AUTHENTICATION.md).

## 3. One account

One Account menu and one `/account` page replace the separate account/profile routes. No local profile store or duplicated user fields remain. Existing Settings and Extras navigation remains accessible on desktop and mobile. The redundant standalone settings route was removed; the in-app settings screen remains.

## 4. Library

30 recordings by three artists, with acoustic, ambient, jazz, bossa nova, lounge, world, hip-hop, rock and house selections. Actual durations range from 1:46 to 8:52. Twenty-one MP3s are local and nine M4As use the artist's host. All 30 produced valid media metadata in Chrome. Source, license, attribution and measured duration are stored for every recording and available in Credits. No demonstration placeholders or invented audio URLs are used.

Validation runs when the data module loads. It rejects duplicate IDs, normalized title + artist duplicates, missing source/license metadata, invalid durations and broken playlist references. Library regression tests also cover these failures. Existing playlist photos and artwork remain.

## 5. Playback

Click, Enter or Space starts the selected track and opens its preview. Activating the current track toggles pause/resume. The dock updates the track, artwork, playback state, duration and progression; the list marks the current recording. Missing media produces a readable error; Retry reloads a failed source. End of playback consumes the queue or advances to the next library recording. The initial queue is empty rather than forcing an unrelated seeded recording.

## 6. English

Translated active UI, page metadata, playlist copy, alternatives, accessible labels, statuses, settings and public asset descriptions. HTML and manifest use English. Durations use `m:ss`; volume is a percentage. Names of existing image files and internal playlist IDs were retained to avoid unnecessary asset churn. They are not visible copy. Removed outdated non-English documentation and tests, replacing them with current English documentation and checks.

## 7. Preview

The preview uses grid rows `auto minmax(0,1fr) auto`, `min-height:0`, viewport-relative height and contained artwork. Track information and controls keep their space while artwork shrinks. Secondary source/queue cards were removed from this panel; full credits and queue remain available in their existing destinations. Mobile keeps the full-page preview and return control. The decorative neighboring cover is condensed on short screens.

Checked Chrome at widths 360, 390, 700, 701, 820, 1024, 1280 and 1440, all with height 600: no panel scroll, visible controls and metadata, no horizontal page overflow. No content-clipping workaround was introduced. Example screenshots: `docs/screens/english-390.png` and `docs/screens/english-1280.png`.

## 8. House

The request left the smoke choice unspecified, so smoke was removed. Its DOM element and animation were deleted. The approved house artwork, including its drawn flames, is unchanged. The house/name intro and automatic entry remain; reduced motion is respected.

## Verification and limits

- `npm test`: data validity and duplicate rejection.
- `npm run build`: production compilation and type checks pass. The current Auth0 SDK emits a Webpack warning for its optional dynamic DPoP import; no Edge runtime incompatibility remains because middleware uses the supported Node.js runtime.
- `scripts/check-media.mjs`: valid metadata from all 30 real audio sources.
- `scripts/check-interface.mjs`: real Chrome playback, keyboard, pause/resume, queue advancement, volume, search/empty state, failed-file recovery, protected account and responsive panel geometry.
- `scripts/check-auth.mjs`: SDK-generated PKCE/state/nonce requests and error/logout routing with temporary wiring-test configuration.
- Dependency audit reports two advisories through Next.js's existing PostCSS dependency. A framework major-version upgrade is outside this targeted change and was not performed.
- Physical devices, Safari/iOS, Firefox, audible output through speakers, slow/offline external audio, and a physical e-paper screen were not tested. E-paper is the visual direction, not a hardware refresh guarantee.
- Real Auth0 signup/login/session persistence/expiry are not verified until the missing secret and tenant allowlists are configured. Authentication is intentionally unavailable when server configuration is incomplete, while guest playback continues.
- Playlist photographs are user-supplied/editorial references; their redistribution rights were not verified. Their licenses are separate from the CC BY audio licenses.

## File inventory

The PR's Files changed tab contains the complete created/modified/deleted file list. A separate local inventory was delivered with the implementation report; old integration filenames are kept out of the live repository so reference searches remain clean.
