// The mark, once. Every image in this kit and every page of this site draw
// from here — the same two paths the app's sidebar draws, so the kit cannot
// drift from the product.

export const MARK_PATHS = [
  "M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z",
  "M3 11h18",
];

export const INK = "#09090b";
export const GREEN = "#10b981";
export const PAPER = "#fafafa";
export const MUTED = "#a1a1aa";

/** The faces, and how wide one character of each is in em. Every fitting
 *  calculation in this kit measures text with these two numbers. */
export const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";
export const MONO_EM = 0.6;
export const SANS = "-apple-system, BlinkMacSystemFont, Helvetica, Arial, sans-serif";
export const SANS_EM = 0.52;

/**
 * The run light: where it goes, and what colour it is.
 *
 * It sits at 20.6,19.4 on the mark's own 24 grid — the folder's lower-right
 * corner — ringed in whatever surface is behind it, so it never touches the
 * outline. The rule that matters: **the dot contrasts with its ground.**
 * Green on ink, ink on green. Green on green is a dot nobody can see, which is
 * how the inverted avatar shipped with an invisible run light.
 */
export const DOT = { cx: 20.6, cy: 19.4, ring: 3, r: 1.9 };

export const dotColour = (ground: string): string =>
  ground.toLowerCase() === GREEN.toLowerCase() ? INK : GREEN;

/** The two circles of the run light, on the mark's 24 grid. */
export const runLight = (ground: string): string =>
  `<circle cx="${DOT.cx}" cy="${DOT.cy}" r="${DOT.ring}" fill="${ground}"/><circle cx="${DOT.cx}" cy="${DOT.cy}" r="${DOT.r}" fill="${dotColour(ground)}"/>`;

/** The mark alone: `ink` draws the outline, `ground` fills the dot's ring. */
export function markSvg(size: number, ink = PAPER, ground = INK): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none">
  <g stroke="${ink}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${MARK_PATHS.map((d) => `<path d="${d}"/>`).join("")}</g>
  ${runLight(ground)}
</svg>`;
}

/** The square avatar: full-bleed ground, mark centred at 60% of the canvas. */
export function avatarSvg(size: number, ground = INK, ink = PAPER): string {
  const glyph = size * 0.6;
  const at = `translate(${(size - glyph) / 2} ${(size - glyph) / 2}) scale(${glyph / 24})`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="${ground}"/>
  <g transform="${at}" fill="none" stroke="${ink}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    ${MARK_PATHS.map((d) => `<path d="${d}"/>`).join("\n    ")}
  </g>
  <g transform="${at}">${runLight(ground)}</g>
</svg>`;
}

/**
 * The lockup, solved to fit a canvas rather than guessed at.
 *
 * `unit` is the wordmark's type size and everything else is a ratio of it, so
 * a 40px header lockup and a 1344px press asset are the same drawing. Widths
 * in units: mark 1.5, gap 0.5, wordmark seven mono characters at 0.6em of a
 * face 1.9 units tall. Guessing this is what pushed the wordmark off the edge
 * of the Product Hunt and Indie Hackers covers.
 */
export function lockupSvg({
  w,
  h,
  ink = PAPER,
  ground = INK,
  transparent = false,
  stacked = false,
  margin = 0.14,
}: {
  w: number;
  h: number;
  ink?: string;
  ground?: string;
  transparent?: boolean;
  stacked?: boolean;
  margin?: number;
}): string {
  const inner = { w: w * (1 - margin * 2), h: h * (1 - margin * 2) };
  const wordUnits = 1.9 * MONO_EM * 7;

  const unit = stacked
    ? Math.min(inner.w / Math.max(1.5, wordUnits), inner.h / (1.5 + 0.6 + 1.9))
    : Math.min(inner.w / (1.5 + 0.5 + wordUnits), inner.h / 1.5);

  const mark = unit * 1.5;
  const gap = unit * 0.5;
  const size = unit * 1.9;
  const word = size * MONO_EM * 7;

  const blockW = stacked ? Math.max(mark, word) : mark + gap + word;
  const blockH = stacked ? mark + gap * 1.2 + size : mark;
  const originX = (w - blockW) / 2;
  const originY = (h - blockH) / 2;

  const markX = stacked ? originX + (blockW - mark) / 2 : originX;
  const at = `translate(${markX.toFixed(1)} ${originY.toFixed(1)}) scale(${(mark / 24).toFixed(4)})`;
  const wordX = stacked ? originX + (blockW - word) / 2 : originX + mark + gap;
  const baseline = stacked ? originY + mark + gap * 1.2 + size * 0.78 : originY + mark * 0.78;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  ${transparent ? "" : `<rect width="${w}" height="${h}" fill="${ground}"/>`}
  <g transform="${at}" fill="none" stroke="${ink}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    ${MARK_PATHS.map((d) => `<path d="${d}"/>`).join("\n    ")}
  </g>
  <g transform="${at}">${runLight(ground)}</g>
  <text x="${wordX.toFixed(1)}" y="${baseline.toFixed(1)}" font-family="${MONO}" font-size="${size.toFixed(1)}" font-weight="600" letter-spacing="${(-size * 0.02).toFixed(2)}" fill="${ink}">foldrun</text>
</svg>`;
}
