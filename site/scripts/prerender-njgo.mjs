import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';
import { buildNjgoJsonLd } from '../src/njgoJsonLd.js';
import { njgoDescription, njgoPageTitle, njgoUrl } from '../src/seo.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distIndex = join(__dirname, '../dist/index.html');
const distNjgo = join(__dirname, '../dist/njgo.html');
const overviewPath = join(__dirname, '../src/data/njgo-overview.yaml');
const rosterPath = join(__dirname, '../src/data/njgo-roster.yaml');

const DIRECTOR_EMAIL = 'newjerseyguitarorchestra@gmail.com';

const PUBLIC_LINKS = [
  { label: 'Facebook', url: 'https://www.facebook.com/GuitarNJ/' },
  {
    label: 'Join the NJGO',
    url: 'https://docs.google.com/forms/d/e/1FAIpQLScaoHIsS4QA0h27dhL8k-moKiY4I3B_FiiC8TAJ4p-LlAYwJg/viewform',
  },
  { label: 'Events', url: 'https://jaysonmartinez.org/events' },
  { label: 'Youtube', url: 'https://www.youtube.com/@newjerseyguitarorchestra/videos' },
];

function escapeHtml(text) {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function bioParagraphs(bio) {
  if (typeof bio !== 'string' || !bio.trim()) return [];
  return bio.split('\n\n').map((paragraph) => paragraph.trim()).filter(Boolean);
}

function cropObjectPosition(crop) {
  const point = crop?.focal_point;
  if (!point || typeof point.x !== 'number' || typeof point.y !== 'number') {
    return '';
  }
  const position = `${point.x * 100}% ${point.y * 100}%`;
  return ` style="object-position: ${position}"`;
}

function renderPublicLinks() {
  return `<nav class="njgo-overview-links" aria-label="Links">
  <section class="njgo-overview-links-public" aria-labelledby="njgo-links-heading">
    <h3 id="njgo-links-heading" class="njgo-overview-links-heading">Links</h3>
    ${PUBLIC_LINKS.map(
      (link) =>
        `<a class="njgo-overview-link" href="${escapeHtml(link.url)}" rel="noopener noreferrer"><span class="njgo-overview-link-label">${escapeHtml(link.label)}</span></a>`,
    ).join('\n    ')}
  </section>
</nav>`;
}

function renderOverview(overview) {
  const paragraphs = overview.paragraphs ?? [];
  const logo = overview.logo
    ? `<div class="njgo-overview-logo-wrap">
    <img class="njgo-overview-logo" src="${escapeHtml(overview.logo)}" alt="New Jersey Guitar Orchestra" width="189" height="441" />
  </div>`
    : '';

  return `<section class="njgo-overview" aria-label="About">
  <h1 class="njgo-page-title">
    <span class="njgo-page-title-line">New Jersey</span>
    <span class="njgo-page-title-line">Guitar Orchestra</span>
  </h1>
  ${logo}
  <div class="njgo-overview-text">
    ${paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('\n    ')}
    <p class="njgo-overview-director">
      <a class="njgo-overview-email" href="mailto:${DIRECTOR_EMAIL}">Jayson Martinez, Director</a>
    </p>
    ${renderPublicLinks()}
  </div>
</section>`;
}

function renderRosterMember(member) {
  const paragraphs = bioParagraphs(member.bio);
  const image = member.image
    ? `<div class="njgo-roster-photo-frame">
      <img class="njgo-roster-photo" src="${escapeHtml(member.image)}" alt="" width="320" height="240" loading="lazy"${cropObjectPosition(member.crop)} />
    </div>`
    : '';
  const bio = paragraphs.length
    ? `<div class="njgo-roster-bio">${paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('')}</div>`
    : '';

  return `<article class="njgo-roster-card">
  ${image}
  <div class="njgo-roster-card-body">
    <h2 class="njgo-roster-name">${escapeHtml(member.name)}</h2>
    ${bio}
  </div>
</article>`;
}

function renderRoster(members) {
  return `<section class="njgo-roster" aria-labelledby="njgo-roster-heading">
  <h2 id="njgo-roster-heading" class="njgo-roster-heading">Meet the NJGO Performers</h2>
  <p class="njgo-roster-note">in no particular order, past and present</p>
  <ul class="njgo-roster-grid">
    ${members
      .map((member) => `<li>${renderRosterMember(member)}</li>`)
      .join('\n    ')}
  </ul>
</section>`;
}

function renderNjgo(overview, roster) {
  const jsonLd = JSON.stringify(buildNjgoJsonLd(roster)).replaceAll('<', '\\u003c');

  return `<main class="page page--njgo">
  <div class="njgo-page">
    <script type="application/ld+json">${jsonLd}</script>
    ${renderOverview(overview)}
    ${renderRoster(roster.members ?? [])}
  </div>
</main>`;
}

function setNjgoHead(page) {
  return page
    .replace(/<title>.*?<\/title>/, `<title>${escapeHtml(njgoPageTitle)}</title>`)
    .replace(
      /<meta\s+name="description"[\s\S]*?\/>/,
      `<meta name="description" content="${escapeHtml(njgoDescription)}" />`,
    )
    .replace(
      /<link rel="canonical" href="[^"]*"\s*\/>/,
      `<link rel="canonical" href="${njgoUrl}" />`,
    )
    .replace(
      /<meta property="og:title" content="[^"]*"\s*\/>/,
      `<meta property="og:title" content="${escapeHtml(njgoPageTitle)}" />`,
    )
    .replace(
      /<meta\s+property="og:description"[\s\S]*?\/>/,
      `<meta property="og:description" content="${escapeHtml(njgoDescription)}" />`,
    )
    .replace(
      /<meta property="og:url" content="[^"]*"\s*\/>/,
      `<meta property="og:url" content="${njgoUrl}" />`,
    );
}

const overview = yaml.load(readFileSync(overviewPath, 'utf8'));
const roster = yaml.load(readFileSync(rosterPath, 'utf8'));
const template = readFileSync(distIndex, 'utf8');
const root = '<div id="root"></div>';
const njgoHtml = renderNjgo(overview, roster);

if (!template.includes(root)) {
  console.error('prerender: expected #root in dist/index.html');
  process.exit(1);
}

const njgoPage = setNjgoHead(template).replace(
  root,
  `<div id="root">${njgoHtml}</div>`,
);

writeFileSync(distNjgo, njgoPage);
console.log(`prerender njgo → ${distNjgo}`);
