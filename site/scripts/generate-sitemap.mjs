import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';
import { njgoOrigin } from '../src/seo.js';
import { viewRouteFilename } from '../src/utils/pdfPaths.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const siteOrigin = 'https://guitar.skelterjohn.me';
const catalogPath = join(__dirname, '../src/data/catalog.yaml');
const guitarSitemapPath = join(__dirname, '../public/sitemap.xml');
const njgoSitemapPath = join(__dirname, '../public/njgo-sitemap.xml');
const robotsPath = join(__dirname, '../public/robots.txt');

const catalog = yaml.load(readFileSync(catalogPath, 'utf8'));
const urls = new Set([`${siteOrigin}/`, `${siteOrigin}/catalog`]);

for (const section of catalog.sections) {
  for (const piece of section.pieces) {
    for (const pdf of piece.pdfs) {
      urls.add(`${siteOrigin}/catalog/view/${encodeURIComponent(viewRouteFilename(pdf.file))}`);
    }
  }
}

const lastmod = new Date().toISOString().slice(0, 10);

function buildSitemap(urls) {
  const urlEntries = [...urls]
    .map(
      (loc) => `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`,
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>
`;
}

writeFileSync(guitarSitemapPath, buildSitemap(urls));
console.log(`sitemap (${urls.size} URLs) → ${guitarSitemapPath}`);

const njgoUrls = new Set([`${njgoOrigin}/`]);
writeFileSync(njgoSitemapPath, buildSitemap(njgoUrls));
console.log(`njgo-sitemap (${njgoUrls.size} URLs) → ${njgoSitemapPath}`);

writeFileSync(
  robotsPath,
  `User-agent: *
Allow: /
Disallow: /rep
Disallow: /book

Sitemap: ${siteOrigin}/sitemap.xml
Sitemap: ${njgoOrigin}/njgo-sitemap.xml
`,
);
console.log(`robots.txt → ${robotsPath}`);
