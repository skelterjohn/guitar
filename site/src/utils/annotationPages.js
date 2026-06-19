export function normalizePageEntry(entry) {
  if (Array.isArray(entry)) {
    return { strokes: entry, glyphs: [] };
  }

  if (!entry || typeof entry !== 'object') {
    return { strokes: [], glyphs: [] };
  }

  return {
    strokes: Array.isArray(entry.strokes) ? entry.strokes : [],
    glyphs: Array.isArray(entry.glyphs) ? entry.glyphs : [],
  };
}

export function normalizePages(pages) {
  if (!pages || typeof pages !== 'object') {
    return {};
  }

  return Object.fromEntries(
    Object.entries(pages).map(([key, entry]) => [key, normalizePageEntry(entry)]),
  );
}

export function emptyPages() {
  return {};
}

export function findPageFrameAt(clientX, clientY) {
  if (typeof document === 'undefined') return null;

  const frames = document.querySelectorAll('.viewer-page-frame');
  for (const frame of frames) {
    const rect = frame.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) continue;

    if (
      clientX >= rect.left &&
      clientX <= rect.right &&
      clientY >= rect.top &&
      clientY <= rect.bottom
    ) {
      return frame;
    }
  }

  return null;
}

export function pageDropFromClientPoint(clientX, clientY) {
  const frame = findPageFrameAt(clientX, clientY);
  if (!frame) return null;

  const pageNumber = Number(frame.dataset.pageNumber);
  if (!Number.isFinite(pageNumber)) return null;

  const rect = frame.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return null;

  return {
    pageNumber,
    x: Math.min(1, Math.max(0, (clientX - rect.left) / rect.width)),
    y: Math.min(1, Math.max(0, (clientY - rect.top) / rect.height)),
  };
}
