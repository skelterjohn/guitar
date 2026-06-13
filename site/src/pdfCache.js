const CACHE_NAME = 'guitar-pdfs-v1';
const memoryCache = new Map();
const inflight = new Map();

function resolveUrl(url) {
  return new URL(url, window.location.href).href;
}

function pdfLogLabel(resolvedUrl) {
  const parsed = new URL(resolvedUrl);
  const name = decodeURIComponent(
    parsed.pathname.split('/').pop() || resolvedUrl,
  );
  const hash = parsed.searchParams.get('v') ?? 'no hash';
  return `${name} (${hash})`;
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
    } catch {
      // Quota or privacy mode — still return the fetched bytes.
    }
  }

  const buffer = await response.arrayBuffer();
  return new Uint8Array(buffer);
}

async function loadPdfBytes(url) {
  const resolved = resolveUrl(url);

  const cached = await readFromCacheApi(resolved);
  if (cached) return cached;

  return fetchAndStore(resolved);
}

export async function fetchPdfBytes(url) {
  const resolved = resolveUrl(url);

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
    memoryCache.set(resolved, bytes);
    return bytes.slice();
  } finally {
    inflight.delete(resolved);
  }
}
