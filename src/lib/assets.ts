// Every image this kit produces, and the one place a size is written down.
//
// scripts/render.mjs draws these; the Logo and Thumbnails pages list them.
// Change a number here, run `npm run assets`, and the file is redrawn — nobody
// opens an editor.
//
// `safe` is the part of a cover a platform actually shows on every device
// (YouTube's TV/desktop/mobile crop, Facebook's mobile crop). The drawing is
// laid out inside it, so nothing important is ever cut off.
//
// Sizes are each platform's own published recommendation, checked September
// 2026. They move: when one changes, change it here and re-upload.

export interface Cover {
  slug: string;
  platform: string;
  /** What the platform calls this slot. */
  slot: string;
  w: number;
  h: number;
  /** Visible-on-every-device box, centred. Defaults to the canvas less a margin. */
  safe?: { w: number; h: number };
  /** Lift the drawing, where a platform lays something over a corner. */
  offsetY?: number;
  /** Nudge it sideways, where a platform's chrome crowds one edge. */
  offsetX?: number;
  /** The line under the wordmark. Empty for the very short strips. */
  sub?: string;
  /** Anything worth knowing before uploading it. */
  note?: string;
}

export const TAGLINE = "Agents are just folders. Write them, run them, deploy them.";

export const COVERS: Cover[] = [
  { slug: "youtube-banner", platform: "YouTube", slot: "Channel banner", w: 2560, h: 1440, safe: { w: 1546, h: 423 }, offsetX: 46, sub: TAGLINE,
    note: "Only the middle 1546×423 shows on every device — TVs see the whole 2560×1440. Nudged right: YouTube's own mobile chrome crowds the left edge of that strip." },

  { slug: "x-header", platform: "X", slot: "Header", w: 1500, h: 500, safe: { w: 1290, h: 300 }, offsetY: -34, sub: TAGLINE,
    note: "X drops the avatar over the lower left: the drawing is lifted clear of it." },

  { slug: "linkedin-page-cover", platform: "LinkedIn", slot: "Page cover", w: 1128, h: 191,
    note: "A letterbox strip — wordmark only, no tagline; it would be unreadable." },

  { slug: "linkedin-personal-cover", platform: "LinkedIn", slot: "Personal background", w: 1584, h: 396, sub: TAGLINE,
    note: "For a person's profile, not the company page." },

  { slug: "facebook-cover", platform: "Facebook", slot: "Page cover", w: 1640, h: 856, safe: { w: 820, h: 312 }, sub: TAGLINE,
    note: "Mobile crops hard to the centre; everything lives in the middle 820×312." },

  { slug: "reddit-profile-banner", platform: "Reddit", slot: "Profile banner", w: 1920, h: 384, sub: TAGLINE },

  { slug: "subreddit-banner", platform: "Subreddit", slot: "Community banner", w: 1920, h: 384, sub: TAGLINE,
    note: "Pair with the 256×256 community icon." },

  { slug: "medium-header", platform: "Medium", slot: "Publication header", w: 1500, h: 750, safe: { w: 1200, h: 500 }, sub: TAGLINE,
    note: "Medium's own recommendation, 2:1. The publication logo is a separate file." },

  { slug: "substack-banner", platform: "Substack", slot: "Email banner", w: 1100, h: 220,
    note: "Substack wants a transparent background here; this one is on ink — swap if the newsletter is light." },

  { slug: "indiehackers-cover", platform: "Indie Hackers", slot: "Product cover", w: 1200, h: 630, sub: TAGLINE },

  { slug: "producthunt-gallery", platform: "Product Hunt", slot: "Gallery image", w: 1270, h: 760, sub: TAGLINE,
    note: "First gallery image. The 240×240 thumbnail is a separate file." },

  { slug: "devto-cover", platform: "dev.to", slot: "Post cover", w: 1000, h: 420, sub: TAGLINE },

  { slug: "quora-cover", platform: "Quora", slot: "Space / image post", w: 1200, h: 628, sub: TAGLINE },

  { slug: "g2-banner", platform: "G2", slot: "Profile banner", w: 2500, h: 476, safe: { w: 1260, h: 240 }, sub: TAGLINE,
    note: "G2 displays 1260×240; upload at 2500×476 so it stays sharp." },

  { slug: "trustpilot-header", platform: "Trustpilot", slot: "Header image", w: 1075, h: 150,
    note: "A very short strip — wordmark only. Max 1MB." },

  { slug: "eventbrite-cover", platform: "Eventbrite", slot: "Organiser cover", w: 2160, h: 1080, safe: { w: 1600, h: 700 }, sub: TAGLINE,
    note: "Pairs with the square profile image; Eventbrite crops the sides on narrow screens." },
];

/** The square mark, at the sizes platforms ask for. */
export const AVATARS: { slug: string; w: number; note: string }[] = [
  { slug: "avatar-1000", w: 1000, note: "The master. Everywhere that does not name a size." },
  { slug: "avatar-500", w: 500, note: "Quora — displayed as a circle." },
  { slug: "avatar-400", w: 400, note: "X, Reddit, Medium, dev.to, Facebook, G2 product logo (400px minimum)." },
  { slug: "avatar-256", w: 256, note: "Subreddit community icon, Substack logo (256px minimum)." },
  { slug: "avatar-240", w: 240, note: "Product Hunt thumbnail — under 3MB." },
  { slug: "avatar-200", w: 200, note: "TikTok, Instagram, Eventbrite profile." },
];

/** Wordmark lockups: the rectangular logo files platforms ask for by name. */
export interface Lockup {
  slug: string;
  platform: string;
  slot: string;
  w: number;
  h: number;
  ground?: "ink" | "paper" | "green";
  transparent?: boolean;
  stacked?: boolean;
  note?: string;
}

export const LOCKUPS: Lockup[] = [
  { slug: "lockup-ink-1200", platform: "Any", slot: "Horizontal lockup, dark", w: 1200, h: 300,
    note: "The default. Use on ink or any dark ground." },
  { slug: "lockup-paper-1200", platform: "Any", slot: "Horizontal lockup, light", w: 1200, h: 300, ground: "paper",
    note: "For light pages, documents and print." },
  { slug: "lockup-green-1200", platform: "Any", slot: "Horizontal lockup, green", w: 1200, h: 300, ground: "green",
    note: "One accent version. The run light inverts to ink so it stays visible." },
  { slug: "lockup-stacked-800", platform: "Any", slot: "Stacked lockup", w: 800, h: 800, stacked: true,
    note: "Where the space is square but an avatar is too small." },
  { slug: "lockup-transparent-1200", platform: "Any", slot: "Horizontal, transparent", w: 1200, h: 300, transparent: true,
    note: "White mark and wordmark, no ground — for placing on a photo or a dark panel." },
  { slug: "medium-logo", platform: "Medium", slot: "Publication logo", w: 600, h: 72, transparent: true, ground: "paper",
    note: "Medium's spec: 72px tall, up to 600 wide, transparent. Ink version, for their light chrome." },
  { slug: "substack-wordmark", platform: "Substack", slot: "Wordmark", w: 1344, h: 256, transparent: true, ground: "paper",
    note: "Substack's spec: 21:4, at least 1344×256, transparent." },
  { slug: "trustpilot-logo", platform: "Trustpilot", slot: "Business logo", w: 400, h: 300, stacked: true,
    note: "Trustpilot's spec: 400×300, under 1MB." },
];

/** Platforms with no cover slot at all — profile picture only. */
export const NO_COVER = [
  { platform: "Instagram", handle: "@foldrun", why: "No cover image — profile picture (200×200) and a 150-character bio." },
  { platform: "TikTok", handle: "@foldrun1", why: "No cover image — profile picture (200×200) and an 80-character bio." },
];
