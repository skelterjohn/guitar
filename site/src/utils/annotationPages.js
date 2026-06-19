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
