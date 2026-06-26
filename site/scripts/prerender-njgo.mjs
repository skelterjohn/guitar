import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';
import { buildNjgoJsonLd } from '../src/njgoJsonLd.js';
import { externalLinkIconHtml } from '../src/components/externalLinkIcon.js';
import { eventGoogleCalendarUrl } from '../src/utils/eventCalendar.js';
import { eventTitle, normalizeMapLink } from '../src/utils/eventLocation.js';
import { eventDateTimeAttr, formatEventDate } from '../src/utils/formatEventDate.js';
import { eventYearsFromData } from '../src/utils/eventYears.js';
import { NJGO_DEFAULT_TAB, NJGO_TABS, NJGO_TAB_IDS } from '../src/utils/njgoTabs.js';
import { njgoDescription, njgoPageTitle, njgoUrl } from '../src/seo.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distIndex = join(__dirname, '../dist/index.html');
const distNjgo = join(__dirname, '../dist/njgo.html');
const overviewPath = join(__dirname, '../src/data/njgo-overview.yaml');
const rosterPath = join(__dirname, '../src/data/njgo-roster.yaml');
const directorPath = join(__dirname, '../src/data/njgo-director.yaml');
const eventsPath = join(__dirname, '../src/data/events.yaml');

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

function renderDirector(director) {
  const paragraphs = bioParagraphs(director.bio);
  const image = director.image
    ? `<div class="njgo-director-photo-wrap">
      <img class="njgo-director-photo" src="${escapeHtml(director.image)}" alt="" width="1200" height="1578" loading="lazy" />
    </div>`
    : '';
  const bio = paragraphs.length
    ? paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('')
    : '';

  return `<article class="njgo-director">
  ${image}
  <div class="njgo-director-bio">
    <h2 class="njgo-director-name">${escapeHtml(director.name ?? '')}</h2>
    ${bio}
  </div>
</article>`;
}

function renderEventCalendarLink(event) {
  const calendarUrl = eventGoogleCalendarUrl(event);
  if (!calendarUrl) {
    return '';
  }

  return `<a class="njgo-overview-link njgo-event-action-link" href="${escapeHtml(calendarUrl)}" target="_blank" rel="noopener noreferrer" aria-label="Add to Google Calendar"><span class="njgo-overview-link-label"><span class="njgo-event-action-label">calendar</span>${externalLinkIconHtml()}</span></a>`;
}

function renderEventCard(event) {
  const formattedDate = formatEventDate(event.date);
  const dateTimeAttr = eventDateTimeAttr(event.date);
  const mapUrl = normalizeMapLink(event.map_link ?? event.address);
  const mapLink = mapUrl
    ? `<a class="njgo-overview-link njgo-event-action-link" href="${escapeHtml(mapUrl)}" target="_blank" rel="noopener noreferrer" aria-label="Open in Google Maps"><span class="njgo-overview-link-label"><span class="njgo-event-action-label">map</span>${externalLinkIconHtml()}</span></a>`
    : '';
  const calendarLink = eventGoogleCalendarUrl(event) ? renderEventCalendarLink(event) : '';
  const actions = mapLink || calendarLink
    ? `<div class="njgo-event-actions">${mapLink}${calendarLink}</div>`
    : '';
  const meta = formattedDate && dateTimeAttr
    ? `<p class="njgo-event-meta"><time class="njgo-event-date" datetime="${escapeHtml(dateTimeAttr)}">${escapeHtml(formattedDate)}</time></p>`
    : '';
  const links = Array.isArray(event.links)
    ? `<ul class="njgo-event-links">${event.links
        .map(
          (link) =>
            `<li><a class="njgo-overview-link" href="${escapeHtml(link.url)}" rel="noopener noreferrer"><span class="njgo-overview-link-label">${escapeHtml(link.name)}</span></a></li>`,
        )
        .join('')}</ul>`
    : '';

  const image = event.image
    ? `<div class="njgo-roster-photo-frame">
      <img class="njgo-roster-photo" src="/events/${escapeHtml(event.image)}" alt="" loading="lazy" />
    </div>`
    : '';

  const articleClass = event.image
    ? 'njgo-event njgo-roster-card njgo-event--has-image'
    : 'njgo-event njgo-roster-card';

  return `<article class="${articleClass}">
  ${image}
  <div class="njgo-roster-card-body">
    ${actions}
    <h2 class="njgo-event-name">${escapeHtml(eventTitle(event))}</h2>
    ${meta}
    ${links}
  </div>
</article>`;
}

function renderEvents(eventsData) {
  const years = eventYearsFromData(eventsData);
  if (years.length === 0) {
    return '';
  }

  return `<ul class="njgo-events">${years
    .map(({ year, events }) => {
      const items = Array.isArray(events) ? events : [];
      if (items.length === 0) {
        return '';
      }

      return `<li class="njgo-events-year">
  <ul class="njgo-events-year-list">${items
    .map((event) => `<li>${renderEventCard(event)}</li>`)
    .join('')}</ul>
  <div class="njgo-events-year-divider" aria-hidden="true">
    <span class="njgo-events-year-divider-line"></span>
    <span class="njgo-events-year-divider-mark">
      <span class="njgo-events-year-divider-logo-wrap">
        <img class="njgo-events-year-divider-logo" src="/njgo/logo_black.png" alt="" loading="lazy" decoding="async" />
      </span>
      <span class="njgo-events-year-divider-label">${year}</span>
    </span>
    <span class="njgo-events-year-divider-line"></span>
  </div>
</li>`;
    })
    .join('')}</ul>`;
}

function renderNjgoTabScript() {
  return `<script>
(function () {
  var tabs = ${JSON.stringify(NJGO_TAB_IDS)};
  var defaultTab = ${JSON.stringify(NJGO_DEFAULT_TAB)};

  function activeTabFromHash() {
    var id = (location.hash || '').slice(1);
    return tabs.indexOf(id) >= 0 ? id : defaultTab;
  }

  function showTab(active) {
    tabs.forEach(function (id) {
      var tab = document.getElementById('njgo-tab-' + id);
      var panel = document.getElementById('njgo-panel-' + id);
      if (tab) tab.setAttribute('aria-selected', id === active ? 'true' : 'false');
      if (panel) {
        if (id === active) panel.removeAttribute('hidden');
        else panel.setAttribute('hidden', '');
      }
    });
  }

  function syncFromHash() {
    showTab(activeTabFromHash());
  }

  document.querySelector('.njgo-roster-tablist')?.addEventListener('click', function (event) {
    var link = event.target.closest('a[role="tab"]');
    if (!link || !link.hash) return;
    event.preventDefault();
    var id = link.hash.slice(1);
    if (tabs.indexOf(id) < 0) return;
    history.replaceState(null, '', link.hash);
    showTab(id);
  });

  window.addEventListener('hashchange', syncFromHash);
  syncFromHash();
})();
</script>`;
}

function panelHidden(tabId) {
  return tabId === NJGO_DEFAULT_TAB ? '' : ' hidden';
}

function renderRoster(members, director, events) {
  const tabLinks = NJGO_TABS.map(
    (tab) =>
      `<a role="tab" id="njgo-tab-${tab.id}" class="njgo-roster-tab" href="#${tab.id}" aria-selected="${tab.id === NJGO_DEFAULT_TAB ? 'true' : 'false'}" aria-controls="njgo-panel-${tab.id}">${escapeHtml(tab.label)}</a>`,
  ).join('\n    ');

  return `<section class="njgo-roster" aria-label="NJGO">
  <div class="njgo-roster-tablist" role="tablist" aria-label="NJGO">
    ${tabLinks}
  </div>
  <div id="njgo-panel-director" role="tabpanel" class="njgo-roster-panel" aria-labelledby="njgo-tab-director"${panelHidden('director')}>
    ${renderDirector(director)}
  </div>
  <div id="njgo-panel-roster" role="tabpanel" class="njgo-roster-panel" aria-labelledby="njgo-tab-roster"${panelHidden('roster')}>
    <p class="njgo-roster-note">in no particular order, past and present</p>
    <ul class="njgo-roster-grid">
    ${members
      .map((member) => `<li>${renderRosterMember(member)}</li>`)
      .join('\n    ')}
  </ul>
  </div>
  <div id="njgo-panel-events" role="tabpanel" class="njgo-roster-panel" aria-labelledby="njgo-tab-events"${panelHidden('events')}>
    ${renderEvents(events)}
  </div>
  ${renderNjgoTabScript()}
</section>`;
}

function renderNjgo(overview, roster, director, events) {
  const jsonLd = JSON.stringify(buildNjgoJsonLd(roster)).replaceAll('<', '\\u003c');

  return `<main class="page page--njgo">
  <div class="njgo-page">
    <script type="application/ld+json">${jsonLd}</script>
    ${renderOverview(overview)}
    ${renderRoster(roster.members ?? [], director, events)}
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
const director = yaml.load(readFileSync(directorPath, 'utf8'));
const eventsData = yaml.load(readFileSync(eventsPath, 'utf8'));
const template = readFileSync(distIndex, 'utf8');
const root = '<div id="root"></div>';
const njgoHtml = renderNjgo(overview, roster, director, eventsData.events ?? []);

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
