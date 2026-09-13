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
function coverSvg({ w, h, safe, sub, offsetY = 0 }) {
  // Without a platform-imposed safe area, the drawing still gets a margin —
  // art that touches the edge of a banner looks like it was cropped by
  // accident. `offsetY` lifts the content where a platform drops an avatar
  // over one corner (X).
  const box = safe ?? { w: w * 0.86, h: h * 0.74 };
  const cx = w / 2;
  const cy = h / 2 + offsetY;

  // Two layouts, chosen by the shape of the slot.
  //
  // A cover with real height gets the *run strip*: the lockup on the left and,
  // beside it, four rows drawn the way the run page draws a flow, with the
  // approval row in green. It is the one picture that says what this is —
  // steps, in order, and a person in the middle of them — and no other banner
  // on a profile page looks like it.
  //
  // A letterbox (LinkedIn's 191px, Quora's 320) gets the centred lockup,
  // because anything else at that height is a smudge.
  const roomy = box.h >= 280 && box.w / box.h <= 4.6;

  const ground = `<rect width="${w}" height="${h}" fill="${INK}"/>`;

  // No ground and no ornament: flat ink, the way the site ended up. Anything
  // laid behind this either fought the lockup or read as dirt.
  const defs = "";
  const corner = "";

  /** The lockup: mark + wordmark, drawn from a baseline and a left edge. */
  const lockup = (left, baseline, unit) => {
    const mark = unit * 1.5;
    const gap = unit * 0.5;
    const size = unit * 1.9;
    // One transform, the mark's own 24 grid, so the run light lands exactly
    // where the favicon puts it. Computing the dot in pixels — which this did
    // — drifted it inside the outline and swallowed its ring.
    const at = `translate(${left.toFixed(1)} ${(baseline - mark * 0.78).toFixed(1)}) scale(${(mark / 24).toFixed(4)})`;
    return `<g transform="${at}" fill="none" stroke="${PAPER}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    ${MARK_PATHS.map((d) => `<path d="${d}"/>`).join("\n    ")}
  </g>
  <g transform="${at}">
    <circle cx="20.6" cy="19.4" r="3" fill="${INK}"/>
    <circle cx="20.6" cy="19.4" r="1.9" fill="${GREEN}"/>
  </g>
  <text x="${(left + mark + gap).toFixed(1)}" y="${baseline.toFixed(1)}" font-family="${MONO}" font-size="${size.toFixed(1)}" font-weight="600" letter-spacing="${(-size * 0.02).toFixed(2)}" fill="${PAPER}">foldrun</text>`;
  };
  const lockWidth = (unit) => unit * 1.5 + unit * 0.5 + unit * 1.9 * 0.6 * 7;

  // ---------------------------------------------------------- letterbox
  if (!roomy) {
    const unit = Math.min(box.h / (sub ? 4.8 : 3.4), box.w / 15);
    const subSize = sub ? Math.min(unit * 0.78, (box.w * 0.9) / (sub.length * 0.5)) : 0;
    const baseline = sub ? cy + unit * 0.3 : cy + unit * 1.9 * 0.36;
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  ${defs}
  ${ground}
  ${corner}
  ${lockup(cx - lockWidth(unit) / 2, baseline, unit)}
  ${sub ? `<text x="${cx}" y="${(baseline + subSize * 2.1).toFixed(1)}" text-anchor="middle" font-family="${SANS}" font-size="${subSize.toFixed(1)}" fill="${MUTED}">${sub}</text>` : ""}
</svg>`;
  }

  // ------------------------------------------------------- the workspace
  //
  // The picture is the folder itself: a window, a schedule in its title bar,
  // and the tree inside — agents, a flow, a tool. It is the product's own
  // claim rendered literally, and it is the thing on the site that people
  // stop on. The highlighted row is the flow that is running.
  const left = cx - box.w / 2;
  const top = cy - box.h / 2;
  const colGap = box.w * 0.06;
  const textW = box.w * 0.44 - colGap / 2;
  const panelW = box.w * 0.56 - colGap / 2;
  const panelX = left + box.w - panelW;

  const unit = Math.min(box.h / 7.2, textW / 8.6);
  const subSize = Math.min(unit * 0.82, (textW * 0.98) / (28 * 0.5));
  const lockBase = top + box.h * 0.42;

  // The tagline, split so it sets on two lines against the panel.
  const l1 = "Agents are just folders.";
  const l2 = "Write them, run them, deploy them.";

  // Drawn the way `tree` draws it, with the box-drawing branches, because that
  // is what makes a person read "file system" before they read any word of it.
  const tree = [
    { pre: "", name: "seo-desk/", dir: true },
    { pre: "├── ", name: "agents/", dir: true },
    { pre: "│   ├── ", name: "rival-watcher/agent.md" },
    { pre: "│   └── ", name: "reporter/agent.md" },
    { pre: "├── ", name: "flows/", dir: true },
    { pre: "│   └── ", name: "rankings.md", on: true },
    { pre: "└── ", name: "tools/", dir: true },
    { pre: "    └── ", name: "serp_check.py" },
  ];

  const rowH = (box.h * 0.92) / (tree.length + 1.9);
  const bar = rowH * 1.6;
  const panelH = bar + rowH * tree.length + rowH * 0.7;
  const panelTop = cy - panelH / 2;
  const pad = rowH * 0.9;
  const type = rowH * 0.66;

  const panel = `<g>
    <rect x="${panelX.toFixed(1)}" y="${panelTop.toFixed(1)}" width="${panelW.toFixed(1)}" height="${panelH.toFixed(1)}" rx="${(rowH * 0.5).toFixed(1)}" fill="#0d0d10" stroke="#27272a" stroke-width="${Math.max(1, rowH * 0.05).toFixed(1)}"/>
    <line x1="${panelX.toFixed(1)}" y1="${(panelTop + bar).toFixed(1)}" x2="${(panelX + panelW).toFixed(1)}" y2="${(panelTop + bar).toFixed(1)}" stroke="#1c1c20"/>
    ${[0, 1, 2].map((i) => `<circle cx="${(panelX + pad + i * type * 0.9).toFixed(1)}" cy="${(panelTop + bar / 2).toFixed(1)}" r="${(type * 0.22).toFixed(1)}" fill="#2f2f36"/>`).join("\n    ")}
    <text x="${(panelX + pad + type * 2.7).toFixed(1)}" y="${(panelTop + bar / 2 + type * 0.36).toFixed(1)}" font-family="${MONO}" font-size="${type.toFixed(1)}" fill="#a1a1aa">seo-desk</text>
    <text x="${(panelX + panelW - pad).toFixed(1)}" y="${(panelTop + bar / 2 + type * 0.36).toFixed(1)}" text-anchor="end" font-family="${MONO}" font-size="${(type * 0.86).toFixed(1)}" fill="${GREEN}">schedule · Wed 05:00</text>
    ${tree.map((row, i) => {
      const y = panelTop + bar + rowH * 0.35 + rowH * i;
      const baseline = y + rowH * 0.72;
      const hl = row.on
        ? `<rect x="${(panelX + rowH * 0.25).toFixed(1)}" y="${y.toFixed(1)}" width="${(panelW - rowH * 0.5).toFixed(1)}" height="${(rowH * 1.02).toFixed(1)}" rx="${(rowH * 0.22).toFixed(1)}" fill="${GREEN}" opacity=".10"/>`
        : "";
      const colour = row.on ? GREEN : row.dir ? "#e4e4e7" : "#8a8a93";
      return `${hl}<text x="${(panelX + pad).toFixed(1)}" y="${baseline.toFixed(1)}" font-family="${MONO}" font-size="${type.toFixed(1)}" xml:space="preserve"><tspan fill="#3f3f46">${row.pre}</tspan><tspan fill="${colour}">${row.name}</tspan></text>`;
    }).join("\n    ")}
  </g>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  ${defs}
  ${ground}
  ${corner}
  ${lockup(left, lockBase, unit)}
  <text x="${left.toFixed(1)}" y="${(lockBase + subSize * 2.3).toFixed(1)}" font-family="${SANS}" font-size="${subSize.toFixed(1)}" fill="${PAPER}" opacity="0.92">${l1}</text>
  <text x="${left.toFixed(1)}" y="${(lockBase + subSize * 3.8).toFixed(1)}" font-family="${SANS}" font-size="${subSize.toFixed(1)}" fill="${MUTED}">${l2}</text>
  ${panel}
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
