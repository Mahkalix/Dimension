import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import assert from "node:assert/strict";
import { chromium } from "playwright-core";
const root = path.resolve("public");
const server = http.createServer((req, res) => {
  if (req.url === "/") {
    res.setHeader("Content-Type", "text/html");
    res.end('<html lang="en"><title>Media check</title></html>');
    return;
  }
  const file = path.resolve(root, "." + decodeURIComponent(req.url));
  if (!file.startsWith(root + path.sep) || !fs.existsSync(file)) {
    res.writeHead(404);
    res.end();
    return;
  }
  res.setHeader("Content-Type", "audio/mpeg");
  res.setHeader("Content-Length", fs.statSync(file).size);
  fs.createReadStream(file).pipe(res);
});
await new Promise((resolve) => server.listen(3142, "127.0.0.1", resolve));
const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  const tracks = JSON.parse(fs.readFileSync("src/data/selection.json", "utf8"));
  const page = await browser.newPage();
  await page.goto("http://127.0.0.1:3142/");
  const failures = [];
  for (const t of tracks) {
    const result = await page.evaluate(
      ({ url }) =>
        new Promise((resolve) => {
          const a = new Audio();
          let timer = setTimeout(
            () => done({ error: "metadata timeout" }),
            20000,
          );
          function done(value) {
            clearTimeout(timer);
            a.removeAttribute("src");
            a.load();
            resolve(value);
          }
          a.onloadedmetadata = () => done({ duration: a.duration });
          a.onerror = () => done({ error: "media error " + a.error?.code });
          a.preload = "metadata";
          a.src = url;
        }),
      { url: t.url.startsWith("/") ? "http://127.0.0.1:3142" + t.url : t.url },
    );
    if (result.error || !Number.isFinite(result.duration)) {
      failures.push(t.title + ": " + (result.error || "invalid duration"));
      console.log("FAIL", t.title, result.error || "invalid duration");
    } else {
      t.duration = Math.round(result.duration);
      console.log("OK", t.title, t.duration);
    }
  }
  fs.writeFileSync(
    "src/data/selection.json",
    JSON.stringify(tracks, null, 2) + "\n",
  );
  assert.deepEqual(failures, []);
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
