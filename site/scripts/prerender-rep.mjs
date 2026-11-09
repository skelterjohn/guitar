import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { njgoImageUrl, njgoRepUrl, repDescription, repTitle } from '../src/seo.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distIndex = join(__dirname, '../dist/index.html');
const distRep = join(__dirname, '../dist/rep.html');

function escapeHtml(text) {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

// Only the <head> metadata differs from the generic shell — the repertoire
// itself is password-gated and entirely client-rendered (see Rep.jsx), so
// unlike njgo.html there's no body content to prerender here. This exists
// purely so link-preview bots (which don't run JS) see NJGO branding
// instead of the generic site default when a njgo.org/rep link is shared.
function setRepHead(page) {
  return page
    .replace(/<title>.*?<\/title>/, `<title>${escapeHtml(repTitle)}</title>`)
    .replace(
      /<meta\s+name="description"[\s\S]*?\/>/,
      `<meta name="description" content="${escapeHtml(repDescription)}" />`,
    )
    .replace(
      /<link rel="canonical" href="[^"]*"\s*\/>/,
      `<link rel="canonical" href="${njgoRepUrl}" />`,
    )
    .replace(
      /<meta property="og:title" content="[^"]*"\s*\/>/,
      `<meta property="og:title" content="${escapeHtml(repTitle)}" />`,
    )
    .replace(
      /<meta\s+property="og:description"[\s\S]*?\/>/,
      `<meta property="og:description" content="${escapeHtml(repDescription)}" />`,
    )
    .replace(
      /<meta property="og:url" content="[^"]*"\s*\/>/,
      `<meta property="og:url" content="${njgoRepUrl}" />`,
    )
    .replace(
      '<meta property="og:type" content="website" />',
      `<meta property="og:type" content="website" />
    <meta property="og:image" content="${njgoImageUrl}" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:image" content="${njgoImageUrl}" />
    <meta name="robots" content="noindex, nofollow" />`,
    );
}

const template = readFileSync(distIndex, 'utf8');
writeFileSync(distRep, setRepHead(template));
console.log(`prerender rep → ${distRep}`);
