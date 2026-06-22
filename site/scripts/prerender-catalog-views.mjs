import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';
import { catalogPath, pageTitle } from '../src/seo.js';
import { viewMusicCompositionJsonLd } from '../src/viewJsonLd.js';
import { viewRouteFilename } from '../src/utils/pdfPaths.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const catalogYamlPath = join(__dirname, '../src/data/catalog.yaml');
const distIndex = join(__dirname, '../dist/index.html');
const viewsDir = join(__dirname, '../dist/catalog/view');

function escapeHtml(text) {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function viewerPageName(piece, pdf, filename) {
  if (!piece || !pdf) return filename;
  if (pdf.label === 'score') return piece.title;
  return `${piece.title} (${pdf.label})`;
}

function viewDescription(piece, name) {
  return piece?.description?.split('\n\n').find(Boolean) ?? `${name} — guitar score PDF`;
}

function pdfDownloadPath(file) {
  const encoded = file.split('/').map(encodeURIComponent).join('/');
  return `/pdf/${encoded}`;
}

function setViewHead(page, { title, description, url }) {
  return page
    .replace(/<title>.*?<\/title>/, `<title>${escapeHtml(title)}</title>`)
    .replace(
      /<meta\s+name="description"[\s\S]*?\/>/,
      `<meta name="description" content="${escapeHtml(description)}" />`,
    )
    .replace(
      /<link rel="canonical" href="[^"]*"\s*\/>/,
      `<link rel="canonical" href="${url}" />`,
    )
    .replace(
      /<meta property="og:title" content="[^"]*"\s*\/>/,
      `<meta property="og:title" content="${escapeHtml(title)}" />`,
    )
    .replace(
      /<meta\s+property="og:description"[\s\S]*?\/>/,
      `<meta property="og:description" content="${escapeHtml(description)}" />`,
    )
    .replace(
      /<meta property="og:url" content="[^"]*"\s*\/>/,
      `<meta property="og:url" content="${url}" />`,
    );
}

function renderViewPage({ section, piece, pdf, routeName, canonicalUrl }) {
  const name = viewerPageName(piece, pdf, routeName);
  const description = viewDescription(piece, name);
  const paragraphs = piece.description?.split('\n\n').filter(Boolean) ?? [];
  const jsonLd = JSON.stringify(viewMusicCompositionJsonLd(piece, pdf, routeName)).replaceAll(
    '<',
    '\\u003c',
  );
  const pdfHref = pdfDownloadPath(pdf.file);

  return `<main class="page">
  <script type="application/ld+json">${jsonLd}</script>
  <header class="page-header">
    <div class="page-header-top">
      <div class="page-header-title">
        <a class="page-back" href="${catalogPath}" aria-label="Catalog">Catalog</a>
        <h1>${escapeHtml(name)}</h1>
      </div>
    </div>
    ${
      paragraphs.length
        ? `<div class="composition-description">${paragraphs
            .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
            .join('')}</div>`
        : `<p>${escapeHtml(description)}</p>`
    }
    <p><a class="pdf-link" href="${escapeHtml(pdfHref)}">Open PDF</a></p>
    ${
      section?.title
        ? `<p class="view-section-label">from <a href="${catalogPath}">${escapeHtml(section.title)}</a></p>`
        : ''
    }
  </header>
</main>`;
}

const catalog = yaml.load(readFileSync(catalogYamlPath, 'utf8'));
const template = readFileSync(distIndex, 'utf8');
const root = '<div id="root"></div>';

if (!template.includes(root)) {
  console.error('prerender: expected #root in dist/index.html');
  process.exit(1);
}

mkdirSync(viewsDir, { recursive: true });

let count = 0;

for (const section of catalog.sections) {
  for (const piece of section.pieces) {
    for (const pdf of piece.pdfs) {
      const routeName = viewRouteFilename(pdf.file);
      const name = viewerPageName(piece, pdf, routeName);
      const description = viewDescription(piece, name);
      const canonicalUrl = `https://guitar.skelterjohn.me/catalog/view/${encodeURIComponent(routeName)}`;
      const body = renderViewPage({
        section,
        piece,
        pdf,
        routeName,
        canonicalUrl,
      });
      const page = setViewHead(template, {
        title: pageTitle(name),
        description,
        url: canonicalUrl,
      }).replace(root, `<div id="root">${body}</div>`);
      const outPath = join(viewsDir, `${routeName}.html`);

      writeFileSync(outPath, page);
      count += 1;
    }
  }
}

console.log(`prerender catalog views (${count} pages) → ${viewsDir}`);
