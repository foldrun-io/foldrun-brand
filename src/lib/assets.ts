// Every image this kit produces, and the one place a size is written down.
//
// scripts/render.mjs draws these; the Thumbnails page lists them. Change a
// number here and `npm run covers` redraws that file — nobody opens an editor.
//
// `safe` is the part of a cover a platform actually shows on every device
// (YouTube's TV/desktop/mobile crop, Facebook's mobile crop). The lockup is
// drawn inside it, so nothing important is ever cut off.
//
// Sizes are the platforms' published recommendations as of September 2026.
// They move: when one changes, change the number here, run the script, and
// re-upload — that is the whole maintenance story.

export interface Cover {
  /** File name, without extension. */
  slug: string;
  platform: string;
  /** What the platform calls this slot. */
  slot: string;
  w: number;
  h: number;
  /** Visible-on-every-device box, centred. Defaults to the whole canvas. */
  safe?: { w: number; h: number };
  /** The line under the wordmark. Empty for the very short strips. */
  sub?: string;
  /** Anything worth knowing before uploading it. */
  note?: string;
}

export const TAGLINE = "Agents are just folders. Write them, run them, deploy them.";

export const COVERS: Cover[] = [
  { slug: "youtube-banner", platform: "YouTube", slot: "Channel banner", w: 2560, h: 1440, safe: { w: 1546, h: 423 }, sub: TAGLINE,
    note: "Only the middle 1546×423 shows on every device — TVs see the whole 2560×1440." },
  { slug: "x-header", platform: "X", slot: "Header", w: 1500, h: 500, sub: TAGLINE,
    note: "The avatar sits over the lower left; the lockup is kept clear of it." },
  { slug: "linkedin-cover", platform: "LinkedIn", slot: "Page cover", w: 1128, h: 191,
    note: "A letterbox strip — wordmark only, no tagline; it would be unreadable." },
  { slug: "facebook-cover", platform: "Facebook", slot: "Page cover", w: 1640, h: 856, safe: { w: 820, h: 312 }, sub: TAGLINE,
    note: "Mobile crops hard to the centre; everything lives in the middle 820×312." },
  { slug: "reddit-profile-banner", platform: "Reddit", slot: "Profile banner", w: 1920, h: 384, sub: TAGLINE },
  { slug: "subreddit-banner", platform: "Subreddit", slot: "Community banner", w: 1920, h: 384, sub: TAGLINE,
    note: "Use the 256×256 icon as the community icon alongside it." },
  { slug: "medium-header", platform: "Medium", slot: "Publication header", w: 1500, h: 750, safe: { w: 1200, h: 500 }, sub: TAGLINE },
  { slug: "indiehackers-cover", platform: "Indie Hackers", slot: "Product cover", w: 1200, h: 630, sub: TAGLINE },
  { slug: "producthunt-gallery", platform: "Product Hunt", slot: "Gallery image", w: 1270, h: 760, sub: TAGLINE,
    note: "First gallery image. The 240×240 thumbnail is the square avatar." },
  { slug: "devto-cover", platform: "dev.to", slot: "Cover image", w: 1000, h: 420, sub: TAGLINE },
  { slug: "quora-cover", platform: "Quora", slot: "Space cover", w: 1280, h: 320, sub: TAGLINE },
  { slug: "substack-cover", platform: "Substack", slot: "Publication cover", w: 1200, h: 600, sub: TAGLINE },
  { slug: "eventbrite-cover", platform: "Eventbrite", slot: "Organiser cover", w: 2160, h: 1080, safe: { w: 1600, h: 700 }, sub: TAGLINE,
    note: "Pairs with the square profile image; Eventbrite crops the sides on narrow screens." },
];

/** The square mark, at the sizes the platforms ask for. */
export const AVATARS = [
  { slug: "avatar-1000", w: 1000, note: "Everywhere. Padded so a circular crop never clips it." },
  { slug: "avatar-400", w: 400, note: "X, Reddit, Medium, dev.to, Quora." },
  { slug: "avatar-256", w: 256, note: "Subreddit community icon." },
  { slug: "avatar-240", w: 240, note: "Product Hunt thumbnail." },
  { slug: "avatar-200", w: 200, note: "TikTok, Instagram." },
];

/** Platforms with no cover slot at all — profile picture only. */
export const NO_COVER = [
  { platform: "Instagram", handle: "@foldrun", why: "No cover image — profile picture and bio only." },
  { platform: "TikTok", handle: "@foldrun1", why: "No cover image — profile picture and an 80-character bio." },
];
