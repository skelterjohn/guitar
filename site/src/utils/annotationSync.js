import { ANNOTATION_LAYER_COLORS } from './annotationColorPreference.js';
import { PAGE_RASTER_FORMAT, normalizePageEntry } from './annotationPages.js';

export const ANNOTATION_LAYER_SLUG_BY_HEX = {
  '#000000': 'black',
  '#16a34a': 'green',
  '#2563eb': 'blue',
  '#dc2626': 'red',
};

const LAYER_SLUG_ORDER = ['black', 'green', 'blue', 'red'];

/** Hash used when a PDF has no annotation rasters. */
export const EMPTY_ANNOTATION_RASTERS_HASH = '0';

export function isEmptyAnnotationRastersHash(hash) {
  return hash === EMPTY_ANNOTATION_RASTERS_HASH;
}

export function annotationLayerSlug(hexColor) {
  return ANNOTATION_LAYER_SLUG_BY_HEX[hexColor] ?? null;
}

export function annotationRasterFilename(pdfFilename, page, layerSlug) {
  return `${pdfFilename}-p${page}-${layerSlug}.${PAGE_RASTER_FORMAT}`;
}

export function collectAnnotationRasters(pdfFilename, pages) {
  const pagesMeta = {};
  const rasters = [];

  const pageKeys = Object.keys(pages).sort((a, b) => Number(a) - Number(b));
  for (const pageKey of pageKeys) {
    const page = normalizePageEntry(pages[pageKey]);
    if (!page) continue;

    pagesMeta[pageKey] = { width: page.width, height: page.height };

    for (const layerColor of ANNOTATION_LAYER_COLORS) {
      const layer = page.layers?.[layerColor];
      if (!layer?.blob) continue;

      const layerSlug = annotationLayerSlug(layerColor);
      if (!layerSlug) continue;

      rasters.push({
        name: annotationRasterFilename(pdfFilename, Number(pageKey), layerSlug),
        page: Number(pageKey),
        layer: layerSlug,
        width: page.width,
        height: page.height,
        blob: layer.blob,
      });
    }
  }

  rasters.sort(
    (a, b) =>
      a.page - b.page ||
      LAYER_SLUG_ORDER.indexOf(a.layer) - LAYER_SLUG_ORDER.indexOf(b.layer),
  );

  return { pages: pagesMeta, rasters };
}

export async function computeAnnotationRastersHash(rasters) {
  if (rasters.length === 0) {
    return EMPTY_ANNOTATION_RASTERS_HASH;
  }

  const parts = await Promise.all(rasters.map((entry) => entry.blob.arrayBuffer()));
  const totalLength = parts.reduce((sum, part) => sum + part.byteLength, 0);
  const combined = new Uint8Array(totalLength);
  let offset = 0;
  for (const part of parts) {
    combined.set(new Uint8Array(part), offset);
    offset += part.byteLength;
  }

  const hashBuffer = await crypto.subtle.digest('SHA-256', combined);
  return [...new Uint8Array(hashBuffer)]
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

export async function buildAnnotationSyncPayload(pdfFilename, pages) {
  const { pages: pagesMeta, rasters } = collectAnnotationRasters(pdfFilename, pages);
  const hash = await computeAnnotationRastersHash(rasters);
  return { hash, pages: pagesMeta, rasters };
}

export const ANNOTATION_LAYER_HEX_BY_SLUG = Object.fromEntries(
  Object.entries(ANNOTATION_LAYER_SLUG_BY_HEX).map(([hex, slug]) => [slug, hex]),
);

export function remoteAnnotationsToPages(pagesMeta, rasterBlobsByName, rasterList) {
  const pages = {};

  for (const raster of rasterList) {
    const pageKey = String(raster.page);
    const layerColor = ANNOTATION_LAYER_HEX_BY_SLUG[raster.layer];
    const blob = rasterBlobsByName[raster.name];
    if (!layerColor || !(blob instanceof Blob)) continue;

    if (!pages[pageKey]) {
      const dims = pagesMeta?.[pageKey];
      pages[pageKey] = {
        width: dims?.width ?? raster.width,
        height: dims?.height ?? raster.height,
        layers: {},
      };
    }

    pages[pageKey].layers[layerColor] = { blob };
  }

  return pages;
}
