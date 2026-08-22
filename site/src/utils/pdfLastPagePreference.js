const STORAGE_PREFIX = 'guitar-last-page:';

/** Best-effort, per-PDF "last page viewed" so a reload lands back where you left off. */
export function getLastPage(key) {
  if (!key) return null;

  try {
    const stored = localStorage.getItem(STORAGE_PREFIX + key);
    const page = Number(stored);
    if (Number.isInteger(page) && page > 0) return page;
  } catch {
    // Best-effort only.
  }
  return null;
}

export function setLastPage(key, page) {
  if (!key || !Number.isInteger(page) || page <= 0) return;

  try {
    localStorage.setItem(STORAGE_PREFIX + key, String(page));
  } catch {
    // Best-effort only.
  }
}
