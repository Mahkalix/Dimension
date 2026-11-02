import assert from "node:assert/strict";
import fs from "node:fs";
import { chromium } from "playwright-core";
const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  for (const viewport of [
    { width: 1280, height: 720 },
    { width: 390, height: 844 },
  ]) {
    const p = await browser.newPage({ viewport });
    p.setDefaultTimeout(15000);
    const requests = [];
    p.on("request", (r) => requests.push(r.url()));
    await p.goto(process.env.TEST_URL);
    await p.waitForURL("**/player");
    assert.equal(await p.locator("iframe").count(), 0);
    assert.equal(await p.locator("audio").evaluate((a) => a.paused), true);
    if (viewport.width > 700) {
      const rail = await p.locator(".rail").boundingBox();
      assert.equal(rail.x, 0);
      assert.equal(rail.height, viewport.height);
      const nav = await p.locator(".rail nav").boundingBox();
      assert.ok(nav.width >= 200);
    }
    if (viewport.width > 700) {
      for (const width of [1280, 1440]) {
        await p.setViewportSize({ width, height: 720 });
        const rows = await p.locator(".rail nav button").all();
        assert.equal(rows.length, 4);
        for (let i = 1; i < rows.length; i++) {
          const prev = await rows[i - 1].boundingBox(),
            next = await rows[i].boundingBox();
          assert.ok(
            next.y - prev.y - prev.height <= 8,
            "Navigation rows must stay grouped",
          );
        }
        assert.ok(!(await p.locator(".rail footer").innerText()).includes("·"));
        const footer = await p.locator(".rail footer").boundingBox();
        assert.ok(footer.y + footer.height <= 720);
      }
      await p.setViewportSize(viewport);
    }
    await p.locator(".account-menu summary").click();
    await p.getByRole("button", { name: "Continuer avec Spotify" }).waitFor();
    await p.getByRole("link", { name: "Mon profil", exact: true }).click();
    await p.getByRole("heading", { name: "Mon profil" }).waitFor();
    await p.getByRole("button", { name: "Continuer avec Spotify" }).waitFor();
    await p.getByRole("link", { name: "Retour à la musique" }).click();
    assert.equal(await p.locator(".track").count(), 7);
    await p
      .locator(".paper-player")
      .getByRole("button", { name: "Lecture", exact: true })
      .click();
    await p.waitForFunction(() => {
      const a = document.querySelector("audio");
      return !a.paused && a.currentTime > 0 && a.duration > 30;
    });
    if (viewport.width === 1280) {
      const tracks = JSON.parse(
        fs.readFileSync(new URL("../src/data/selection.json", import.meta.url)),
      );
      for (const track of tracks) {
        const duration = await p.evaluate(
          (url) =>
            new Promise((resolve, reject) => {
              const audio = new Audio();
              audio.onloadedmetadata = () => {
                const duration = audio.duration;
                audio.removeAttribute("src");
                audio.load();
                resolve(duration);
              };
              audio.onerror = () => reject(new Error("Audio indisponible"));
              audio.src = url;
            }),
          track.url,
        );
        assert.ok(duration > 30, track.title);
      }
    }
    await p.locator(".paper-volume summary").click();
    await p.getByRole("slider", { name: "Volume", exact: true }).fill("0.35");
    assert.equal(await p.locator("audio").evaluate((a) => a.volume), 0.35);
    await p.getByRole("slider", { name: "Position de lecture" }).fill("20");
    await p.waitForFunction(
      () => document.querySelector("audio").currentTime >= 19,
    );
    await p.locator(".paper-volume summary").click();
    await p
      .locator(".paper-player")
      .getByRole("button", { name: "Pause", exact: true })
      .click();
    assert.equal(await p.locator("audio").evaluate((a) => a.paused), true);
    await p
      .locator(".paper-player")
      .getByRole("button", { name: "Morceau suivant" })
      .click();
    await p.waitForFunction(() =>
      document.querySelector("audio").getAttribute("src").includes("carefree"),
    );
    await p.waitForFunction(() => !document.querySelector("audio").paused);
    assert.equal(await p.locator("iframe").count(), 0);
    assert.equal(
      requests.some((u) => /youtube|googlevideo/.test(u)),
      false,
    );
    await p.screenshot({
      path: "docs/screens/audio-" + viewport.width + ".png",
    });
    await p.getByRole("button", { name: "Écouter", exact: true }).click();
    await p.screenshot({
      path: "docs/screens/ecouter-" + viewport.width + ".png",
    });
    await p.close();
  }
  const p = await browser.newPage({ reducedMotion: "reduce" });
  p.setDefaultTimeout(15000);
  await p.goto(process.env.TEST_URL);
  await p.waitForURL("**/player");
  assert.equal(await p.locator("audio").evaluate((a) => a.paused), true);
  console.log(
    "Entrée automatique, navigation, compte, audio réel, pause, volume, seek et morceau suivant vérifiés sur mobile et tablette.",
  );
} finally {
  await browser.close();
}
