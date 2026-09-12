// The letterhead, as a PDF and as a .docx.
//
//   npm run letterhead
//
// Two formats because they get used differently: the PDF is what you attach
// or print, the .docx is what someone opens to type a letter into. Both are
// the same page — mark and wordmark at the top left, a green hairline, and a
// footer carrying the contact details.
//
// The address and phone are deliberately left as placeholders: there is no
// registered address to print yet, and a letterhead that states one we do not
// have is worse than a blank. Edit CONTACT below, run the script again, and
// both files are rebuilt.

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { MARK_PATHS, INK, GREEN } from "../src/lib/mark.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "public", "kit");
const tmp = path.join(out, "_letterhead");
fs.mkdirSync(out, { recursive: true });

const CHROME = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
].find((p) => fs.existsSync(p));

/** The one place the footer line is written. Fill these in when they exist. */
export const CONTACT = {
  email: "hello@foldrun.io",
  site: "foldrun.io",
  address: "[Address]",
  phone: "[Phone]",
};

const footerLine = [CONTACT.address, CONTACT.phone, CONTACT.email, CONTACT.site]
  .filter(Boolean)
  .join("  ·  ");

// ---------------------------------------------------------------- the page

const lockup = (h) => `
<svg width="${h * 6.1}" height="${h}" viewBox="0 0 ${24 * 6.1} 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g stroke="${INK}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    ${MARK_PATHS.map((d) => `<path d="${d}"/>`).join("\n    ")}
  </g>
  <text x="29" y="18.4" font-family="ui-monospace, Menlo, monospace" font-size="15.5" font-weight="600" letter-spacing="-0.4" fill="${INK}">foldrun<tspan fill="${GREEN}">.</tspan></text>
</svg>`;

const html = `<!doctype html>
<meta charset="utf-8">
<title>foldrun letterhead</title>
<style>
  @page { size: A4; margin: 0; }
  * { box-sizing: border-box; }
  body {
    margin: 0; background: #fff; color: #18181b;
    font: 11pt/1.65 -apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif;
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
  }
  .sheet { position: relative; width: 210mm; height: 297mm; padding: 24mm 22mm 26mm; }
  header { display: flex; align-items: flex-start; justify-content: space-between; }
  .rule { height: 2px; background: ${GREEN}; width: 38mm; margin: 7mm 0 0; }
  .body { margin-top: 14mm; color: #3f3f46; }
  .body p { margin: 0 0 4mm; }
  .placeholder { color: #a1a1aa; }
  footer {
    position: absolute; left: 22mm; right: 22mm; bottom: 14mm;
    border-top: 1px solid #e4e4e7; padding-top: 4mm;
    font-size: 8.5pt; letter-spacing: 0.01em; color: #71717a;
    display: flex; justify-content: space-between; gap: 8mm;
  }
  footer .mail { color: #18181b; }
</style>
<div class="sheet">
  <header>
    ${lockup(34)}
    <div style="text-align:right;font-size:8.5pt;color:#71717a;line-height:1.5">
      <div class="placeholder">[Date]</div>
    </div>
  </header>
  <div class="rule"></div>

  <div class="body">
    <p class="placeholder">[Recipient name]<br>[Recipient address]</p>
    <p style="margin-top:10mm">Dear <span class="placeholder">[Name]</span>,</p>
    <p class="placeholder">[Your letter goes here.]</p>
    <p style="margin-top:10mm">Kind regards,</p>
    <p class="placeholder" style="margin-top:12mm">[Name]<br>foldrun</p>
  </div>

  <footer>
    <span>${CONTACT.address}  ·  ${CONTACT.phone}</span>
    <span><span class="mail">${CONTACT.email}</span>  ·  ${CONTACT.site}</span>
  </footer>
</div>`;

fs.mkdirSync(tmp, { recursive: true });
const page = path.join(tmp, "letterhead.html");
fs.writeFileSync(page, html);

if (!CHROME) throw new Error("no Chrome found — needed to write the PDF");
execFileSync(CHROME, [
  "--headless",
  "--disable-gpu",
  "--no-pdf-header-footer",
  `--print-to-pdf=${path.join(out, "letterhead.pdf")}`,
  `file://${page}`,
], { stdio: "ignore" });
console.log("  letterhead.pdf           A4");

// The lockup as a bitmap, because Word will not draw an SVG in a header.
const lockSvg = path.join(tmp, "lockup.svg");
fs.writeFileSync(lockSvg, lockup(24).trim());
const shot = path.join(tmp, "shot.html");
fs.writeFileSync(shot, `<style>html,body{margin:0;padding:0;overflow:hidden;background:#fff}img{display:block;width:1098px;height:180px}</style><img src="lockup.svg">`);
execFileSync(CHROME, [
  "--headless", "--disable-gpu", "--hide-scrollbars", "--virtual-time-budget=2000",
  "--window-size=1098,180", `--screenshot=${path.join(tmp, "lockup.png")}`, `file://${shot}`,
], { stdio: "ignore" });

// ---------------------------------------------------------------- the .docx
//
// A .docx is a zip of XML. Written by hand rather than with a library: the
// file is a header, a footer and an empty body, and a dependency that writes
// it would be larger than the thing it writes.

const x = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const EMU = 9525; // 1 px at 96dpi
const logoW = Math.round(1098 * EMU * 0.30);
const logoH = Math.round(180 * EMU * 0.30);

const files = {
  "[Content_Types].xml": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Default Extension="png" ContentType="image/png"/>
<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
<Override PartName="/word/header1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.header+xml"/>
<Override PartName="/word/footer1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/>
<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
</Types>`,

  "_rels/.rels": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`,

  "word/_rels/document.xml.rels": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rIdHdr" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/header" Target="header1.xml"/>
<Relationship Id="rIdFtr" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer" Target="footer1.xml"/>
<Relationship Id="rIdStyles" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`,

  "word/_rels/header1.xml.rels": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rIdLogo" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/lockup.png"/>
</Relationships>`,

  "word/styles.xml": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:docDefaults><w:rPrDefault><w:rPr>
<w:rFonts w:ascii="Helvetica Neue" w:hAnsi="Helvetica Neue" w:cs="Helvetica Neue"/>
<w:color w:val="18181B"/><w:sz w:val="22"/>
</w:rPr></w:rPrDefault></w:docDefaults>
</w:styles>`,

  "word/header1.xml": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:hdr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">
<w:p><w:r><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0">
<wp:extent cx="${logoW}" cy="${logoH}"/><wp:docPr id="1" name="foldrun"/>
<a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">
<pic:pic><pic:nvPicPr><pic:cNvPr id="1" name="lockup.png"/><pic:cNvPicPr/></pic:nvPicPr>
<pic:blipFill><a:blip r:embed="rIdLogo"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill>
<pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${logoW}" cy="${logoH}"/></a:xfrm>
<a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr>
</pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r></w:p>
<w:p><w:pPr><w:pBdr><w:bottom w:val="single" w:sz="12" w:space="1" w:color="10B981"/></w:pBdr><w:spacing w:after="240"/></w:pPr></w:p>
</w:hdr>`,

  "word/footer1.xml": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:ftr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:p><w:pPr><w:pBdr><w:top w:val="single" w:sz="4" w:space="4" w:color="E4E4E7"/></w:pBdr>
<w:jc w:val="center"/></w:pPr>
<w:r><w:rPr><w:sz w:val="16"/><w:color w:val="71717A"/></w:rPr><w:t xml:space="preserve">${x(footerLine)}</w:t></w:r></w:p>
</w:ftr>`,

  "word/document.xml": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<w:body>
<w:p><w:r><w:rPr><w:color w:val="A1A1AA"/></w:rPr><w:t>[Date]</w:t></w:r></w:p>
<w:p><w:r><w:rPr><w:color w:val="A1A1AA"/></w:rPr><w:t>[Recipient name]</w:t></w:r></w:p>
<w:p><w:r><w:rPr><w:color w:val="A1A1AA"/></w:rPr><w:t>[Recipient address]</w:t></w:r></w:p>
<w:p/>
<w:p><w:r><w:t xml:space="preserve">Dear </w:t></w:r><w:r><w:rPr><w:color w:val="A1A1AA"/></w:rPr><w:t>[Name]</w:t></w:r><w:r><w:t>,</w:t></w:r></w:p>
<w:p><w:r><w:rPr><w:color w:val="A1A1AA"/></w:rPr><w:t>[Your letter goes here.]</w:t></w:r></w:p>
<w:p/>
<w:p><w:r><w:t>Kind regards,</w:t></w:r></w:p>
<w:p/><w:p/>
<w:p><w:r><w:rPr><w:color w:val="A1A1AA"/></w:rPr><w:t>[Name]</w:t></w:r></w:p>
<w:p><w:r><w:t>foldrun</w:t></w:r></w:p>
<w:sectPr>
<w:headerReference w:type="default" r:id="rIdHdr"/>
<w:footerReference w:type="default" r:id="rIdFtr"/>
<w:pgSz w:w="11906" w:h="16838"/>
<w:pgMar w:top="1701" w:right="1247" w:bottom="1417" w:left="1247" w:header="964" w:footer="680" w:gutter="0"/>
</w:sectPr>
</w:body></w:document>`,
};

const build = path.join(tmp, "docx");
fs.rmSync(build, { recursive: true, force: true });
for (const [name, body] of Object.entries(files)) {
  const target = path.join(build, name);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, body);
}
fs.mkdirSync(path.join(build, "word/media"), { recursive: true });
fs.copyFileSync(path.join(tmp, "lockup.png"), path.join(build, "word/media/lockup.png"));

const docx = path.join(out, "letterhead.docx");
fs.rmSync(docx, { force: true });
// -X drops the extra attributes Word does not expect; mimetype ordering does
// not matter for OOXML the way it does for ODF.
execFileSync("zip", ["-q", "-r", "-X", docx, ".", "-i", "*"], { cwd: build });
console.log("  letterhead.docx          A4");

fs.rmSync(tmp, { recursive: true, force: true });
