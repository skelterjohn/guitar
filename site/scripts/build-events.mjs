import { cpSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';
import { splitEventLocation } from '../src/utils/eventLocation.js';
import { flattenEvents, groupEventsByYear } from '../src/utils/eventYears.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const eventsYamlPath = join(__dirname, '../src/data/events.yaml');
const imagesDir = join(__dirname, '../src/data/events');
const publicImagesDir = join(__dirname, '../public/events');
const eventsUrl = 'https://jaysonmartinez.org/events';

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function decodeHtml(text) {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&ndash;/g, '–')
    .replace(/&mdash;/g, '—');
}

function parseArticles(html) {
  const articles = html.split('<article class="eventlist-event');
  const parsed = [];

  for (const chunk of articles.slice(1)) {
    const titleMatch = chunk.match(/eventlist-title-link">([^<]+)</);
    const calMatch = chunk.match(/dates=([^/]+)/);
    const locMatch = chunk.match(/location=([^&"]+)/);
    const addrMatch = chunk.match(
      /eventlist-meta-address[^>]*>\s*([\s\S]*?)\s*(?:<a[^>]*eventlist-meta-address-maplink|<\/li>)/,
    );
    const imageMatch = chunk.match(
      /data-image="(https:\/\/images\.squarespace-cdn\.com[^"]+)"/,
    ) ?? chunk.match(
      /src="(https:\/\/images\.squarespace-cdn\.com[^"]+)"/,
    );

    if (!titleMatch || !calMatch) continue;

    const startUtc = calMatch[1];
    const date = `${startUtc.slice(0, 4)}-${startUtc.slice(4, 6)}-${startUtc.slice(6, 8)}T${startUtc.slice(9, 11)}:${startUtc.slice(11, 13)}:00Z`;
    const location = locMatch
      ? decodeURIComponent(locMatch[1].replace(/\+/g, ' '))
      : decodeHtml(addrMatch?.[1] ?? '').replace(/\s+/g, ' ').trim();

    parsed.push({
      name: decodeHtml(titleMatch[1].trim()),
      date,
      location,
      imageUrl: imageMatch?.[1],
    });
  }

  return parsed;
}

function eventDayKey(event) {
  const date = new Date(event.date);
  if (Number.isNaN(date.getTime())) {
    return slugify(event.name);
  }
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${slugify(event.name)}-${y}-${m}-${d}`;
}

function mergeEventRecords(existing, sourced) {
  if (existing?.links?.length) {
    return {
      ...existing,
      imageUrl: sourced?.imageUrl ?? existing.imageUrl,
      image: existing.image,
    };
  }

  const merged = { ...sourced, ...existing };
  if (!existing?.location && sourced?.location) {
    merged.location = sourced.location;
  }
  if (existing?.date) {
    merged.date = existing.date;
  }
  if (sourced?.imageUrl) {
    merged.imageUrl = sourced.imageUrl;
  }
  return merged;
}

function normalizeEventFields(event) {
  const { location, address } = splitEventLocation(event.name, event.location);
  const normalized = { ...event, location, address };
  if (!normalized.address) delete normalized.address;
  if (!normalized.location) delete normalized.location;
  return normalized;
}

function extensionFromUrl(url) {
  const pathname = new URL(url).pathname;
  const ext = extname(pathname).toLowerCase();
  if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.webp') {
    return ext === '.jpg' ? '.jpeg' : ext;
  }
  return '.jpeg';
}

async function downloadImage(url, outputPath) {
  const downloadUrl = `${url.split('?')[0]}?format=1500w`;
  const response = await fetch(downloadUrl);
  if (!response.ok) {
    throw new Error(`Failed to download ${downloadUrl}: ${response.status}`);
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  writeFileSync(outputPath, buffer);
}

function toYaml(eventsByYear) {
  const header = '# Events sourced from https://jaysonmartinez.org/events\nevents:\n';
  const years = Object.keys(eventsByYear).map(Number).sort((a, b) => b - a);
  const sections = years.map((year) => {
    const block = yaml.dump(
      { [String(year)]: eventsByYear[year] },
      { lineWidth: 120, noRefs: true, sortKeys: false },
    );
    return block
      .trimEnd()
      .split('\n')
      .map((line) => `  ${line}`)
      .join('\n');
  });
  return `${header}${sections.join('\n')}\n`;
}

const existing = yaml.load(readFileSync(eventsYamlPath, 'utf8'));
const existingEvents = flattenEvents(existing?.events);
const existingByKey = new Map(existingEvents.map((event) => [eventDayKey(event), event]));

const html = await (await fetch(eventsUrl)).text();
const sourced = parseArticles(html);
const sourcedByKey = new Map(sourced.map((event) => [eventDayKey(event), event]));

mkdirSync(imagesDir, { recursive: true });
mkdirSync(publicImagesDir, { recursive: true });

const merged = new Map();

for (const event of existingEvents) {
  merged.set(eventDayKey(event), { ...event });
}

for (const event of sourced) {
  const key = eventDayKey(event);
  const current = merged.get(key);
  merged.set(
    key,
    current ? mergeEventRecords(current, event) : { ...event },
  );
}

const today = new Date();
const allEvents = [...merged.values()].sort(
  (a, b) => new Date(b.date) - new Date(a.date),
);

for (const event of allEvents) {
  const key = eventDayKey(event);
  const sourceEvent = sourcedByKey.get(key);
  const imageUrl = event.imageUrl ?? sourceEvent?.imageUrl;
  if (!imageUrl) continue;

  const filename = `${eventDayKey(event)}${extensionFromUrl(imageUrl)}`;
  const outputPath = join(imagesDir, filename);
  await downloadImage(imageUrl, outputPath);
  cpSync(outputPath, join(publicImagesDir, filename));
  event.image = filename;
  delete event.imageUrl;
}

const normalizedEvents = allEvents.map((event) => {
  delete event.imageUrl;
  return normalizeEventFields(event);
});

writeFileSync(eventsYamlPath, toYaml(groupEventsByYear(normalizedEvents)));
console.log(`Wrote ${normalizedEvents.length} events to ${eventsYamlPath}`);
console.log(`Downloaded images to ${imagesDir}`);
