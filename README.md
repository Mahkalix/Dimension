# The Den

Imagine Carmy alone in the kitchen at *The Bear*. A stockpot is already on the stove. His notebook is open on the counter, and in the margin of yesterday’s prep list he’s scribbled the name of a record. He has a few minutes before the others arrive. He wipes his hands on his apron, finds the track and lets it play. What would the player under his hand look like?

The Den started with that question. Its little house emblem could be a mark Carmy drew on a scrap of paper. The muted grays and paper-like surfaces belong beside his handwritten notes. Open the library, pick a record and queue the next track. For a moment, you get to decide what’s playing when someone pushes through the kitchen door.

## Run

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Music works without signing in. Email/password authentication needs an Auth0 Regular Web Application and a Database Connection. See [authentication setup](docs/AUTHENTICATION.md) for the exact dashboard values and server-only variables.

## Routes

- `/`: animated house introduction; the house is clickable and the intro also enters the app automatically. Reduced motion is respected.
- `/player`: listening dashboard with a featured playlist, house picks, genre shortcuts and a horizontal playlist shelf. The sidebar opens the library; the header provides search and the player provides the queue; the bottom player keeps audio controls available throughout. Settings and credits remain in the Account menu.
- `/login`: sign-in / sign-up entry, configuration and readable authentication errors.
- `/account`: protected account, displaying only identity claims from Auth0.
- `/auth/login`, `/auth/callback`, `/auth/logout`: handled by the official Auth0 SDK.

## Music and rights

The library contains 30 distinct recordings by Kevin MacLeod, Chris Zabriskie and Jason Shaw under CC BY 4.0. It includes ambient, acoustic, jazz, bossa nova, world, lounge, hip-hop, rock and house. Twenty-one MP3s are local; nine M4A recordings stream from the artist's own host. Every recording has a source, attribution, license and measured duration in `src/data/selection.json`. Full credits: [audio licenses](public/music/den/LICENSE.md), also available in the app under Extras → Credits.

Playlist photographs from The Bear were supplied by the project owner or referenced from editorial publications. They are separate from the freely licensed audio: publication rights for these photos have not been verified.

The data module validates IDs, normalized title/artist pairs, durations, rights metadata and playlist references whenever loaded. It fails clearly on invalid data. No generated audio URLs or fabricated recordings are used.

## Verify

```sh
npm test
npm run build
npm start -- --port 3140
```

With the server running, set `TEST_URL=http://localhost:3140` and run `npm run test:ui`. The script uses installed Chrome and checks eight widths at 600 px height, real audio playback, keyboard activation, queue advancement, missing files, volume, search, account protection and error pages. It also checks dashboard playback, playlist queues, genre filters, the playlist shelf, seeking, settings and the preview's transition between mobile and desktop. Set `SCREENSHOT_DIR` to save test captures outside `docs/screens`. `npm run test:media` independently loads all 30 audio files in Chrome and refreshes measured durations. It requires internet access for the artist-hosted tracks.

See [implementation report](docs/IMPLEMENTATION.md) for scope, remaining setup and verification limits.
