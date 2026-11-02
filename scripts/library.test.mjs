import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { validateLibrary } from "../src/data/validateLibrary.js";
const tracks = JSON.parse(
  fs.readFileSync(new URL("../src/data/selection.json", import.meta.url)),
);
const playlists = JSON.parse(
  fs.readFileSync(new URL("../src/data/playlists.json", import.meta.url)),
);
test("library contains at least 30 distinct licensed playable recordings", () => {
  assert.ok(tracks.length >= 30);
  validateLibrary(tracks, playlists);
  for (const t of tracks)
    if (t.url.startsWith("/"))
      assert.ok(fs.existsSync(new URL("../public" + t.url, import.meta.url)));
});
test("reject duplicate IDs and normalized title/artist pairs", () => {
  assert.throws(
    () => validateLibrary([...tracks, { ...tracks[0] }], playlists),
    /Duplicate/,
  );
  assert.throws(
    () =>
      validateLibrary(
        [
          ...tracks,
          {
            ...tracks[0],
            id: "different",
            title: " " + tracks[0].title.toUpperCase() + "  ",
          },
        ],
        playlists,
      ),
    /Duplicate/,
  );
});
test("reject missing rights information, invalid duration and broken playlist references", () => {
  assert.throws(
    () => validateLibrary([{ ...tracks[0], sourceUrl: "" }], []),
    /source/,
  );
  assert.throws(
    () => validateLibrary([{ ...tracks[0], duration: Infinity }], []),
    /duration/,
  );
  assert.throws(
    () => validateLibrary(tracks, [{ id: "broken", tracks: ["missing"] }]),
    /Invalid playlist/,
  );
});
