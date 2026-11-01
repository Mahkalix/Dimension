import assert from "node:assert/strict";
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
    await p.locator(".account-menu summary").click();
    assert.match(
      await p
        .getByRole("link", { name: "Se connecter", exact: true })
        .getAttribute("href"),
      /^\/auth\/login/,
    );
    assert.equal(
      await p
        .getByRole("link", { name: "Connecter mon Spotify" })
        .getAttribute("href"),
      "/api/spotify/connect",
    );
    await p.locator(".account-menu summary").click();
    await p
      .locator(".paper-player")
      .getByRole("button", { name: "Lecture", exact: true })
      .click();
    await p.waitForFunction(() => {
      const a = document.querySelector("audio");
      return !a.paused && a.currentTime > 0 && a.duration > 30;
    });
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
