# The Den

**Your soundtrack. Before service. After hours.**

Made by [@Mahkalix](https://github.com/Mahkalix), for a much-loved friend.

Imagine Carmy alone in the kitchen at *The Bear*. A stockpot is already on the stove. His notebook is open on the counter, and in the margin of yesterday’s prep list he’s scribbled the name of a record. He has a few minutes before the others arrive. He wipes his hands on his apron, finds the track and lets it play. What would the player under his hand look like?

The Den started with that question. Its little house emblem could be a mark Carmy drew on a scrap of paper. The kitchen background, blue accents and transparent surfaces carry that atmosphere into the player. Open the library, pick a record and queue the next track.

## Features

- 51 distinct recordings across seven playlists, with no track shared between playlists.
- Playlist covers, locally saved pins, artist pages, track images, search and a listening queue.
- Persistent player with seeking, mute and a blue volume slider. A side preview shows the current track and credits.
- Clear appearance by default, with Paper, Frosted and Blur alternatives. Appearance, backlight and navigation sounds are saved on the device.
- Kitchen-backed introduction and login, plus a dedication with a Carmy GIF and an option to disable its animation.
- Auth0 login and signup, with a returning-listener screen and persistent sessions lasting up to 30 days. Signing out or clearing cookies ends the remembered session.
- Responsive layouts, keyboard controls, reduced-motion support and contrasting logo badges on playlist covers.

Built with Next.js 15, React 18, Sass and the official Auth0 SDK.

## Run

From the repository's `app` directory, with Node.js 20 or newer:

```sh
npm ci
cp .env.example .env.local
npm run dev
```

In PowerShell, use `Copy-Item .env.example .env.local`. Open [localhost:3000](http://localhost:3000). Keep `.env.local` out of Git and never expose secrets through `NEXT_PUBLIC_` variables.

Music works without signing in. Email/password authentication needs an Auth0 Regular Web Application and a Database Connection. See [authentication setup](docs/AUTHENTICATION.md) for the exact dashboard values and server-only variables.

## Routes

- `/`: animated house introduction; the house is clickable and the intro automatically opens the sign-in screen, with guest access to the player. Reduced motion is respected.
- `/player`: listening dashboard with a featured playlist, house picks, genre shortcuts and a horizontal playlist shelf. The sidebar opens the library; the header provides search and the player provides the queue; the bottom player keeps audio controls available throughout. Settings and credits remain in the Account menu.
- `/login`: kitchen-backed sign-in / sign-up entry after the introduction, with guest access, readable errors and a continue screen for signed-in listeners.
- `/account`: protected account, displaying only identity claims from Auth0.
- `/auth/login`, `/auth/callback`, `/auth/logout`: handled by the official Auth0 SDK.

## Music and rights

The library contains 51 distinct recordings by Kevin MacLeod, Chris Zabriskie and Jason Shaw under CC BY 4.0. It includes ambient, acoustic, jazz, bossa nova, world, lounge, hip-hop, rock, funk, dub and electronic music. Forty-two MP3s are local; nine M4A recordings stream from the artist's own host and depend on its availability. Every recording has a source, attribution, license and measured duration in `src/data/selection.json`. Complete current credits are available in the app under Account → Extras → Credits. The [audio license document](public/music/den/LICENSE.md) lists the original selection.

| Playlist | Tracks |
| --- | ---: |
| After Service | 10 |
| During Service | 7 |
| Washing Up | 6 |
| Money Money | 7 |
| Happiness | 7 |
| Friendship | 8 |
| Chaos | 6 |

Playlist photographs from The Bear were supplied by the project owner or referenced from editorial publications. They are separate from the freely licensed audio: publication rights for these photos have not been verified.

The data module validates IDs, normalized title/artist pairs, durations, rights metadata and playlist references whenever loaded. Library tests also check that playlists cover the catalogue without repeating recordings across playlists.

## Verify

```sh
npm test
npm run build
npm start -- --port 3140
```

With a configured server running, set `TEST_URL` to its origin and run `node scripts/check-auth.mjs` to check Auth0 redirects, PKCE, cookies, invalid callbacks and account protection. This does not replace a real login/signup round trip. Set `APP_BASE_URL` and Auth0 callback/logout allowlists to match the port you use.

`npm run test:ui` uses installed Chrome against `TEST_URL` (default port 3140) for responsive interface and playback checks. Some login-copy assertions still reflect the earlier interface and need updating before treating the full suite as a release gate. Set `SCREENSHOT_DIR` to save captures outside `docs/screens`.

`npm run test:media` loads all 51 recordings in Chrome and **updates measured durations in `selection.json`**. It uses port 3142 and requires internet access for the artist-hosted tracks.

## Deployment

Deploy the `app` directory as a Next.js project on Vercel. Configure server-only Auth0 variables for the intended environment and redeploy after changes. Use the stable preview alias in the exact callback/logout allowlists. Preview origins normally come from `VERCEL_BRANCH_URL`; do not apply a production `APP_BASE_URL` globally to previews.

Deployment protection can redirect unauthenticated command-line checks to Vercel instead of the app. Verify production domains and Auth0 allowlists separately before a production cutover.

The [implementation report](docs/IMPLEMENTATION.md) records earlier work and may describe superseded setup or UI. Refer to current source and [authentication setup](docs/AUTHENTICATION.md) for the present implementation.
