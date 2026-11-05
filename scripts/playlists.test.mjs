import { test } from "node:test";
import assert from "node:assert/strict";
import { genericCover, normalizePlaylist, playlistShareHash, readSharedPlaylist } from "../src/lib/playlists.js";

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
  assert.equal(result.cover, genericCover);
  assert.deepEqual(result.tracks, ["a", "b"]);
  assert.equal(normalizePlaylist({ title: " ", tracks: ["a"] }, tracks, covers), null);
  assert.equal(normalizePlaylist({ title: "Mix", tracks: ["unknown"] }, tracks, covers), null);
  assert.equal(readSharedPlaylist("#playlist=%invalid", tracks, covers), null);
  assert.equal(readSharedPlaylist("#playlist=" + "a".repeat(20001), tracks, covers), null);
});

test("empty playlists preserve description and generic cover", () => {
 const p = readSharedPlaylist(playlistShareHash({title:"New",tracks:[],description:"For us",cover:genericCover}),tracks,covers);
 assert.deepEqual(p.tracks,[]); assert.equal(p.description,"For us"); assert.equal(p.cover,genericCover);
});
test("uploaded covers remain local", () => {
 const p={title:"Photo",tracks:[],cover:"data:image/jpeg;base64,YQ=="};
 assert.equal(normalizePlaylist(p,tracks,covers).cover,p.cover);
 assert.equal(readSharedPlaylist(playlistShareHash(p),tracks,covers).cover,genericCover);
});
