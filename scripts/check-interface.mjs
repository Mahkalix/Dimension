import assert from "node:assert/strict";
import fs from "node:fs";
import { chromium } from "playwright-core";
const origin = process.env.TEST_URL || "http://localhost:3140";
const browser = await chromium.launch({ channel: "chrome", headless: true });
const results = [];
try {
  for (const width of [360, 390, 700, 701, 820, 1024, 1280, 1440]) {
    const context = await browser.newContext({
      viewport: { width, height: 600 },
    });
    const page = await context.newPage();
    page.setDefaultTimeout(12000);
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(origin + "/player");
    assert.equal(await page.locator("html").getAttribute("lang"), "en");
    assert.equal(await page.locator(".track").count(), 30);
    assert.equal(await page.locator("iframe").count(), 0);
    await page.locator(".track").first().click();
    await page.waitForFunction(
      () =>
        !document.querySelector("audio").paused &&
        document.querySelector("audio").currentTime > 0,
    );
    const panel = page.locator(
      width <= 700 ? "dialog[open]" : ".track-preview",
    );
    await panel.waitFor({ state: "visible" });
    const geometry = await panel.evaluate((el) => ({
      height: el.clientHeight,
      scroll: el.scrollHeight,
      box: el.getBoundingClientRect().toJSON(),
      children: [...el.querySelectorAll("button,figcaption")].map((n) => ({
        text: n.textContent,
        box: n.getBoundingClientRect().toJSON(),
      })),
    }));
    assert.ok(
      geometry.scroll <= geometry.height + 1,
      JSON.stringify({ width, geometry }),
    );
    assert.ok(geometry.box.bottom <= 601, JSON.stringify({ width, geometry }));
    for (const child of geometry.children)
      assert.ok(
        child.box.top >= 0 &&
          child.box.bottom <= 600 &&
          child.box.right <= width + 1,
        JSON.stringify({ width, child }),
      );
    assert.equal(await page.locator('.track[aria-current="true"]').count(), 1);
    await panel
      .getByRole("button", { name: "Add to queue", exact: true })
      .click();
    assert.ok(
      await panel.evaluate((el) => el.scrollHeight <= el.clientHeight + 1),
    );
    await panel
      .getByRole("button", { name: "Back to tracks", exact: true })
      .click();
    await page.locator(".track").first().click();
    await page.waitForFunction(() => document.querySelector("audio").paused);
    await panel
      .getByRole("button", { name: "Back to tracks", exact: true })
      .click();
    // Native button activation must handle both keyboard keys.
    await page.locator(".track").first().focus();
    await page.keyboard.press("Enter");
    await page.waitForFunction(() => !document.querySelector("audio").paused);
    await panel
      .getByRole("button", { name: "Back to tracks", exact: true })
      .click();
    await page.locator(".track").first().focus();
    await page.keyboard.press("Space");
    await page.waitForFunction(() => document.querySelector("audio").paused);
    await panel
      .getByRole("button", { name: "Back to tracks", exact: true })
      .click();
    await page.locator('.paper-transport button[aria-label="Play"]').click();
    await page.waitForFunction(() => !document.querySelector("audio").paused);
    await page.locator("audio").evaluate((a) => {
      a.currentTime = a.duration - 0.15;
    });
    await page.waitForFunction(() =>
      document.querySelector("audio").getAttribute("src").includes("carefree"),
    );
    await page.waitForFunction(() => !document.querySelector("audio").paused);
    await page.locator(".paper-volume summary").click();
    await page
      .getByRole("slider", { name: "Volume", exact: true })
      .fill("0.25");
    assert.equal(await page.locator("audio").evaluate((a) => a.volume), 0.25);
    // Missing-file handling uses a real failed media request.
    await page.route("**/music/den/bossa-antigua.mp3", (route) =>
      route.fulfill({ status: 404, body: "Not found" }),
    );
    await page.locator(".track").nth(2).click();
    await page.locator(".audio-error").waitFor();
    assert.match(
      await page.locator(".audio-error").innerText(),
      /unavailable|Playback failed/,
    );
    await panel
      .getByRole("button", { name: "Back to tracks", exact: true })
      .click();
    await page.unroute("**/music/den/bossa-antigua.mp3");
    await page
      .locator(".audio-error")
      .getByRole("button", { name: "Retry", exact: true })
      .click();
    await page.waitForFunction(() => !document.querySelector("audio").paused);
    await page.waitForFunction(() =>
      document
        .querySelector("audio")
        .getAttribute("src")
        .includes("bossa-antigua"),
    );
    await page.locator(".track").nth(1).click();
    await page.waitForFunction(() => !document.querySelector("audio").paused);
    await panel
      .getByRole("button", { name: "Back to tracks", exact: true })
      .click();
    await page.getByRole("button", { name: "Search", exact: true }).click();
    await page.getByRole("searchbox").fill("Cylinder Nine");
    assert.equal(await page.locator(".track").count(), 1);
    await page.getByRole("searchbox").fill("no matching recording");
    await page.getByText("No tracks found.").waitFor();
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
      "Horizontal overflow at " + width,
    );
    assert.deepEqual(errors, []);
    results.push({
      width,
      height: 600,
      panelScroll: false,
      audio: true,
      keyboard: true,
      errorsHandled: true,
    });
    if ([390, 1280].includes(width)) {
      await page.getByRole("button", { name: "Listen", exact: true }).click();
      await page.locator(".track").first().click();
      fs.mkdirSync("docs/screens", { recursive: true });
      await page.screenshot({ path: "docs/screens/english-" + width + ".png" });
    }
    await context.close();
  }
  const page = await browser.newPage({ reducedMotion: "reduce" });
  await page.goto(origin);
  await page.waitForURL("**/player");
  await page.goto(origin + "/account");
  await page.waitForURL("**/login?**");
  await page.getByRole("heading", { name: "Sign in", exact: true }).waitFor();
  await page
    .getByRole("link", { name: "Create an account", exact: true })
    .click();
  await page
    .getByRole("heading", { name: "Create account", exact: true })
    .waitFor();
  await page.goto(origin + "/login?error=session");
  await page
    .getByRole("alert")
    .filter({ hasText: "session has expired" })
    .waitFor();
  await page.goto(origin + "/login?error=network");
  await page
    .getByRole("alert")
    .filter({ hasText: "Check your connection" })
    .waitFor();
  await page.screenshot({ path: "docs/screens/login.png" });
  console.log(JSON.stringify(results, null, 2));
  console.log(
    "Guest access, protected account, signup page, session/network messages, reduced motion, 30 tracks and responsive playback passed.",
  );
} finally {
  await browser.close();
}
