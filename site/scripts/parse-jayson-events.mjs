import { readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const htmlPath = process.argv[2] ?? join(tmpdir(), 'jayson-events.html');
const html = readFileSync(htmlPath, 'utf8');
const articles = html.split('<article class="eventlist-event');

const events = [];
for (const chunk of articles.slice(1)) {
  const titleMatch = chunk.match(/eventlist-title-link">([^<]+)</);
  const calMatch = chunk.match(/dates=([^/]+)/);
  const locMatch = chunk.match(/location=([^&"]+)/);
  const addrMatch = chunk.match(/eventlist-meta-address[^>]*>\s*([^<]+)/);
  if (!titleMatch || !calMatch) continue;

  const startUtc = calMatch[1];
  const iso = `${startUtc.slice(0, 4)}-${startUtc.slice(4, 6)}-${startUtc.slice(6, 8)}T${startUtc.slice(9, 11)}:${startUtc.slice(11, 13)}:00Z`;
  const location = locMatch
    ? decodeURIComponent(locMatch[1].replace(/\+/g, ' '))
    : (addrMatch ? addrMatch[1].trim() : '');

  const name = titleMatch[1]
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&ndash;/g, '–');

  events.push({ name, date: iso, location });
}

writeFileSync(process.argv[3] ?? 'events-parsed.json', JSON.stringify(events, null, 2));
console.log(`parsed ${events.length} events`);
