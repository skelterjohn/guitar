import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';
import { buildHomeJsonLd } from '../src/homeJsonLd.js';
import { siteHeading } from '../src/seo.js';
import { pieceId } from '../src/utils/pieceId.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const catalogPath = join(__dirname, '../src/data/catalog.yaml');
const distCatalog = join(__dirname, '../dist/catalog.html');

function escapeHtml(text) {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function renderPdfLinks(pdfs) {
  return pdfs
    .map(
      (pdf) =>
        `<a class="pdf-link" href="/view/${encodeURIComponent(pdf.file)}">${escapeHtml(pdf.label)}</a>`,
    )
    .join('');
}

function renderExternalLinks(links) {
  if (!links?.length) return '';
  return `<div class="external-links">${links
    .map(
      (link) =>
        `<a class="external-link" href="${escapeHtml(link.url)}" rel="noopener noreferrer">${escapeHtml(link.label)}</a>`,
    )
    .join('')}</div>`;
}

function renderPiece(section, piece) {
  const id = pieceId(section.id, piece.title);
  const paragraphs = piece.description?.split('\n\n').filter(Boolean) ?? [];
  const description = paragraphs.length
    ? `<div class="composition-description">${paragraphs
        .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
        .join('')}</div>`
    : '';

  return `<article id="${id}" class="composition-card">
  <h3>${escapeHtml(piece.title)}</h3>
  ${description}
  <div class="pdf-links">${renderPdfLinks(piece.pdfs)}</div>
  ${renderExternalLinks(piece.links)}
</article>`;
}

function renderCatalog(sections) {
  return sections
    .map(
      (section) => `<section class="catalog-section">
  <h2>${escapeHtml(section.title)}</h2>
  ${section.pieces.map((piece) => renderPiece(section, piece)).join('\n  ')}
</section>`,
    )
    .join('\n');
}

function renderToc(sections) {
  return `<nav class="toc" aria-label="Table of contents">
  <ol class="toc-list">
    ${sections
      .map(
        (section) => `<li class="toc-section">
      <span class="toc-section-title">${escapeHtml(section.title)}</span>
      <ol class="toc-pieces">
        ${section.pieces
          .map(
            (piece) =>
              `<li><a href="#${pieceId(section.id, piece.title)}">${escapeHtml(piece.title)}</a></li>`,
          )
          .join('\n        ')}
      </ol>
    </li>`,
      )
      .join('\n    ')}
  </ol>
</nav>`;
}

function renderHome(catalog) {
  const jsonLd = JSON.stringify(buildHomeJsonLd(catalog)).replaceAll('<', '\\u003c');

  return `<div class="page-shell">
${renderToc(catalog.sections)}
<main class="page">
  <script type="application/ld+json">${jsonLd}</script>
  <header class="page-header">
    <div class="page-header-top">
      <h1>${escapeHtml(siteHeading)}</h1>
      <div class="repo-source">
        <span class="repo-label">pdfs and site built from</span>
        <a class="repo-link" href="https://github.com/skelterjohn/guitar" rel="noopener noreferrer">github.com/skelterjohn/guitar</a>
      </div>
    </div>
    <p>original compositions, arrangements, and transcriptions.</p>
  </header>
  ${renderCatalog(catalog.sections)}
</main>
</div>`;
}

const catalog = yaml.load(readFileSync(catalogPath, 'utf8'));
const page = readFileSync(distCatalog, 'utf8');
const root = '<div id="root"></div>';

if (!page.includes(root)) {
  console.error('prerender: expected empty #root in dist/catalog.html');
  process.exit(1);
}

writeFileSync(distCatalog, page.replace(root, `<div id="root">${renderHome(catalog)}</div>`));
console.log(`prerender → ${distCatalog}`);
