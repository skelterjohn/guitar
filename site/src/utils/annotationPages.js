export const PAGE_RASTER_FORMAT = 'webp';

export function normalizePageEntry(entry) {
  if (!entry || typeof entry !== 'object') {
    return null;
  }

  const blob = entry.data instanceof Blob ? entry.data : entry.blob;
  const width = Number(entry.width);
  const height = Number(entry.height);

  if (blob && Number.isFinite(width) && width > 0 && Number.isFinite(height) && height > 0) {
    return { blob, width, height };
  }

  return null;
}

export function normalizePages(pages) {
  if (!pages || typeof pages !== 'object') {
    return {};
  }

  const result = {};
  for (const [key, entry] of Object.entries(pages)) {
    const normalized = normalizePageEntry(entry);
    if (normalized) {
      result[key] = normalized;
    }
  }
  return result;
}

export function createPageRasterRecord(blob, width, height) {
  return {
    format: PAGE_RASTER_FORMAT,
    data: blob,
    width,
    height,
  };
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

export function pageHasRaster(entry) {
  return normalizePageEntry(entry) != null;
}
