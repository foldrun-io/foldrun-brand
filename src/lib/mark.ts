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

/** The mark as standalone SVG markup, drawn at `size` px in `color`. */
export function markSvg(size: number, color = INK): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${MARK_PATHS.map((d) => `<path d="${d}"/>`).join("")}</svg>`;
}

/** The square avatar: full-bleed ground, mark centred at 60% of the canvas. */
export function avatarSvg(size: number, ground = INK, ink = PAPER): string {
  const glyph = size * 0.6;
  const scale = glyph / 24;
  const offset = (size - glyph) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="${ground}"/>
  <g transform="translate(${offset} ${offset}) scale(${scale})" fill="none" stroke="${ink}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    ${MARK_PATHS.map((d) => `<path d="${d}"/>`).join("\n    ")}
  </g>
</svg>`;
}
