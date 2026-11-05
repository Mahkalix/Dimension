import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright-core";
const origin = process.env.TEST_URL || "http://localhost:3140";
const screenshotDir = process.env.SCREENSHOT_DIR || "docs/screens";
fs.mkdirSync(screenshotDir, { recursive: true });
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
    await page
      .getByRole("heading", { name: "After Service.", exact: true })
      .waitFor();
    assert.equal(await page.locator(".shelf-record").count(), 7);
    assert.equal(await page.locator(".track").count(), 4);
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
      "Dashboard overflow at " + width,
    );
    await page.getByRole("button", { name: "All tracks", exact: true }).click();
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
      children: [
        ...el.querySelectorAll(
          ".preview-topbar button, .preview-controls button",
        ),
      ].map((n) => ({
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
    const pageScroll = await page.evaluate(() => scrollY);
    const scroller = panel.locator(".preview-scroll");
    await scroller.evaluate((el) => el.scrollTo(0, el.scrollHeight));
    assert.ok(await scroller.evaluate((el) => el.scrollTop > 0));
    assert.equal(
      await page.evaluate(() => scrollY),
      pageScroll,
      "Preview scroll must not move the page",
    );
    const relatedButton = panel.locator(".preview-related button").first();
    await relatedButton.scrollIntoViewIfNeeded();
    const relatedBox = await relatedButton.boundingBox();
    const controlsBox = await panel.locator(".preview-controls").boundingBox();
    assert.ok(
      relatedBox.y + relatedBox.height <= controlsBox.y + 1,
      "Related tracks remain above the fixed controls",
    );
    await scroller.evaluate((el) => el.scrollTo(0, 0));
    assert.equal(await page.locator('.track[aria-current="true"]').count(), 1);
    await panel
      .getByRole("button", { name: "Add to queue", exact: true })
      .click();
    assert.equal(
      await panel
        .getByRole("button", { name: "In queue", exact: true })
        .isDisabled(),
      true,
    );
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
    await page.getByRole("searchbox").focus();
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
      independentPreviewScroll: true,
      audio: true,
      keyboard: true,
      errorsHandled: true,
    });
    if ([390, 1280].includes(width)) {
      await page.getByRole("button", { name: "Home", exact: true }).click();
      await page.locator(".track").first().click();
      await page.screenshot({
        path: path.join(screenshotDir, "english-" + width + ".png"),
      });
    }
    await context.close();
  }
  for (const width of [390, 1280]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.goto(origin + "/player");
    const nav = page.getByRole("navigation", { name: "Main navigation" });
    const audio = page.locator("audio");
    assert.equal(
      await page
        .getByRole("slider", { name: "Playback position" })
        .isDisabled(),
      true,
    );
    await page.locator(".spotlight-track").first().click();
    await page.waitForFunction(() => !document.querySelector("audio").paused);
    assert.match(await audio.getAttribute("src"), /tea-roots/);
    assert.equal(
      await page
        .locator(".spotlight-track")
        .first()
        .getAttribute("aria-pressed"),
      "true",
    );
    await page.locator(".spotlight-track").first().click();
    await page.waitForFunction(() => document.querySelector("audio").paused);
    await page
      .getByRole("button", { name: "Play selection", exact: true })
      .click();
    await page.waitForFunction(
      () =>
        !document.querySelector("audio").paused &&
        document.querySelector("audio").duration > 0,
    );
    assert.match(await audio.getAttribute("src"), /airport-lounge/);
    await page.getByRole("slider", { name: "Playback position" }).fill("30");
    assert.ok(
      await audio.evaluate((el) => el.currentTime >= 30 && el.currentTime < 35),
    );
    await (width > 700 ? page.locator(".paper-tools") : nav).getByRole("button", { name: "Up next", exact: true }).click();
    assert.equal(await page.locator(".track").count(), 9);
    assert.match(
      await page.locator(".track").first().innerText(),
      /Cylinder One/,
    );

    await page.getByRole("button", { name: "Home", exact: true }).click();
    await page.getByRole("button", { name: "Jazz", exact: true }).click();
    assert.deepEqual(await page.locator(".track-genre").allTextContents(), [
      "Jazz",
      "Jazz",
      "Jazz",
      "Jazz",
      "Jazz",
    ]);
    await page.getByRole("button", { name: "All genres", exact: true }).click();
    assert.equal(await page.locator(".track").count(), 30);
    await page.getByRole("button", { name: "Home", exact: true }).click();
    await page.locator(".shelf-record").last().click();
    assert.equal(await page.locator("h1").innerText(), "Chaos");
    assert.equal(await page.locator(".track").count(), 2);
    assert.equal(
      await page.evaluate(() => scrollY),
      0,
      "Playlist navigation returns to the heading",
    );
    await page.getByRole("button", { name: "Home", exact: true }).click();
    await page
      .getByRole("button", { name: "All playlists", exact: true })
      .click();
    assert.equal(await page.locator(".collections > button").count(), 7);
    await page.getByRole("searchbox").fill("Carefree");
    assert.equal(await page.locator("h1").innerText(), "Search");
    assert.equal(await page.locator(".track").count(), 1);
    await page.locator(".account-menu summary").click();
    await page
      .locator(".account-menu")
      .getByRole("button", { name: "Settings", exact: true })
      .click();
    await page
      .getByRole("button", { name: "Chrome intensity", exact: false })
      .click();
    await page.getByRole("button", { name: "Polished", exact: true }).click();
    assert.equal(
      await page.locator(".den").getAttribute("data-chrome"),
      "Polished",
    );
    await page.getByRole("button", { name: "Home", exact: true }).click();
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({
      path: path.join(screenshotDir, "listen-" + width + ".png"),
    });
    assert.deepEqual(
      await page
        .locator("main img")
        .evaluateAll((images) =>
          images
            .filter((img) => !img.complete || !img.naturalWidth)
            .map((img) => img.src),
        ),
      [],
    );
    if (width === 1280) {
      await page.locator(".track").first().click();
      await page.locator(".track-preview").waitFor();
      await page.setViewportSize({ width: 700, height: 900 });
      await page.locator("dialog[open]").waitFor();
      await page.setViewportSize({ width: 701, height: 900 });
      await page.locator(".track-preview").waitFor();
      assert.equal(await page.locator("dialog[open]").count(), 0);
      const panel = page.locator(".track-preview");
      const related = panel.locator(".preview-related button").first();
      const nextTitle = (await related.getAttribute("aria-label")).replace(
        /^Play /,
        "",
      );
      await related.click();
      await page.waitForFunction(() => !document.querySelector("audio").paused);
      assert.equal(
        await panel.locator(".preview-title h2").innerText(),
        nextTitle,
      );
      assert.equal(
        await panel.locator(".preview-scroll").evaluate((el) => el.scrollTop),
        0,
      );
      assert.equal(await panel.locator(".preview-credits a").count(), 2);
      await page.keyboard.press("Escape");
      assert.equal(await page.locator(".track-preview").count(), 0);
      assert.equal(
        await page
          .locator(".track")
          .first()
          .evaluate((el) => el === document.activeElement),
        true,
      );
    }
    await page.close();
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
  await page.screenshot({ path: path.join(screenshotDir, "login.png") });
  console.log(JSON.stringify(results, null, 2));
  console.log(
    "Guest access, protected account, signup page, session/network messages, reduced motion, 30 tracks and responsive playback passed.",
  );
} finally {
  await browser.close();
}
