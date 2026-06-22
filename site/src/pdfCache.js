const CACHE_NAME = 'guitar-pdfs-v1';
const memoryCache = new Map();
const inflight = new Map();

export function resolvePdfUrl(url) {
  return new URL(url, window.location.href).href;
}

export function pdfLogLabel(resolvedUrl) {
  const parsed = new URL(resolvedUrl);
  const name = decodeURIComponent(
    parsed.pathname.split('/').pop() || resolvedUrl,
  );
  const hash = parsed.searchParams.get('v') ?? 'no hash';
  return `${name} (${hash})`;
}

export function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function memoryCacheStats() {
  let bytes = 0;
  for (const entry of memoryCache.values()) {
    bytes += entry.byteLength;
  }
  return { count: memoryCache.size, bytes };
}

async function storageCacheStats() {
  if (!('caches' in globalThis)) return { count: 0, bytes: 0 };

  const cache = await caches.open(CACHE_NAME);
  const keys = await cache.keys();
  let bytes = 0;

  for (const request of keys) {
    const response = await cache.match(request);
    if (!response) continue;
    bytes += (await response.clone().blob()).size;
  }

  return { count: keys.length, bytes };
}

async function readFromCacheApi(url) {
  if (!('caches' in globalThis)) return null;

  const cache = await caches.open(CACHE_NAME);
  const response = await cache.match(url);
  if (!response) return null;

  console.log(`[pdf] cache hit (storage): ${pdfLogLabel(url)}`);
  const buffer = await response.arrayBuffer();
  return new Uint8Array(buffer);
}

async function fetchAndStore(url) {
  console.log(`[pdf] downloading: ${pdfLogLabel(url)}`);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load PDF (${response.status})`);
  }

  if ('caches' in globalThis) {
    try {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(url, response.clone());
      const { count, bytes } = await storageCacheStats();
      console.log(
        `[pdf] cache add (storage): ${pdfLogLabel(url)} [${count} pdfs, ${formatBytes(bytes)}]`,
      );
    } catch {
      // Quota or privacy mode — still return the fetched bytes.
    }
  }

  const buffer = await response.arrayBuffer();
  return new Uint8Array(buffer);
}

async function loadPdfBytes(url) {
  const resolved = resolvePdfUrl(url);

  const cached = await readFromCacheApi(resolved);
  if (cached) return cached;

  return fetchAndStore(resolved);
}

export async function fetchPdfBytes(url) {
  const resolved = resolvePdfUrl(url);

  const cached = memoryCache.get(resolved);
  if (cached) {
    console.log(`[pdf] cache hit (memory): ${pdfLogLabel(resolved)}`);
    return cached.slice();
  }

  let pending = inflight.get(resolved);
  if (!pending) {
    pending = loadPdfBytes(url);
    inflight.set(resolved, pending);
  }

  try {
    const bytes = await pending;
    const owned = bytes.slice();
    const isNew = !memoryCache.has(resolved);
    memoryCache.set(resolved, owned);
    if (isNew) {
      const { count, bytes: totalBytes } = memoryCacheStats();
      console.log(
        `[pdf] cache add (memory): ${pdfLogLabel(resolved)} [${count} pdfs, ${formatBytes(totalBytes)}]`,
      );
    }
    return owned.slice();
  } finally {
    inflight.delete(resolved);
  }
}
