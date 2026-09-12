// Deployed to Cloudflare Pages at the root of its own host, so there is no
// base path by default. A build that needs one — GitHub Pages, where a
// project site lives under /<repo>/ — passes PUBLIC_BASE=/foldrun-brand, and
// every link in the site already goes through BASE_URL.
//
// Nothing here is meant to be found: every page carries a noindex, public/
// _headers sends X-Robots-Tag, and robots.txt refuses the lot. See README.
import { defineConfig } from "astro/config";

export default defineConfig({
  site: process.env.PUBLIC_SITE ?? "https://foldrun-brand.pages.dev",
  base: process.env.PUBLIC_BASE ?? "/",
  build: { format: "directory" },
});
