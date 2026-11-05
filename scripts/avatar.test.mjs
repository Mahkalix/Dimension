import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const avatars = JSON.parse(fs.readFileSync(new URL("../src/data/avatars.json", import.meta.url)));
const source = fs.readFileSync(new URL("../src/lib/avatar.js", import.meta.url), "utf8")
  .replace('import avatars from "../data/avatars.json";', `const avatars = ${JSON.stringify(avatars)};`);
const { readAvatar, saveAvatar, validAvatar, avatarKey, defaultAvatar, prepareAvatar } =
  await import(`data:text/javascript;base64,${Buffer.from(source).toString("base64")}`);

test("profile photos persist by account and reject untrusted URLs", () => {
  const values = new Map();
  globalThis.localStorage = { getItem: k => values.get(k), setItem: (k, v) => values.set(k, v) };
  globalThis.window = new EventTarget();
  saveAvatar("account-a", avatars[0].image);
  assert.equal(readAvatar("account-a"), avatars[0].image);
  assert.equal(readAvatar("account-b"), defaultAvatar);
  assert.equal(readAvatar(undefined), defaultAvatar);
  saveAvatar("account-a", defaultAvatar);
  assert.equal(readAvatar("account-a"), defaultAvatar);
  values.set(avatarKey("account-b"), "https://untrusted.example/photo.jpg");
  assert.equal(readAvatar("account-b"), defaultAvatar);
  assert.equal(validAvatar("data:image/svg+xml;base64,abc"), false);
  assert.equal(validAvatar("data:image/jpeg;base64," + "a".repeat(400001)), false);
  assert.throws(() => saveAvatar(undefined, defaultAvatar));
  globalThis.localStorage = { getItem() { throw Error("blocked"); }, setItem() { throw Error("full"); } };
  assert.equal(readAvatar("account-a"), defaultAvatar);
  assert.throws(() => saveAvatar("account-a", defaultAvatar));
  delete globalThis.localStorage;
  delete globalThis.window;
});

test("upload rejects unsupported formats and oversized files before decoding", async () => {
  await assert.rejects(prepareAvatar({ type: "image/svg+xml", size: 10 }), /JPG/);
  await assert.rejects(prepareAvatar({ type: "image/jpeg", size: 9 * 1024 * 1024 }), /8 MB/);
});

test("all character choices have unique IDs, local images and sources", () => {
  assert.equal(new Set(avatars.map(a => a.id)).size, avatars.length);
  for (const avatar of avatars) {
    assert.ok(avatar.name && avatar.source);
    assert.ok(fs.existsSync(new URL("../public" + avatar.image, import.meta.url)));
  }
});
