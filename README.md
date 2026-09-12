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
npm run covers      # redraw every cover and avatar into public/kit
npm run letterhead  # rebuild letterhead.pdf and letterhead.docx
npm run dev         # the site, at :4340
```

`covers` and `letterhead` shell out to the headless Chrome on your machine —
that is why the generated files are **committed** rather than built in CI.
When a platform changes its dimensions: edit the number, run the script,
commit the new PNG.

## Publishing

`.github/workflows/pages.yml` builds and deploys on every push to `main`.
Enable it once under **Settings → Pages → Source: GitHub Actions**.
