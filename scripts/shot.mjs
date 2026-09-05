#!/usr/bin/env node
// Screenshot a page of the running site at both review viewports.
//
//   pnpm shot [path=/] [--out dir] [--reduced]
//
// --reduced emulates prefers-reduced-motion: reduce and suffixes the files
// -reduced (added for T-08037's reduced-motion evidence).
//
// Expects a dev or prod server already listening on http://localhost:3000.
// Writes shots/<slug>-1440.png and shots/<slug>-390.png (full page).
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ORIGIN = process.env.SHOT_ORIGIN ?? "http://localhost:3000";
const VIEWPORTS = [
  { width: 1440, height: 900 },
  { width: 390, height: 844 },
];

function parseArgs(argv) {
  let target = "/";
  let out = "shots";
  let reduced = false;
  let sawTarget = false;
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--out") {
      out = argv[++i] ?? out;
    } else if (arg.startsWith("--out=")) {
      out = arg.slice("--out=".length);
    } else if (arg === "--reduced") {
      reduced = true;
    } else if (!sawTarget) {
      target = arg;
      sawTarget = true;
    }
  }
  if (!target.startsWith("/")) target = `/${target}`;
  return { target, out, reduced };
}

function slugFor(target) {
  const trimmed = target.replace(/^\/+|\/+$/g, "");
  return trimmed === "" ? "home" : trimmed.replace(/\//g, "-");
}

const { target, out, reduced } = parseArgs(process.argv.slice(2));
const slug = slugFor(target);
const outDir = path.resolve(ROOT, out);
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
try {
  for (const viewport of VIEWPORTS) {
    const context = await browser.newContext({ viewport, deviceScaleFactor: 2 });
    const page = await context.newPage();
    if (reduced) await page.emulateMedia({ reducedMotion: "reduce" });
    const url = `${ORIGIN}${target}`;
    const response = await page.goto(url, { waitUntil: "networkidle" });
    if (!response || !response.ok()) {
      throw new Error(`${url} returned ${response ? response.status() : "no response"}`);
    }
    await page.evaluate(() => document.fonts.ready);
    const suffix = reduced ? "-reduced" : "";
    const file = path.join(outDir, `${slug}-${viewport.width}${suffix}.png`);
    await page.screenshot({ path: file, fullPage: true });
    await context.close();
    console.log(path.relative(ROOT, file));
  }
} finally {
  await browser.close();
}
