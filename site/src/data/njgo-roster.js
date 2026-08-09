import yaml from 'js-yaml';
import bundledSource from './njgo-roster.yaml?raw';

const CACHE_NAME = 'guitar-njgo-roster-v1';

function rosterFetchUrl() {
  const base = (import.meta.env.VITE_PDF_BASE_URL ?? '/pdf').replace(/\/$/, '');
  return `${base}/njgo-roster.yaml`;
}

function parse(source) {
  return yaml.load(source) ?? { members: [] };
}

const bundledRoster = parse(bundledSource);

async function readCachedText(url) {
  if (!('caches' in globalThis)) return null;
  try {
    const cache = await caches.open(CACHE_NAME);
    const response = await cache.match(url);
    if (!response) return null;
    return response.text();
  } catch {
    return null;
  }
}

async function writeCachedText(url, text) {
  if (!('caches' in globalThis)) return;
  try {
    const cache = await caches.open(CACHE_NAME);
    await cache.put(
      url,
      new Response(text, {
        headers: { 'Content-Type': 'text/yaml; charset=utf-8' },
      }),
    );
  } catch {
    // Quota or privacy mode — ignore.
  }
}

let inflight = null;

/**
 * Network-first NJGO roster from GCS (via /pdf/njgo-roster.yaml).
 * Falls back to Cache Storage, then the build-time bundled copy.
 */
export async function loadNjgoRoster() {
  if (inflight) return inflight;

  inflight = (async () => {
    const url = rosterFetchUrl();

    try {
      const response = await fetch(url, { cache: 'no-store' });
      if (response.ok) {
        const text = await response.text();
        const data = parse(text);
        await writeCachedText(url, text);
        console.log('[njgo-roster] loaded from network');
        return data;
      }
      console.warn(`[njgo-roster] network returned ${response.status}`);
    } catch (error) {
      console.warn('[njgo-roster] network unreachable', error);
    }

    const cached = await readCachedText(url);
    if (cached) {
      console.log('[njgo-roster] loaded from cache');
      return parse(cached);
    }

    console.log('[njgo-roster] using bundled fallback');
    return bundledRoster;
  })();

  try {
    return await inflight;
  } finally {
    inflight = null;
  }
}

/** Build-time copy for callers that need a sync fallback. */
export default bundledRoster;
