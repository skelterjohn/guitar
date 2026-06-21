import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import getStroke from 'perfect-freehand';
import ChordDiagram from '../components/ChordDiagram.jsx';
import { CHORD_ROMAN_NUMERAL_OFF, chordGlyphBoundsPx, chordGlyphRenderWidthPx } from '../data/chordGrid.js';
import {
  getGlyphById,
  GLYPH_SIZE_MM,
  isChordGlyph,
  isTextGlyph,
  TEXT_GLYPH_DEFAULT,
  TEXT_GLYPH_FONT,
} from '../data/annotationGlyphs.js';
import { PEN_BASE_WIDTH, PEN_THINNING } from './stylusInput.js';

/** Glyph height as a fraction of page overlay width (≈5mm at ~800px). */
export const GLYPH_SIZE_LAYOUT_RATIO = (GLYPH_SIZE_MM * (96 / 25.4)) / 800;

export function layoutWidthPxForGlyphSize(glyphSizePx) {
  return glyphSizePx / GLYPH_SIZE_LAYOUT_RATIO;
}

export const RASTER_EXPORT_TYPE = 'image/webp';
export const RASTER_EXPORT_QUALITY = 0.92;
export const MENU_GLYPH_COLOR = '#f8fafc';

const MUSIC_GLYPH_FONT = "'Segoe UI Symbol', 'Noto Music', 'Bravura Text', serif";
const stampCache = new Map();

function glyphSizePx(layoutWidthPx) {
  return layoutWidthPx * GLYPH_SIZE_LAYOUT_RATIO;
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function svgMarkupToCanvas(svgMarkup, width, height) {
  const svg = svgMarkup.includes('xmlns')
    ? svgMarkup
    : svgMarkup.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  try {
    const img = await loadImage(url);
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.ceil(width));
    canvas.height = Math.max(1, Math.ceil(height));
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas;
  } finally {
    URL.revokeObjectURL(url);
  }
}

function getSvgPathFromStroke(stroke) {
  if (!stroke.length) return '';

  const d = stroke.reduce(
    (acc, [x0, y0], index, arr) => {
      const [x1, y1] = arr[(index + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ['M', ...stroke[0], 'Q'],
  );

  d.push('Z');
  return d.join(' ');
}

export function glyphDrawSpecFromDrop({ glyphId, text, chord, color }) {
  return {
    glyphId,
    text,
    chord,
    color,
  };
}

function stampCacheKey(spec, layoutWidthPx) {
  return JSON.stringify({
    glyphId: spec.glyphId,
    text: spec.text ?? null,
    chord: spec.chord ?? null,
    color: spec.color,
    layoutWidthPx: Math.round(layoutWidthPx),
  });
}

function configureTextContext(ctx, fontSize, fontFamily, fontStyle, fontWeight) {
  const style = fontStyle ?? 'normal';
  const weight = fontWeight ?? 'normal';
  ctx.font = `${style} ${weight} ${fontSize}px ${fontFamily}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
}

async function renderChordMarkup(spec, sizePx) {
  const chord = spec.chord ?? {};
  const romanNumeral = chord.romanNumeral ?? CHORD_ROMAN_NUMERAL_OFF;
  const marks = chord.marks ?? [];
  const rotate = chord.rotate === true;
  const widthPx = chordGlyphRenderWidthPx(sizePx);

  return renderToStaticMarkup(
    createElement(ChordDiagram, {
      marks,
      romanNumeral,
      widthPx,
      color: spec.color,
      forGlyph: true,
      rotate,
      numeralSizePx: sizePx,
    }),
  );
}

/**
 * Renders a glyph to an offscreen canvas. anchorX/anchorY is the placement point
 * (center for symbols/text, bounds center for chords).
 */
export async function buildGlyphStamp(spec, layoutWidthPx) {
  const cacheKey = stampCacheKey(spec, layoutWidthPx);
  if (stampCache.has(cacheKey)) {
    return stampCache.get(cacheKey);
  }

  const promise = (async () => {
    const sizePx = glyphSizePx(layoutWidthPx);

    if (isChordGlyph(spec.glyphId)) {
      const chord = spec.chord ?? {};
      const showNumeral = chord.romanNumeral !== CHORD_ROMAN_NUMERAL_OFF;
      const bounds = chordGlyphBoundsPx(sizePx, {
        showNumeral,
        marks: chord.marks ?? [],
        rotate: chord.rotate === true,
        romanNumeral: chord.romanNumeral ?? CHORD_ROMAN_NUMERAL_OFF,
      });
      const svgMarkup = await renderChordMarkup(spec, sizePx);
      const canvas = await svgMarkupToCanvas(svgMarkup, bounds.widthPx, bounds.heightPx);
      return {
        canvas,
        width: canvas.width,
        height: canvas.height,
        anchorX: canvas.width / 2,
        anchorY: canvas.height / 2,
      };
    }

    let label;
    let fontFamily;
    let fontStyle;
    let fontWeight;
    let fontSize = sizePx;

    if (isTextGlyph(spec.glyphId)) {
      label = spec.text?.trim() || TEXT_GLYPH_DEFAULT;
      fontFamily = TEXT_GLYPH_FONT;
      fontWeight = 600;
    } else {
      const glyphDef = getGlyphById(spec.glyphId);
      if (!glyphDef?.symbol) {
        return null;
      }
      label = glyphDef.symbol;
      fontFamily = glyphDef.fontFamily ?? MUSIC_GLYPH_FONT;
      fontStyle = glyphDef.fontStyle;
      fontWeight = glyphDef.fontWeight;
    }

    const measureCanvas = document.createElement('canvas');
    const measureCtx = measureCanvas.getContext('2d');
    configureTextContext(measureCtx, fontSize, fontFamily, fontStyle, fontWeight);
    const metrics = measureCtx.measureText(label);
    const textWidth = Math.ceil(metrics.width + fontSize * 0.4);
    const textHeight = Math.ceil(fontSize * 1.2);

    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, textWidth);
    canvas.height = Math.max(1, textHeight);
    const ctx = canvas.getContext('2d');
    configureTextContext(ctx, fontSize, fontFamily, fontStyle, fontWeight);
    ctx.fillStyle = spec.color;
    ctx.fillText(label, canvas.width / 2, canvas.height / 2);

    return {
      canvas,
      width: canvas.width,
      height: canvas.height,
      anchorX: canvas.width / 2,
      anchorY: canvas.height / 2,
    };
  })();

  stampCache.set(cacheKey, promise);
  return promise;
}

export function drawGlyphStampAt(ctx, stamp, normX, normY, layoutWidthPx, layoutHeightPx) {
  if (!stamp?.canvas) return;

  const x = normX * layoutWidthPx;
  const y = normY * layoutHeightPx;
  ctx.drawImage(
    stamp.canvas,
    x - stamp.anchorX,
    y - stamp.anchorY,
    stamp.width,
    stamp.height,
  );
}

export async function drawGlyphOnCanvas(ctx, spec, normX, normY, layoutWidthPx, layoutHeightPx) {
  const stamp = await buildGlyphStamp(spec, layoutWidthPx);
  if (!stamp) return;
  drawGlyphStampAt(ctx, stamp, normX, normY, layoutWidthPx, layoutHeightPx);
}

export function drawStrokeOnCanvas(ctx, stroke, layoutWidthPx, layoutHeightPx) {
  if (!stroke?.points?.length || stroke.points.length < 2) return;

  const inputPoints = stroke.points.map(([x, y, pressure = 0.5]) => [
    x * layoutWidthPx,
    y * layoutHeightPx,
    pressure,
  ]);
  const baseWidth = stroke.baseWidth ?? PEN_BASE_WIDTH;
  const outline = getStroke(inputPoints, {
    size: baseWidth,
    thinning: PEN_THINNING,
    smoothing: 0.5,
    streamline: 0.5,
    simulatePressure: true,
  });

  const pathData = getSvgPathFromStroke(outline);
  if (!pathData) return;

  const path = new Path2D(pathData);
  ctx.fillStyle = stroke.color ?? '#dc2626';
  ctx.fill(path);
}

export function eraseCircleOnCanvas(ctx, xPx, yPx, radiusPx) {
  ctx.save();
  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.arc(xPx, yPx, radiusPx, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export async function loadBlobOntoCanvas(canvas, blob) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  if (!blob) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    return;
  }

  const url = URL.createObjectURL(blob);
  try {
    const img = await loadImage(url);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function resizeCanvasBitmap(sourceCanvas, srcWidth, srcHeight, destWidth, destHeight) {
  const next = document.createElement('canvas');
  next.width = Math.max(1, Math.round(destWidth));
  next.height = Math.max(1, Math.round(destHeight));
  const ctx = next.getContext('2d');
  ctx.drawImage(sourceCanvas, 0, 0, srcWidth, srcHeight, 0, 0, next.width, next.height);
  return next;
}

export function setCanvasPixelSize(canvas, width, height) {
  if (!canvas) return false;

  const nextWidth = Math.max(1, Math.round(width));
  const nextHeight = Math.max(1, Math.round(height));

  if (canvas.width === nextWidth && canvas.height === nextHeight) {
    return false;
  }

  canvas.width = nextWidth;
  canvas.height = nextHeight;
  return true;
}

export function syncCanvasDimensions(canvas, width, height) {
  const nextWidth = Math.max(1, Math.round(width));
  const nextHeight = Math.max(1, Math.round(height));

  if (canvas.width === nextWidth && canvas.height === nextHeight) {
    return false;
  }

  const previous = document.createElement('canvas');
  previous.width = canvas.width;
  previous.height = canvas.height;
  previous.getContext('2d').drawImage(canvas, 0, 0);

  canvas.width = nextWidth;
  canvas.height = nextHeight;

  if (previous.width > 0 && previous.height > 0) {
    canvas.getContext('2d').drawImage(
      previous,
      0,
      0,
      previous.width,
      previous.height,
      0,
      0,
      canvas.width,
      canvas.height,
    );
  }

  return true;
}

export function canvasToPageBlob(canvas) {
  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => resolve(blob),
      RASTER_EXPORT_TYPE,
      RASTER_EXPORT_QUALITY,
    );
  });
}

export function clearStampCache() {
  stampCache.clear();
}
