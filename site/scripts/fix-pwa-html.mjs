import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, '../dist');
const manifestTag = '<link rel="manifest" href="/manifest.webmanifest" />';

function fixCatalogHtml() {
  const path = join(distDir, 'catalog.html');
  let html = readFileSync(path, 'utf8');
  html = html.replaceAll('<link rel="manifest" href="/manifest.webmanifest">', '');
  if (!html.includes(manifestTag)) {
    html = html.replace(
      '<link rel="canonical" href="https://guitar.skelterjohn.me/catalog" />',
      `<link rel="canonical" href="https://guitar.skelterjohn.me/catalog" />\n    ${manifestTag}`,
    );
  }
  writeFileSync(path, html);
}

function fixRepHtml() {
  const path = join(distDir, 'rep.html');
  let html = readFileSync(path, 'utf8');
  html = html.replaceAll('<link rel="manifest" href="/manifest.webmanifest">', '');
  html = html.replaceAll('<link rel="manifest" href="/manifest.webmanifest" />', '');
  if (!html.includes('/rep.webmanifest')) {
    throw new Error('rep.html is missing rep.webmanifest link');
  }
  writeFileSync(path, html);
}

fixCatalogHtml();
fixRepHtml();
console.log('pwa html → dist/catalog.html, dist/rep.html');
