import { readFileSync, writeFileSync } from 'fs';

const PDF_PATH = './images/DUO LOGO 3.pdf';
const OUT_PATH = './public/logo.png';

async function extractLogo() {
  const mupdf = await import('mupdf');

  const data = readFileSync(PDF_PATH);
  const doc = mupdf.Document.openDocument(data, 'application/pdf');
  const page = doc.loadPage(0);

  // Render at 4x scale with alpha transparency (so page bg is transparent)
  const mat = mupdf.Matrix.scale(4, 4);
  const pixmap = page.toPixmap(mat, mupdf.ColorSpace.DeviceRGB, true, true);
  const png = pixmap.asPNG();

  writeFileSync(OUT_PATH, png);
  const bounds = page.getBounds();
  console.log(`✓ Logo saved → ${OUT_PATH}  (${Math.round((bounds[2] - bounds[0]) * 4)}×${Math.round((bounds[3] - bounds[1]) * 4)}px)`);
}

extractLogo().catch(console.error);

