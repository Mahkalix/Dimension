import assert from "node:assert/strict";
import { chromium } from "playwright-core";
const browser = await chromium.launch({ channel: "chrome" });
try {
  for (const width of [1280, 390]) {
    const p = await browser.newPage({
      viewport: { width, height: width === 390 ? 844 : 720 },
    });
    await p.goto(process.env.TEST_URL + "/player");
    const button = (name) => p.getByRole("button", { name, exact: true });
    await p.locator(".collections button").first().click();
    await p.getByRole("heading", { name: "Après le service" }).waitFor();
    await p.locator(".track").last().click();
    if (width > 700) {
      await p
        .getByRole("complementary", { name: "Fiche du morceau" })
        .waitFor();
      assert.equal(await p.locator("dialog").evaluate((n) => n.open), false);
      await p.getByRole("heading", { name: "Après le service" }).waitFor();
      const panel = await p.locator(".track-preview").boundingBox();
      const dock = await p.locator(".paper-player").boundingBox();
      assert.ok(
        dock.x + dock.width <= panel.x,
        "Player must not cover the side panel",
      );
      await p.setViewportSize({ width: 390, height: 844 });
      await p.waitForFunction(() => document.querySelector("dialog").open);
      await p.setViewportSize({ width: 1280, height: 720 });
      await p
        .getByRole("complementary", { name: "Fiche du morceau" })
        .waitFor();
      await p.screenshot({ path: "docs/screens/fiche-laterale.png" });
      await p.keyboard.press("Escape");
      assert.equal(await p.locator(".track-preview").count(), 0);
      await p.locator(".track").last().press("Enter");
    }
    await button("Ajouter à la file").click();
    assert.equal(await p.locator(".track").count(), width === 390 ? 2 : 7);
    if (width > 700) await p.keyboard.press("Escape");
    if (width === 390) await p.locator(".account-menu summary").click();
    await button("Extras").click();
    await p.locator(".menu-row").first().click();
    assert.equal(await p.locator(".menu-row").count(), 7);
    if (width === 390) await p.locator(".account-menu summary").click();
    await button("Réglages").click();
    await p.locator(".menu-row").first().click();
    await p.getByRole("button", { name: "35 %" }).click();
    assert.equal(
      await p
        .getByRole("button", { name: "35 %" })
        .getAttribute("aria-pressed"),
      "true",
    );
    await p.screenshot({ path: "docs/screens/volume-" + width + ".png" });
    await button("Écouter").click();
    await p.locator(".track").first().click();
    await p
      .getByRole(width === 390 ? "dialog" : "complementary", {
        name: "Fiche du morceau",
      })
      .getByRole("button", { name: "Écouter" })
      .click();
    if (width === 390)
      await p
        .getByRole("heading", { name: "Local Forecast - Elevator" })
        .waitFor();
    else {
      await p.getByRole("heading", { name: "Écouter", exact: true }).waitFor();
      await p.waitForFunction(() => !document.querySelector("audio").paused);
    }
    await p.close();
  }
  console.log(
    "Collection, fiche, file, crédits, volume et lecture vérifiés aux deux formats",
  );
} finally {
  await browser.close();
}
