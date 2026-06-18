import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { repDescription, siteHeading } from '../src/seo.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distIndex = join(__dirname, '../dist/index.html');

function escapeHtml(text) {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function renderLanding() {
  return `<main class="page landing-page">
  <header class="page-header landing-header">
    <h1>${escapeHtml(siteHeading)}</h1>
    <p>classical guitar scores</p>
  </header>
  <nav class="landing-nav" aria-label="Site sections">
    <a class="landing-link" href="/catalog">
      <span class="landing-link-title">catalog</span>
      <span class="landing-link-desc">original compositions, arrangements, and transcriptions</span>
    </a>
    <a class="landing-link" href="/rep">
      <span class="landing-link-title">repertoire</span>
      <span class="landing-link-desc">${escapeHtml(repDescription)}</span>
    </a>
  </nav>
</main>`;
}

const page = readFileSync(distIndex, 'utf8');
const root = '<div id="root"></div>';

if (!page.includes(root)) {
  console.error('prerender: expected empty #root in dist/index.html');
  process.exit(1);
}

writeFileSync(distIndex, page.replace(root, `<div id="root">${renderLanding()}</div>`));
console.log(`prerender home → ${distIndex}`);
