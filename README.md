# foldrun brand kit

The mark, the words, and a cover image at the right size for every profile —
published to GitHub Pages so a link can be handed to anyone filling in a form.

**It is not meant to be found.** Every page carries
`<meta name="robots" content="noindex, nofollow, noarchive, noimageindex">`
and `public/robots.txt` disallows everything. The repo is public only because
GitHub Pages needs it to be; nothing in here is secret, but nothing in here
should turn up in a search for foldrun either.

## Sections

| | |
|---|---|
| **Logo** | the mark, the avatars, the colours, four rules |
| **Description** | a bio per profile, with the platform's character limit checked at build time |
| **Thumbnails** | every cover image, at the size that platform asks for |

Plus the **letterhead** (A4, PDF and DOCX) on the front page.

## Changing something

Everything is data:

- `src/lib/assets.ts` — every image and its pixel size
- `src/lib/bios.ts` — every bio and its limit
- `src/lib/mark.ts` — the mark itself, as the two paths the app's sidebar draws
- `scripts/letterhead.mjs` — `CONTACT` is the footer line

```sh
npm install
npm run assets      # redraw every cover, avatar and the letterhead
npm run dev         # the site, at :4340
npm run build       # just `astro build` — see below
```

`covers` and `letterhead` shell out to the headless Chrome on your machine and
import `.ts` directly, so they need a recent Node. **They are never part of
`npm run build`** — a deploy builder has no browser and an older Node, and the
first Cloudflare build failed exactly there. The generated files are committed
instead. When a platform changes its dimensions: edit the number, run
`npm run assets`, commit the new PNG.

## Publishing

Cloudflare Pages, from `main`: build command `npm run build`, output `dist`,
no base path. `public/_headers` adds `X-Robots-Tag: noindex` across every file,
which is the part a meta tag cannot do for a PNG or the PDF.

For GitHub Pages instead, a project site lives under `/<repo>/`, so build it
with `PUBLIC_BASE=/foldrun-brand npm run build`.
