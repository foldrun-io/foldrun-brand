// The checklist: every platform we hold a handle on, what it needs, and which
// file in this kit goes in each slot.
//
// The sizes are each platform's own published recommendation, checked
// September 2026. `status` is where the profile itself stands, not the asset.

export interface Platform {
  name: string;
  handle: string;
  /** The profile itself. `checked` is whether the URL answered 200 when this
   *  file was last updated — Reddit, Medium, Quora and Trustpilot answer 403
   *  to any script, so those are unverifiable from here, not missing. */
  url: string;
  checked?: "ok" | "blocked" | "missing";
  status: "live" | "todo";
  /** slot → the kit file that fills it. */
  needs: { slot: string; size: string; file?: string }[];
  note?: string;
}

export const PLATFORMS: Platform[] = [
  { name: "YouTube", url: "https://www.youtube.com/@foldrun", checked: "ok", handle: "@foldrun", status: "live", needs: [
    { slot: "Channel banner", size: "2560×1440 (safe 1546×423)", file: "youtube-banner" },
    { slot: "Profile picture", size: "800×800", file: "avatar-1000" },
  ]},
  { name: "X", url: "https://x.com/foldrun1", checked: "ok", handle: "@foldrun1", status: "live", needs: [
    { slot: "Header", size: "1500×500", file: "x-header" },
    { slot: "Profile picture", size: "400×400", file: "avatar-400" },
  ]},
  { name: "LinkedIn", url: "https://www.linkedin.com/company/foldrun", checked: "ok", handle: "foldrun", status: "live", needs: [
    { slot: "Page cover", size: "1128×191", file: "linkedin-page-cover" },
    { slot: "Personal background", size: "1584×396", file: "linkedin-personal-cover" },
    { slot: "Page logo", size: "300×300", file: "avatar-400" },
  ]},
  { name: "Facebook", url: "https://www.facebook.com/foldrun", checked: "ok", handle: "foldrun", status: "live", needs: [
    { slot: "Page cover", size: "1640×856 (safe 820×312)", file: "facebook-cover" },
    { slot: "Profile picture", size: "400×400", file: "avatar-400" },
  ]},
  { name: "Instagram", url: "https://www.instagram.com/foldrun/", checked: "ok", handle: "@foldrun", status: "live", needs: [
    { slot: "Profile picture", size: "320×320", file: "avatar-400" },
  ], note: "No cover slot — picture and a 150-character bio only." },
  { name: "TikTok", url: "https://www.tiktok.com/@foldrun1", checked: "ok", handle: "@foldrun1", status: "live", needs: [
    { slot: "Profile picture", size: "200×200", file: "avatar-200" },
  ], note: "No cover slot — picture and an 80-character bio only." },
  { name: "Reddit", url: "https://www.reddit.com/user/foldrun/", checked: "blocked", handle: "u/foldrun", status: "live", needs: [
    { slot: "Profile banner", size: "1920×384", file: "reddit-profile-banner" },
    { slot: "Avatar", size: "256×256", file: "avatar-256" },
  ]},
  { name: "Subreddit", url: "https://www.reddit.com/r/foldrun/", checked: "blocked", handle: "r/foldrun", status: "live", needs: [
    { slot: "Community banner", size: "1920×384", file: "subreddit-banner" },
    { slot: "Community icon", size: "256×256", file: "avatar-256" },
  ]},
  { name: "Medium", url: "https://medium.com/@foldrun", checked: "blocked", handle: "@foldrun", status: "live", needs: [
    { slot: "Publication header", size: "1500×750", file: "medium-header" },
    { slot: "Publication logo", size: "600×72, transparent", file: "medium-logo" },
    { slot: "Avatar", size: "60×60", file: "avatar-256" },
  ]},
  { name: "Substack", url: "https://foldrun.substack.com", checked: "ok", handle: "foldrun", status: "todo", needs: [
    { slot: "Email banner", size: "1100×220", file: "substack-banner" },
    { slot: "Wordmark", size: "1344×256, 21:4", file: "substack-wordmark" },
    { slot: "Logo", size: "256×256 minimum", file: "avatar-256" },
  ], note: "The only profile on the list not opened yet." },
  { name: "Indie Hackers", url: "https://www.indiehackers.com/product/foldrun", checked: "missing", handle: "foldrun", status: "live", needs: [
    { slot: "Product cover", size: "1200×630", file: "indiehackers-cover" },
    { slot: "Product logo", size: "400×400", file: "avatar-400" },
  ]},
  { name: "Product Hunt", url: "https://www.producthunt.com/products/foldrun", checked: "missing", handle: "foldrun", status: "live", needs: [
    { slot: "Gallery image", size: "1270×760", file: "producthunt-gallery" },
    { slot: "Thumbnail", size: "240×240, under 3MB", file: "avatar-240" },
  ]},
  { name: "dev.to", url: "https://dev.to/foldrun", checked: "ok", handle: "@foldrun", status: "live", needs: [
    { slot: "Post cover", size: "1000×420", file: "devto-cover" },
    { slot: "Profile picture", size: "400×400", file: "avatar-400" },
  ]},
  { name: "Quora", url: "https://www.quora.com/profile/foldrun", checked: "blocked", handle: "foldrun", status: "live", needs: [
    { slot: "Space / image post", size: "1200×628", file: "quora-cover" },
    { slot: "Logo", size: "500×500, shown as a circle", file: "avatar-500" },
  ]},
  { name: "G2", url: "https://www.g2.com/products/foldrun/reviews", checked: "missing", handle: "foldrun", status: "todo", needs: [
    { slot: "Profile banner", size: "2500×476 (displays 1260×240)", file: "g2-banner" },
    { slot: "Product logo", size: "400px or larger", file: "avatar-400" },
  ], note: "Profile not claimed yet — reviews have to exist before the badge means anything." },
  { name: "Trustpilot", url: "https://www.trustpilot.com/review/foldrun.io", checked: "blocked", handle: "foldrun.io", status: "live", needs: [
    { slot: "Header image", size: "1075×150, under 1MB", file: "trustpilot-header" },
    { slot: "Business logo", size: "400×300, under 1MB", file: "trustpilot-logo" },
  ]},
  { name: "Eventbrite", url: "https://www.eventbrite.com.au/o/foldrun", checked: "missing", handle: "foldrun", status: "live", needs: [
    { slot: "Organiser cover", size: "2160×1080", file: "eventbrite-cover" },
    { slot: "Organiser profile", size: "square, high quality", file: "avatar-1000" },
  ]},
  { name: "GitHub", url: "https://github.com/foldrun-io", checked: "ok", handle: "foldrun-io", status: "live", needs: [
    { slot: "Organisation avatar", size: "500×500", file: "avatar-500" },
  ]},
];
