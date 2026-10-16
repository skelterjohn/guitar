// Budget by bytes, not entry count: a bitmap's size is canvas width * height
// * devicePixelRatio^2, and high-DPR phones (devicePixelRatio 2.5-3 is
// common on Android) can make a single cached page several times the size
// of the same page on a desktop. A flat entry cap let those devices retain
// enough GPU-backed bitmaps at once to blow past the tab's canvas/texture
// memory budget, which Chrome handles by silently corrupting or hanging
// canvas rendering rather than throwing — exactly the stuck-render and
// garbled-page symptoms this was causing on Android.
const MAX_BYTES = 150 * 1024 * 1024;
const cache = new Map();
let totalBytes = 0;

function bitmapBytes(bitmap) {
  return bitmap.width * bitmap.height * 4;
}

function evictOldestRender() {
  let oldestKey = null;
  let oldestAccess = Infinity;

  for (const [key, entry] of cache) {
    if (entry.lastAccess < oldestAccess) {
      oldestAccess = entry.lastAccess;
      oldestKey = key;
    }
  }

  if (!oldestKey) return false;

  const entry = cache.get(oldestKey);
  cache.delete(oldestKey);
  totalBytes -= entry.bytes;
  entry.bitmap.close();
  return true;
}

export function getCachedRender(key) {
  const entry = cache.get(key);
  if (!entry) return null;

  entry.lastAccess = Date.now();
  return entry;
}

// Used when a render for this PDF is suspected to have hung or corrupted —
// drop every cached bitmap for it so the next render pass draws fresh
// instead of replaying whatever is (or isn't) actually in those bitmaps.
export function clearRenderCacheForUrl(url) {
  const prefix = `${url}|`;
  for (const [key, entry] of cache) {
    if (!key.startsWith(prefix)) continue;
    cache.delete(key);
    totalBytes -= entry.bytes;
    entry.bitmap.close();
  }
}

export function setCachedRender(key, bitmap) {
  const existing = cache.get(key);
  if (existing) {
    totalBytes -= existing.bytes;
    existing.bitmap.close();
  }

  const bytes = bitmapBytes(bitmap);
  cache.set(key, {
    bitmap,
    bytes,
    lastAccess: Date.now(),
  });
  totalBytes += bytes;

  while (totalBytes > MAX_BYTES && evictOldestRender()) {
    // keep evicting until back under budget
  }
}
