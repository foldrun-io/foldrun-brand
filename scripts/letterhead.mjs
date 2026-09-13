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
    font: 10.5pt/1.7 "Helvetica Neue", Helvetica, Arial, sans-serif;
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
  }

  /* A4 with a wide left margin: the text sits on one measure, and the space
     to its right is where the eye rests. A letter that fills the page corner
     to corner reads as a form. */
  .sheet { position: relative; width: 210mm; height: 297mm; padding: 22mm 24mm 24mm; page-break-after: always; }
  .sheet:last-child { page-break-after: auto; }

  /* The one flash of colour: a hairline across the very top edge. It survives
     a photocopier as a grey line and costs nothing to print. */
  .edge { position: absolute; top: 0; left: 0; right: 0; height: 3.2mm; background: ${GREEN}; }

  header { display: flex; align-items: flex-start; justify-content: space-between; gap: 16mm; padding-top: 8mm; }
  .contact { text-align: right; font-size: 8pt; line-height: 1.75; color: #71717a; letter-spacing: 0.02em; }
  .contact .em { color: #18181b; }
  .contact .label { display: block; font-size: 6.6pt; letter-spacing: 0.14em; text-transform: uppercase; color: #a1a1aa; margin-bottom: 1mm; }

  .meta { margin-top: 18mm; display: flex; gap: 18mm; font-size: 9pt; }
  .meta .block { max-width: 72mm; }
  .meta .label { display: block; font-size: 6.6pt; letter-spacing: 0.14em; text-transform: uppercase; color: #a1a1aa; margin-bottom: 2mm; }

  .body { margin-top: 16mm; max-width: 135mm; }
  .body p { margin: 0 0 4.5mm; }
  .salutation { margin-bottom: 6mm; }
  .sign { margin-top: 14mm; }
  .sign .rule { width: 52mm; height: 1px; background: #d4d4d8; margin: 16mm 0 2.5mm; }
  .sign .who { font-size: 9pt; color: #52525b; line-height: 1.5; }
  .placeholder { color: #a1a1aa; }

  footer {
    position: absolute; left: 24mm; right: 24mm; bottom: 13mm;
    display: flex; justify-content: space-between; align-items: flex-end; gap: 10mm;
    font-size: 7.6pt; letter-spacing: 0.02em; color: #a1a1aa;
  }
  footer .legal { max-width: 120mm; }
  footer .page { font-variant-numeric: tabular-nums; }

  /* Page two onward: the mark only, small, so a two-page letter still looks
     like it came from somewhere. */
  .cont { display: flex; justify-content: space-between; align-items: center; padding-top: 8mm; border-bottom: 1px solid #f4f4f5; padding-bottom: 5mm; }
  .cont .ref { font-size: 8pt; color: #a1a1aa; }
</style>

<div class="sheet">
  <span class="edge"></span>

  <header>
    ${lockup(30)}
    <div class="contact">
      <span class="label">foldrun</span>
      <span class="placeholder">${CONTACT.address}</span><br>
      <span class="placeholder">${CONTACT.phone}</span><br>
      <span class="em">${CONTACT.email}</span><br>
      ${CONTACT.site}
    </div>
  </header>

  <div class="meta">
    <div class="block">
      <span class="label">To</span>
      <span class="placeholder">[Recipient name]<br>[Company]<br>[Street]<br>[Suburb, State, Postcode]</span>
    </div>
    <div class="block">
      <span class="label">Date</span>
      <span class="placeholder">[Date]</span>
    </div>
    <div class="block">
      <span class="label">Re</span>
      <span class="placeholder">[Subject]</span>
    </div>
  </div>

  <div class="body">
    <p class="salutation">Dear <span class="placeholder">[Name]</span>,</p>
    <p class="placeholder">[Your letter goes here. Keep it to one page where you can — a second page is provided, and rarely needed.]</p>
    <div class="sign">
      <p>Kind regards,</p>
      <div class="rule"></div>
      <div class="who"><span class="placeholder">[Name]</span><br><span class="placeholder">[Title]</span> · foldrun</div>
    </div>
  </div>

  <footer>
    <span class="legal"><span class="placeholder">[Registered name]</span> · <span class="placeholder">[ABN]</span> · ${CONTACT.site}</span>
    <span class="page">1</span>
  </footer>
</div>

<div class="sheet">
  <div class="cont">
    ${lockup(18)}
    <span class="ref"><span class="placeholder">[Recipient]</span> · <span class="placeholder">[Date]</span></span>
  </div>
  <div class="body" style="margin-top:12mm">
    <p class="placeholder">[Continued.]</p>
  </div>
  <footer>
    <span class="legal"><span class="placeholder">[Registered name]</span> · <span class="placeholder">[ABN]</span> · ${CONTACT.site}</span>
    <span class="page">2</span>
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
<w:tbl>
<w:tblPr><w:tblW w:w="5000" w:type="pct"/><w:tblBorders/><w:tblCellMar><w:left w:w="0" w:type="dxa"/><w:right w:w="0" w:type="dxa"/></w:tblCellMar></w:tblPr>
<w:tblGrid><w:gridCol w:w="5000"/><w:gridCol w:w="4412"/></w:tblGrid>
<w:tr><w:tc><w:tcPr><w:tcW w:w="53" w:type="pct"/></w:tcPr>
<w:p><w:pPr><w:spacing w:after="0"/></w:pPr><w:r><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0">
<wp:extent cx="${logoW}" cy="${logoH}"/><wp:docPr id="1" name="foldrun"/>
<a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">
<pic:pic><pic:nvPicPr><pic:cNvPr id="1" name="lockup.png"/><pic:cNvPicPr/></pic:nvPicPr>
<pic:blipFill><a:blip r:embed="rIdLogo"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill>
<pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${logoW}" cy="${logoH}"/></a:xfrm>
<a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr>
</pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r></w:p>
</w:tc>
<w:tc><w:tcPr><w:tcW w:w="47" w:type="pct"/></w:tcPr>
<w:p><w:pPr><w:jc w:val="right"/><w:spacing w:after="0" w:line="240" w:lineRule="auto"/></w:pPr><w:r><w:rPr><w:sz w:val="12"/><w:color w:val="A1A1AA"/><w:caps/><w:spacing w:val="30"/></w:rPr><w:t>foldrun</w:t></w:r></w:p>
<w:p><w:pPr><w:jc w:val="right"/><w:spacing w:after="0" w:line="240" w:lineRule="auto"/></w:pPr><w:r><w:rPr><w:sz w:val="15"/><w:color w:val="A1A1AA"/></w:rPr><w:t xml:space="preserve">${x(CONTACT.address)}</w:t></w:r></w:p>
<w:p><w:pPr><w:jc w:val="right"/><w:spacing w:after="0" w:line="240" w:lineRule="auto"/></w:pPr><w:r><w:rPr><w:sz w:val="15"/><w:color w:val="A1A1AA"/></w:rPr><w:t xml:space="preserve">${x(CONTACT.phone)}</w:t></w:r></w:p>
<w:p><w:pPr><w:jc w:val="right"/><w:spacing w:after="0" w:line="240" w:lineRule="auto"/></w:pPr><w:r><w:rPr><w:sz w:val="15"/><w:color w:val="18181B"/></w:rPr><w:t xml:space="preserve">${x(CONTACT.email)}</w:t></w:r></w:p>
<w:p><w:pPr><w:jc w:val="right"/><w:spacing w:after="0" w:line="240" w:lineRule="auto"/></w:pPr><w:r><w:rPr><w:sz w:val="15"/><w:color w:val="A1A1AA"/></w:rPr><w:t xml:space="preserve">${x(CONTACT.site)}</w:t></w:r></w:p>
</w:tc></w:tr>
</w:tbl>
<w:p><w:pPr><w:spacing w:after="360"/></w:pPr></w:p>
</w:hdr>`,

  "word/footer1.xml": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:ftr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:p><w:pPr><w:pBdr><w:top w:val="single" w:sz="4" w:space="4" w:color="E4E4E7"/></w:pBdr>
<w:jc w:val="center"/></w:pPr>
<w:r><w:rPr><w:sz w:val="14"/><w:color w:val="A1A1AA"/></w:rPr><w:t xml:space="preserve">[Registered name] · [ABN] · ${x(CONTACT.site)}</w:t></w:r></w:p>
</w:ftr>`,

  "word/document.xml": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<w:body>
<w:p><w:r><w:rPr><w:sz w:val="13"/><w:caps/><w:spacing w:val="30"/><w:color w:val="A1A1AA"/></w:rPr><w:t>To</w:t></w:r></w:p>
<w:p><w:r><w:rPr><w:color w:val="A1A1AA"/></w:rPr><w:t>[Recipient name]</w:t></w:r></w:p>
<w:p><w:r><w:rPr><w:color w:val="A1A1AA"/></w:rPr><w:t>[Company]</w:t></w:r></w:p>
<w:p><w:r><w:rPr><w:color w:val="A1A1AA"/></w:rPr><w:t>[Street, Suburb, State, Postcode]</w:t></w:r></w:p>
<w:p/>
<w:p><w:r><w:rPr><w:sz w:val="13"/><w:caps/><w:spacing w:val="30"/><w:color w:val="A1A1AA"/></w:rPr><w:t>Date</w:t></w:r><w:r><w:rPr><w:color w:val="A1A1AA"/></w:rPr><w:t xml:space="preserve">  [Date]</w:t></w:r></w:p>
<w:p><w:r><w:rPr><w:sz w:val="13"/><w:caps/><w:spacing w:val="30"/><w:color w:val="A1A1AA"/></w:rPr><w:t>Re</w:t></w:r><w:r><w:rPr><w:color w:val="A1A1AA"/></w:rPr><w:t xml:space="preserve">  [Subject]</w:t></w:r></w:p>
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
