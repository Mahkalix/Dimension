import { test } from "node:test";
import assert from "node:assert/strict";
import { normalizePlaylist, playlistShareHash, readSharedPlaylist } from "../src/lib/playlists.js";

const tracks = [{ id: "a" }, { id: "b" }];
const covers = ["/images/playlists/love.jpg"];
test("shared playlists preserve Unicode names and ordered tracks", () => {
  const playlist = { title: "À deux ❤️", tracks: ["b", "a"], cover: covers[0] };
  const restored = readSharedPlaylist(playlistShareHash(playlist), tracks, covers);
  assert.equal(restored.title, playlist.title);
  assert.deepEqual(restored.tracks, ["b", "a"]);
  assert.equal(restored.cover, covers[0]);
});
test("shared input cannot introduce remote images or unknown recordings", () => {
  const result = normalizePlaylist({ title: "Mix", tracks: ["a", "unknown", "a", "b"], cover: "https://example.com/tracker" }, tracks, covers);
  assert.equal(result.cover, covers[0]);
  assert.deepEqual(result.tracks, ["a", "b"]);
  assert.equal(normalizePlaylist({ title: " ", tracks: ["a"] }, tracks, covers), null);
  assert.equal(normalizePlaylist({ title: "Mix", tracks: ["unknown"] }, tracks, covers), null);
  assert.equal(readSharedPlaylist("#playlist=%invalid", tracks, covers), null);
  assert.equal(readSharedPlaylist("#playlist=" + "a".repeat(20001), tracks, covers), null);
});
