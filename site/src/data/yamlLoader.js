function fetchUrl(path) {
  const base = (import.meta.env.VITE_PDF_BASE_URL ?? '/pdf').replace(/\/$/, '');
  return `${base}/${path}`;
}

async function readCachedText(cacheName, url) {
  if (!('caches' in globalThis)) return null;
  try {
    const cache = await caches.open(cacheName);
    const response = await cache.match(url);
    if (!response) return null;
    return response.text();
  } catch {
    return null;
  }
}

async function writeCachedText(cacheName, url, text) {
  if (!('caches' in globalThis)) return;
  try {
    const cache = await caches.open(cacheName);
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

/**
 * Builds a network-first loader for a YAML config file served from GCS
 * (via /pdf/<path>), falling back to Cache Storage, then a build-time
 * bundled copy. Shared by repertoire.js and njgo-roster.js — the two
 * YAML files that get edited live and so can't just be static imports.
 */
export function createYamlLoader({ label, cacheName, path, parse, fallback }) {
  const url = fetchUrl(path);
  let inflight = null;

  return async function load() {
    if (inflight) return inflight;

    inflight = (async () => {
      try {
        const response = await fetch(url, { cache: 'no-store' });
        if (response.ok) {
          const text = await response.text();
          const data = parse(text);
          await writeCachedText(cacheName, url, text);
          console.log(`[${label}] loaded from network`);
          return data;
        }
        console.warn(`[${label}] network returned ${response.status}`);
      } catch (error) {
        console.warn(`[${label}] network unreachable`, error);
      }

      const cached = await readCachedText(cacheName, url);
      if (cached) {
        console.log(`[${label}] loaded from cache`);
        return parse(cached);
      }

      console.log(`[${label}] using bundled fallback`);
      return fallback;
    })();

    try {
      return await inflight;
    } finally {
      inflight = null;
    }
  };
}
