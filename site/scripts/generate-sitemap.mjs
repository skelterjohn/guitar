import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));
const siteOrigin = 'https://guitar.skelterjohn.me';
const catalogPath = join(__dirname, '../src/data/catalog.yaml');
const outPath = join(__dirname, '../public/sitemap.xml');

const catalog = yaml.load(readFileSync(catalogPath, 'utf8'));
const urls = new Set([`${siteOrigin}/catalog`]);

for (const section of catalog.sections) {
  for (const piece of section.pieces) {
    for (const pdf of piece.pdfs) {
      urls.add(`${siteOrigin}/view/${encodeURIComponent(pdf.file)}`);
    }
  }
}

const lastmod = new Date().toISOString().slice(0, 10);
const urlEntries = [...urls]
  .map(
    (loc) => `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`,
  )
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>
`;

writeFileSync(outPath, xml);
console.log(`sitemap (${urls.size} URLs) → ${outPath}`);
