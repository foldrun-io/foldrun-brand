// Draw every image in the kit: one SVG per asset, then a PNG beside it.
//
//   npm run assets
//
// Everything here is *solved*, not guessed. Type is measured before it is
// placed — mono at 0.6em a character, sans at 0.52 — and each block is scaled
// until it fits the space it has. The covers that shipped broken did it the
// other way round: fixed ratios and no measurement, so the wordmark ran into
// the panel and the panel's title ran over its own schedule.
//
// Rasterising is done by the headless Chrome already on this machine rather
// than a node image library: a browser is the thing that agrees with how the
// SVG will look, and this repo stays free of native dependencies.

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { COVERS, AVATARS, LOCKUPS } from "../src/lib/assets.ts";
import {
  MARK_PATHS, INK, GREEN, PAPER, MUTED, MONO, MONO_EM, SANS, SANS_EM,
  avatarSvg, lockupSvg, runLight,
} from "../src/lib/mark.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "public", "kit");
fs.mkdirSync(out, { recursive: true });

const CHROME = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
].find((p) => fs.existsSync(p));

const GROUNDS = { ink: INK, paper: PAPER, green: GREEN };
const INKS = { ink: PAPER, paper: INK, green: INK };

/** The file tree, drawn the way `tree` draws it. */
const TREE = [
  { pre: "", name: "seo-desk/", dir: true },
  { pre: "├── ", name: "agents/", dir: true },
  { pre: "│   ├── ", name: "rival-watcher/agent.md" },
  { pre: "│   └── ", name: "reporter/agent.md" },
  { pre: "├── ", name: "flows/", dir: true },
  { pre: "│   └── ", name: "rankings.md", on: true },
  { pre: "└── ", name: "tools/", dir: true },
  { pre: "    └── ", name: "serp_check.py" },
];
const TREE_COLS = Math.max(...TREE.map((r) => (r.pre + r.name).length));

const TITLE = "seo-desk";
const SCHEDULE = "schedule · Wed 05:00";

// 1.5 mark + 0.5 gap + seven mono characters of a 1.9-unit face.
const LOCK_UNITS = 1.5 + 0.5 + 1.9 * MONO_EM * 7;

/**
 * One cover.
 *
 * Wide slots get the lockup on the left and the workspace on the right — a
 * window, a schedule, the folder tree. Letterbox slots (LinkedIn's 191px,
 * Trustpilot's 150) get the centred lockup, because a tree at that height is
 * a smudge.
 */
function coverSvg({ w, h, safe, sub, offsetY = 0, offsetX = 0 }) {
  // The safe area is what a platform promises to show; the drawing sits inside
  // it with a little air, because art flush to the edge of the safe box looks
  // clipped even when it is not.
  const raw = safe ?? { w: w * 0.86, h: h * 0.74 };
  const box = safe ? { w: raw.w * 0.94, h: raw.h * 0.94 } : raw;
  const cx = w / 2 + offsetX;
  const cy = h / 2 + offsetY;
  const ground = `<rect width="${w}" height="${h}" fill="${INK}"/>`;
  const roomy = box.h >= 280 && box.w / box.h <= 4.6;

  /** The lockup: mark, run light and wordmark, from a left edge and baseline. */
  const lockup = (left, baseline, unit) => {
    const mark = unit * 1.5;
    const gap = unit * 0.5;
    const size = unit * 1.9;
    const at = `translate(${left.toFixed(1)} ${(baseline - mark * 0.78).toFixed(1)}) scale(${(mark / 24).toFixed(4)})`;
    return `<g transform="${at}" fill="none" stroke="${PAPER}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    ${MARK_PATHS.map((d) => `<path d="${d}"/>`).join("\n    ")}
  </g>
  <g transform="${at}">${runLight(INK)}</g>
  <text x="${(left + mark + gap).toFixed(1)}" y="${baseline.toFixed(1)}" font-family="${MONO}" font-size="${size.toFixed(1)}" font-weight="600" letter-spacing="${(-size * 0.02).toFixed(2)}" fill="${PAPER}">foldrun</text>`;
  };

  // ---------------------------------------------------------- letterbox
  if (!roomy) {
    const unit = Math.min(box.h / (sub ? 4.8 : 2.6), (box.w * 0.9) / LOCK_UNITS);
    const subSize = sub ? Math.min(unit * 0.78, (box.w * 0.92) / (sub.length * SANS_EM)) : 0;
    const baseline = sub ? cy + unit * 0.3 : cy + unit * 1.9 * 0.36;
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  ${ground}
  ${lockup(cx - (unit * LOCK_UNITS) / 2, baseline, unit)}
  ${sub ? `<text x="${cx}" y="${(baseline + subSize * 2.1).toFixed(1)}" text-anchor="middle" font-family="${SANS}" font-size="${subSize.toFixed(1)}" fill="${MUTED}">${sub}</text>` : ""}
</svg>`;
  }

  // ------------------------------------------------------- the workspace
  const left = cx - box.w / 2;
  const top = cy - box.h / 2;
  const colGap = box.w * 0.05;
  const textW = box.w * 0.44 - colGap / 2;
  const panelW = box.w * 0.56 - colGap / 2;
  const panelX = left + box.w - panelW;

  // The left column: the lockup fits the column, the tagline fits under it.
  const l1 = "Agents are just folders.";
  const l2 = "Write them, run them, deploy them.";
  const unit = Math.min(box.h / 7.2, textW / LOCK_UNITS);
  const subSize = Math.min(unit * 0.82, textW / (l2.length * SANS_EM));
  const lockBase = top + box.h * 0.42;

  // The panel: type is solved from the longest tree line, then rows and title
  // bar follow from it.
  // Two bounds, and the panel's height is the one that used to be missing: the
  // panel is 1.7 + 8 rows + 0.7 tall, so type cannot exceed box.h / 16.2 or it
  // grows a window taller than the space it is allowed to occupy — which is
  // exactly how the YouTube banner ended up clipped top and bottom on mobile.
  const type = Math.min(panelW / (TREE_COLS * MONO_EM + 2.8), box.h / 16.2);
  const rowH = type / 0.66;
  const pad = rowH * 0.9;
  const bar = rowH * 1.7;
  const panelH = bar + rowH * TREE.length + rowH * 0.7;
  const panelTop = cy - panelH / 2;

  // The title bar holds three dots, the workspace name and the schedule. If
  // they do not all fit, the schedule goes rather than overlapping the name —
  // which is exactly what it used to do.
  const dots = type * 2.7;
  const titleW = (TITLE.length + SCHEDULE.length) * type * MONO_EM;
  const showSchedule = dots + titleW + pad * 3 < panelW;

  const panel = `<g>
    <rect x="${panelX.toFixed(1)}" y="${panelTop.toFixed(1)}" width="${panelW.toFixed(1)}" height="${panelH.toFixed(1)}" rx="${(rowH * 0.5).toFixed(1)}" fill="#0d0d10" stroke="#27272a" stroke-width="${Math.max(1, rowH * 0.05).toFixed(1)}"/>
    <line x1="${panelX.toFixed(1)}" y1="${(panelTop + bar).toFixed(1)}" x2="${(panelX + panelW).toFixed(1)}" y2="${(panelTop + bar).toFixed(1)}" stroke="#1c1c20"/>
    ${[0, 1, 2].map((i) => `<circle cx="${(panelX + pad + i * type * 0.9).toFixed(1)}" cy="${(panelTop + bar / 2).toFixed(1)}" r="${(type * 0.22).toFixed(1)}" fill="#2f2f36"/>`).join("\n    ")}
    <text x="${(panelX + pad + dots).toFixed(1)}" y="${(panelTop + bar / 2 + type * 0.36).toFixed(1)}" font-family="${MONO}" font-size="${type.toFixed(1)}" fill="#a1a1aa">${TITLE}</text>
    ${showSchedule ? `<text x="${(panelX + panelW - pad).toFixed(1)}" y="${(panelTop + bar / 2 + type * 0.36).toFixed(1)}" text-anchor="end" font-family="${MONO}" font-size="${(type * 0.86).toFixed(1)}" fill="${GREEN}">${SCHEDULE}</text>` : ""}
    ${TREE.map((row, i) => {
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
  ${ground}
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
    "--headless", "--disable-gpu", "--hide-scrollbars", "--virtual-time-budget=3000",
    `--window-size=${w},${h}`, `--screenshot=${target}`, `file://${page}`,
  ], { stdio: "ignore" });
  fs.rmSync(page, { force: true });
}

const write = (slug, svg, w, h) => {
  const file = path.join(out, `${slug}.svg`);
  fs.writeFileSync(file, svg);
  png(file, w, h, path.join(out, `${slug}.png`));
  console.log(`  ${slug.padEnd(26)} ${w}×${h}`);
};

for (const c of COVERS) write(c.slug, coverSvg(c), c.w, c.h);
for (const a of AVATARS) write(a.slug, avatarSvg(a.w), a.w, a.w);

// The inverted avatar: ink mark on brand green. Its run light inverts with it —
// green on green is a dot nobody can see.
write("avatar-green-1000", avatarSvg(1000, GREEN, INK), 1000, 1000);

for (const l of LOCKUPS) {
  const key = l.ground ?? "ink";
  write(l.slug, lockupSvg({
    w: l.w, h: l.h, ground: GROUNDS[key], ink: INKS[key],
    transparent: l.transparent, stacked: l.stacked,
  }), l.w, l.h);
}

// The favicon tile, so the kit ships the same file the four sites serve.
fs.copyFileSync(path.join(root, "public", "favicon.svg"), path.join(out, "favicon-tile.svg"));

console.log(`\n${COVERS.length + AVATARS.length + LOCKUPS.length + 1} assets in public/kit`);
