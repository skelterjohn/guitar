const MAX_ENTRIES = 48;
const cache = new Map();

function evictOldestRender() {
  let oldestKey = null;
  let oldestAccess = Infinity;

  for (const [key, entry] of cache) {
    if (entry.lastAccess < oldestAccess) {
      oldestAccess = entry.lastAccess;
      oldestKey = key;
    }
  }

  if (!oldestKey) return;

  const entry = cache.get(oldestKey);
  cache.delete(oldestKey);
  entry.bitmap.close();
}

export function getCachedRender(key) {
  const entry = cache.get(key);
  if (!entry) return null;

  entry.lastAccess = Date.now();
  return entry;
}

export function setCachedRender(key, bitmap) {
  const existing = cache.get(key);
  if (existing) {
    existing.bitmap.close();
  }

  cache.set(key, {
    bitmap,
    lastAccess: Date.now(),
  });

  while (cache.size > MAX_ENTRIES) {
    evictOldestRender();
  }
}
