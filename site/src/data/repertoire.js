import yaml from 'js-yaml';
import bundledSource from './repertoire.yaml?raw';
import pdfHashes from './pdf-hashes.json';

const CACHE_NAME = 'guitar-repertoire-v1';

function repertoireFetchUrl() {
  const base = (import.meta.env.VITE_PDF_BASE_URL ?? '/pdf').replace(/\/$/, '');
  return `${base}/repertoire.yaml`;
}

function enrich(repertoire) {
  if (!repertoire?.sections) return { sections: [] };

  for (const section of repertoire.sections) {
    for (const piece of section.pieces ?? []) {
      for (const pdf of piece.pdfs ?? []) {
        const hash = pdfHashes[pdf.file];
        if (hash) pdf.hash = hash;
      }
    }
  }
  return repertoire;
}

function parse(source) {
  return enrich(yaml.load(source));
}

const bundledRepertoire = parse(bundledSource);

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
 * Network-first repertoire config from GCS (via /pdf/repertoire.yaml).
 * Falls back to Cache Storage, then the build-time bundled copy.
 */
export async function loadRepertoire() {
  if (inflight) return inflight;

  inflight = (async () => {
    const url = repertoireFetchUrl();

    try {
      const response = await fetch(url, { cache: 'no-store' });
      if (response.ok) {
        const text = await response.text();
        const data = parse(text);
        await writeCachedText(url, text);
        console.log('[repertoire] loaded from network');
        return data;
      }
      console.warn(`[repertoire] network returned ${response.status}`);
    } catch (error) {
      console.warn('[repertoire] network unreachable', error);
    }

    const cached = await readCachedText(url);
    if (cached) {
      console.log('[repertoire] loaded from cache');
      return parse(cached);
    }

    console.log('[repertoire] using bundled fallback');
    return bundledRepertoire;
  })();

  try {
    return await inflight;
  } finally {
    inflight = null;
  }
}

/** Build-time copy for callers that need a sync fallback. */
export default bundledRepertoire;
