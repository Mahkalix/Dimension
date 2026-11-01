import assert from "node:assert/strict";
import { chromium } from "playwright-core";
const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  const page = await browser.newPage({
    viewport: { width: 1280, height: 720 },
  });
  await page.goto(process.env.TEST_URL || "http://127.0.0.1:3137");
  await page.getByRole("link", { name: "Entrer" }).waitFor();
  await page.evaluate(() => Promise.all(document.getAnimations().map(a=>a.finished))); await page.screenshot({ path: "docs/screens/accueil.png" });
  for (const [key, label] of [
    ["ArrowDown", "Entrer"],
    ["ArrowRight", "Entrer"],
    ["ArrowDown", "Entrer"],
    ["ArrowLeft", "Entrer"],
    ["ArrowUp", "Entrer"],
  ]) {
    await page.keyboard.press(key);
    assert.equal(await page.locator(":focus").innerText(), label);
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


