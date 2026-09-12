// Published to GitHub Pages under the repo's path, so every link has to go
// through BASE_URL. Nothing here is meant to be found: the site carries a
// noindex on every page and a robots.txt that refuses the lot — see README.
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://foldrun-io.github.io",
  base: "/foldrun-brand",
  build: { format: "directory" },
});
