import { canvasToPageBlob } from './annotationRaster.js';

function loadImageFromBlob(blob) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(err);
    };
    img.src = url;
  });
}

/** Composites two ink layers (opaque strokes on a transparent backdrop) so both survive. */
async function mergeLayerBlobs(blobA, blobB, width, height) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  for (const blob of [blobA, blobB]) {
    if (!blob) continue;
    const img = await loadImageFromBlob(blob);
    ctx.drawImage(img, 0, 0, width, height);
  }

  return canvasToPageBlob(canvas);
}

/**
 * Unions two annotation page sets page-by-page, layer-by-layer: every stroke
 * present on either side survives. Where both sides have a layer for the
 * same page/color, the two rasters are composited together; otherwise
 * whichever side has the layer wins as-is.
 */
export async function mergeAnnotationPages(pagesA, pagesB) {
  const pageKeys = new Set([...Object.keys(pagesA ?? {}), ...Object.keys(pagesB ?? {})]);
  const merged = {};

  for (const pageKey of pageKeys) {
    const pageA = pagesA?.[pageKey];
    const pageB = pagesB?.[pageKey];
    const width = pageA?.width ?? pageB?.width;
    const height = pageA?.height ?? pageB?.height;
    if (!width || !height) continue;

    const colors = new Set([
      ...Object.keys(pageA?.layers ?? {}),
      ...Object.keys(pageB?.layers ?? {}),
    ]);

    const layers = {};
    for (const color of colors) {
      const blobA = pageA?.layers?.[color]?.blob ?? null;
      const blobB = pageB?.layers?.[color]?.blob ?? null;

      if (blobA && blobB) {
        layers[color] = { blob: await mergeLayerBlobs(blobA, blobB, width, height) };
      } else {
        layers[color] = { blob: blobA ?? blobB };
      }
    }

    merged[pageKey] = { width, height, layers };
  }

  return merged;
}
