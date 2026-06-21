import { ANNOTATION_LAYER_COLORS } from './annotationColorPreference.js';
import { PEN_COLOR } from './stylusInput.js';

export const PAGE_RASTER_FORMAT = 'webp';

function normalizeLayerBlob(entry) {
  if (!entry || typeof entry !== 'object') return null;
  const blob = entry.data instanceof Blob ? entry.data : entry.blob;
  return blob ?? null;
}

function normalizeLegacyPageRaster(entry) {
  const blob = normalizeLayerBlob(entry);
  const width = Number(entry.width);
  const height = Number(entry.height);

  if (!blob || !Number.isFinite(width) || width <= 0 || !Number.isFinite(height) || height <= 0) {
    return null;
  }

  return { blob, width, height };
}

export function normalizePageEntry(entry) {
  if (!entry || typeof entry !== 'object') {
    return null;
  }

  if (entry.layers && typeof entry.layers === 'object') {
    const width = Number(entry.width);
    const height = Number(entry.height);
    if (!Number.isFinite(width) || width <= 0 || !Number.isFinite(height) || height <= 0) {
      return null;
    }

    const layers = {};
    for (const [color, layerEntry] of Object.entries(entry.layers)) {
      const blob = normalizeLayerBlob(layerEntry);
      if (blob) {
        layers[color] = { blob };
      }
    }

    if (Object.keys(layers).length === 0) {
      return null;
    }

    return { width, height, layers };
  }

  const legacy = normalizeLegacyPageRaster(entry);
  if (!legacy) {
    return null;
  }

  return {
    width: legacy.width,
    height: legacy.height,
    layers: {
      [PEN_COLOR]: { blob: legacy.blob },
    },
  };
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

export function createLayerRasterRecord(blob) {
  return {
    format: PAGE_RASTER_FORMAT,
    data: blob,
  };
}

export function createPageLayersRecord(width, height, layers) {
  return {
    width,
    height,
    layers,
  };
}

export function pageHasLayers(entry) {
  return normalizePageEntry(entry) != null;
}

export function pageHasLayer(entry, color) {
  const normalized = normalizePageEntry(entry);
  return Boolean(normalized?.layers?.[color]?.blob);
}

export { ANNOTATION_LAYER_COLORS };

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

/** @deprecated Use pageHasLayers */
export function pageHasRaster(entry) {
  return pageHasLayers(entry);
}

/** @deprecated Use createPageLayersRecord */
export function createPageRasterRecord(blob, width, height) {
  return createPageLayersRecord(width, height, {
    [PEN_COLOR]: createLayerRasterRecord(blob),
  });
}
