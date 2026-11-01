import assert from "node:assert/strict";
import { chromium } from "playwright-core";
const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  const page = await browser.newPage({
    viewport: { width: 1280, height: 720 },
  });
  await page.goto(process.env.TEST_URL || "http://127.0.0.1:3137");
  await page.getByRole("link", { name: "Entrer dans The Den" }).waitFor();
  for (const viewport of [{width:390,height:844},{width:1280,height:720}]) {
    await page.setViewportSize(viewport);
    const initial=await page.locator('main a[aria-label="Entrer dans The Den"] img').boundingBox();
    for (const time of [0,700,1600,3500]) {
      await page.evaluate(time=>document.getAnimations().forEach(a=>{a.pause();a.currentTime=time}),time);
      const house=await page.locator('main a[aria-label="Entrer dans The Den"] img').boundingBox();
      const word=await page.locator('h1 img').boundingBox();
      assert.ok(Math.abs(house.x+house.width/2-viewport.width/2)<1,'House centered');
      assert.ok(Math.abs(word.x+word.width/2-viewport.width/2)<1,'Wordmark centered');
      assert.ok(Math.abs(house.y-initial.y)<1,'House position stable during animation');
    }
    await page.screenshot({path:viewport.width===390?'docs/screens/accueil-mobile.png':'docs/screens/accueil.png'});
  }  for (const [key] of [
    ["ArrowDown", "Entrer"],
    ["ArrowRight", "Entrer"],
    ["ArrowDown", "Entrer"],
    ["ArrowLeft", "Entrer"],
    ["ArrowUp", "Entrer"],
  ]) {
    await page.keyboard.press(key);
    assert.equal(await page.locator(":focus").getAttribute("aria-label"), "Entrer dans The Den");
  }
  await page.keyboard.press("Enter");
  await page.waitForURL("**/player");
  await page.screenshot({ path: "docs/screens/ecouter-tablette.png" });
  await page.getByRole("button", { name: "Bibliothèque", exact: true }).focus();
  await page.keyboard.press("Enter");
  await page.getByRole("button", { name: "Artistes", exact: true }).click();
  await page.getByRole("button", { name: "Radiohead", exact: true }).click();
  assert.equal(await page.locator(".track").count(), 1);
  await page.getByRole("button", { name: "Morceaux", exact: true }).click();
  await page.screenshot({ path: "docs/screens/bibliotheque.png" });
  await page.locator(".track").first().focus();
  await page.keyboard.press("Enter");
  assert.equal(await page.locator("dialog").evaluate((n) => n.open), true);
  await page.keyboard.press("Escape");
  await page.locator(".track").first().press("Enter");
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Écouter" })
    .press("Enter");
  await page.locator(".source-player").waitFor();
  await page.screenshot({ path: "docs/screens/lecteur.png" });
  await page.keyboard.press("Backspace");
  await page.waitForURL((url) => url.pathname === "/");
  assert.equal(
    (
      await page.request.get(
        new URL("/favicon.ico?v=dimension", page.url()).href,
      )
    ).status(),
    200,
  );
  console.log("1280 × 720 : navigation, fiches, dock et favicon vérifiés");
} finally {
  await browser.close();
}




