// Draw every image in the kit: one SVG per asset, then a PNG beside it.
//
//   npm run covers
//
// The SVG is the source — a cover is a rectangle, a grid, a glow and the
// lockup, laid out from the numbers in src/lib/assets.ts. The PNG exists
// because most upload forms refuse SVG.
//
// Rasterising is done by the headless Chrome already on this machine rather
// than a node image library: a browser is the thing that agrees with how the
// SVG will look, and this repo stays free of native dependencies.

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { COVERS, AVATARS } from "../src/lib/assets.ts";
import { MARK_PATHS, INK, GREEN, PAPER, MUTED, avatarSvg } from "../src/lib/mark.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "public", "kit");
fs.mkdirSync(out, { recursive: true });

const CHROME = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
].find((p) => fs.existsSync(p));

const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";
const SANS = "-apple-system, BlinkMacSystemFont, Helvetica, Arial, sans-serif";

/**
 * One cover. Everything is sized from the safe box, so a 191px-tall LinkedIn
 * strip and a 1440px-tall YouTube banner are the same drawing at two scales
 * rather than two drawings that have to be kept in step.
 */
function coverSvg({ w, h, safe, sub }) {
  const box = safe ?? { w, h };
  const cx = w / 2;
  const cy = h / 2;

  // The lockup's size follows the shorter constraint: tall enough to breathe,
  // never wider than the safe box.
  // A tagline needs vertical room, so a cover that carries one gets a smaller
  // unit than a bare strip of the same height.
  const unit = Math.min(box.h / (sub ? 4.8 : 3.4), box.w / 15);
  const mark = unit * 1.5;
  const wordSize = unit * 1.9;
  const gap = unit * 0.5;
  // The mono face is ~0.5em per character in this sans: hold the tagline
  // inside 90% of the safe box rather than letting a wide-and-short cover
  // (Quora, dev.to) run it off both edges.
  const subSize = sub ? Math.min(unit * 0.78, (box.w * 0.9) / (sub.length * 0.5)) : 0;

  // Wordmark metrics: the mono face is ~0.6em per character, "foldrun." is 8.
  const wordWidth = wordSize * 0.6 * 8;
  const lockWidth = mark + gap + wordWidth;
  const lockLeft = cx - lockWidth / 2;
  const baseline = sub ? cy + unit * 0.3 : cy + wordSize * 0.36;

  const grid = Math.max(24, Math.round(Math.min(w, h) / 18));

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <pattern id="grid" width="${grid}" height="${grid}" patternUnits="userSpaceOnUse">
      <path d="M${grid} 0H0v${grid}" fill="none" stroke="#18181b" stroke-width="1"/>
    </pattern>
    <radialGradient id="glow" cx="50%" cy="0%" r="75%">
      <stop offset="0%" stop-color="${GREEN}" stop-opacity="0.20"/>
      <stop offset="100%" stop-color="${GREEN}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="${INK}"/>
  <rect width="${w}" height="${h}" fill="url(#grid)"/>
  <rect width="${w}" height="${h}" fill="url(#glow)"/>
  <g transform="translate(${lockLeft.toFixed(1)} ${(baseline - mark * 0.78).toFixed(1)}) scale(${(mark / 24).toFixed(4)})" fill="none" stroke="${PAPER}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    ${MARK_PATHS.map((d) => `<path d="${d}"/>`).join("\n    ")}
  </g>
  <text x="${(lockLeft + mark + gap).toFixed(1)}" y="${baseline.toFixed(1)}" font-family="${MONO}" font-size="${wordSize.toFixed(1)}" font-weight="600" letter-spacing="${(-wordSize * 0.02).toFixed(2)}" fill="${PAPER}">foldrun<tspan fill="${GREEN}">.</tspan></text>
  ${sub ? `<text x="${cx}" y="${(baseline + subSize * 2.1).toFixed(1)}" text-anchor="middle" font-family="${SANS}" font-size="${subSize.toFixed(1)}" fill="${MUTED}">${sub}</text>` : ""}
</svg>`;
}

/** SVG on disk → PNG of exactly the right pixel size, via headless Chrome. */
function png(svgPath, w, h, target) {
  if (!CHROME) throw new Error("no Chrome found — install Google Chrome, or render the SVGs yourself");
  const page = path.join(out, "_render.html");
  fs.writeFileSync(
    page,
    `<style>html,body{margin:0;padding:0;overflow:hidden}img{display:block;width:${w}px;height:${h}px}</style><img src="${path.basename(svgPath)}">`,
  );
  execFileSync(CHROME, [
    "--headless",
    "--disable-gpu",
    "--hide-scrollbars",
    "--virtual-time-budget=3000",
    `--window-size=${w},${h}`,
    `--screenshot=${target}`,
    `file://${page}`,
  ], { stdio: "ignore" });
  fs.rmSync(page, { force: true });
}

let n = 0;
for (const c of COVERS) {
  const svg = path.join(out, `${c.slug}.svg`);
  fs.writeFileSync(svg, coverSvg(c));
  png(svg, c.w, c.h, path.join(out, `${c.slug}.png`));
  console.log(`  ${c.slug.padEnd(24)} ${c.w}×${c.h}`);
  n++;
}
for (const a of AVATARS) {
  const svg = path.join(out, `${a.slug}.svg`);
  fs.writeFileSync(svg, avatarSvg(a.w));
  png(svg, a.w, a.w, path.join(out, `${a.slug}.png`));
  console.log(`  ${a.slug.padEnd(24)} ${a.w}×${a.w}`);
  n++;
}
// The one inverted avatar, for anywhere a black square disappears.
const greenSvg = path.join(out, "avatar-green-1000.svg");
fs.writeFileSync(greenSvg, avatarSvg(1000, GREEN, INK));
png(greenSvg, 1000, 1000, path.join(out, "avatar-green-1000.png"));
console.log(`  avatar-green-1000        1000×1000`);
console.log(`\n${n + 1} assets in public/kit`);
