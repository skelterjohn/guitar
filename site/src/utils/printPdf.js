import { ANNOTATION_LAYER_COLORS } from './annotationColorPreference.js';
import { normalizePageEntry } from './annotationPages.js';
import { loadBlobOntoCanvas } from './annotationRaster.js';

/** Target resolution for print compositing (PDF points are 72 per inch). */
export const PRINT_DPI = 200;

const PDF_POINTS_PER_INCH = 72;
const PRINT_SCALE = PRINT_DPI / PDF_POINTS_PER_INCH;
const PRINT_JPEG_QUALITY = 0.95;

async function renderPdfPage(pdfDoc, pageNumber) {
  const page = await pdfDoc.getPage(pageNumber);
  const viewport = page.getViewport({ scale: PRINT_SCALE });
  const width = Math.floor(viewport.width);
  const height = Math.floor(viewport.height);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');
  await page.render({
    canvasContext: context,
    viewport,
    canvas,
  }).promise;

  return { canvas, width, height };
}

async function drawAnnotationLayers(ctx, pageLayers, width, height) {
  if (!pageLayers?.layers) return;

  for (const color of ANNOTATION_LAYER_COLORS) {
    const blob = pageLayers.layers[color]?.blob;
    if (!blob) continue;

    const layerCanvas = document.createElement('canvas');
    layerCanvas.width = pageLayers.width;
    layerCanvas.height = pageLayers.height;
    await loadBlobOntoCanvas(layerCanvas, blob);

    if (layerCanvas.width > 0 && layerCanvas.height > 0) {
      ctx.drawImage(layerCanvas, 0, 0, width, height);
    }
  }
}

/**
 * Render each PDF page at print resolution and composite annotation layers on top.
 * Returns JPEG data URLs sized for the physical page dimensions at PRINT_DPI.
 * @param {{ pageStart?: number, pageEnd?: number } | null} pageRange
 */
export async function buildPrintSheets(pdfDoc, pageCount, pageAnnotations, pageRange = null) {
  const sheets = [];
  const start = pageRange?.pageStart ?? 1;
  const end = pageRange?.pageEnd ?? pageCount;

  for (let pageNumber = start; pageNumber <= end; pageNumber += 1) {
    const { canvas, width, height } = await renderPdfPage(pdfDoc, pageNumber);
    const pageLayers = normalizePageEntry(pageAnnotations[String(pageNumber)]);
    await drawAnnotationLayers(canvas.getContext('2d'), pageLayers, width, height);

    sheets.push({
      width,
      height,
      src: canvas.toDataURL('image/jpeg', PRINT_JPEG_QUALITY),
    });
  }

  return sheets;
}
