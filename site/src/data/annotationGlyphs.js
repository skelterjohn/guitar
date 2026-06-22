import {
  CHORD_GLYPH_ID,
  CHORD_GLYPH_SIZE_SCALE,
  CHORD_ROMAN_NUMERAL_FONT,
  CHORD_ROMAN_NUMERAL_OFF,
  chordGlyphBoundsPx,
  chordMenuGlyphSizePx,
} from './chordGrid.js';
import { measureCssPxPerMm } from '../utils/stylusInput.js';

export const GLYPH_SIZE_MM = 5;

/** Visible ink extent for eraser intersection (fraction of font size). */
export const GLYPH_ERASE_RADIUS_RATIO = 0.38;

export const DYNAMIC_GLYPH_FONT = "Georgia, 'Times New Roman', 'Palatino Linotype', serif";

export function annotationGlyphSizePx(zoom = 1) {
  return measureCssPxPerMm() * GLYPH_SIZE_MM * zoom;
}

export const ANNOTATION_ACCIDENTAL_GLYPHS = [
  {
    id: 'double-flat',
    label: 'Double flat',
    symbol: '𝄫',
  },
  {
    id: 'flat',
    label: 'Flat',
    symbol: '♭',
  },
  {
    id: 'natural',
    label: 'Natural',
    symbol: '♮',
  },
  {
    id: 'sharp',
    label: 'Sharp',
    symbol: '♯',
  },
  {
    id: 'double-sharp',
    label: 'Double sharp',
    symbol: '𝄪',
  },
];

export const ANNOTATION_NUMBER_GLYPHS = [0, 1, 2, 3, 4].map((digit) => ({
  id: `num-${digit}`,
  label: String(digit),
  symbol: String(digit),
  fontFamily: 'system-ui, sans-serif',
}));

export const ANNOTATION_CIRCLED_NUMBER_GLYPHS = [1, 2, 3, 4, 5, 6].map((digit) => ({
  id: `circled-${digit}`,
  label: `Circled ${digit}`,
  symbol: String.fromCodePoint(0x2460 + digit - 1),
  fontFamily: 'system-ui, sans-serif',
}));

export const ANNOTATION_FINGERING_GLYPHS = ['p', 'a', 'm', 'i', 'n'].map((letter) => ({
  id: `finger-${letter}`,
  label: letter,
  symbol: letter,
  fontFamily: 'system-ui, sans-serif',
}));

export const ANNOTATION_DYNAMIC_GLYPHS = ['p', 'mp', 'mf', 'f'].map((symbol) => ({
  id: `dyn-${symbol}`,
  label: symbol,
  symbol,
  fontFamily: DYNAMIC_GLYPH_FONT,
  fontStyle: 'italic',
  fontWeight: 600,
}));

export const ANNOTATION_REST_GLYPHS = [
  {
    id: 'rest-sixteenth',
    label: 'Sixteenth rest',
    symbol: '\u{1D13F}',
  },
  {
    id: 'rest-eighth',
    label: 'Eighth rest',
    symbol: '\u{1D13E}',
  },
  {
    id: 'rest-quarter',
    label: 'Quarter rest',
    symbol: '\u{1D13D}',
  },
  {
    id: 'rest-half',
    label: 'Half rest',
    symbol: '\u{1D13C}',
  },
  {
    id: 'rest-whole',
    label: 'Whole rest',
    symbol: '\u{1D13B}',
  },
];

export const ANNOTATION_NOTE_GLYPHS = [
  {
    id: 'note-sixteenth',
    label: 'Sixteenth note',
    symbol: '\u{1D161}',
  },
  {
    id: 'note-eighth',
    label: 'Eighth note',
    symbol: '\u{1D160}',
  },
  {
    id: 'note-quarter',
    label: 'Quarter note',
    symbol: '\u{1D15F}',
  },
  {
    id: 'note-half',
    label: 'Half note',
    symbol: '\u{1D15E}',
  },
  {
    id: 'note-whole',
    label: 'Whole note',
    symbol: '\u{1D15D}',
  },
];

export const ANNOTATION_GLYPHS = [
  ...ANNOTATION_ACCIDENTAL_GLYPHS,
  ...ANNOTATION_NUMBER_GLYPHS,
  ...ANNOTATION_CIRCLED_NUMBER_GLYPHS,
  ...ANNOTATION_FINGERING_GLYPHS,
  ...ANNOTATION_DYNAMIC_GLYPHS,
  ...ANNOTATION_NOTE_GLYPHS,
  ...ANNOTATION_REST_GLYPHS,
];

export function getGlyphById(id) {
  return ANNOTATION_GLYPHS.find((glyph) => glyph.id === id);
}

export const TEXT_GLYPH_ID = 'text';
export const TEXT_GLYPH_DEFAULT = 'text';
export const TEXT_GLYPH_FONT = CHORD_ROMAN_NUMERAL_FONT;

export function isChordGlyph(typeOrGlyph) {
  const type = typeof typeOrGlyph === 'string' ? typeOrGlyph : typeOrGlyph?.type;
  return type === CHORD_GLYPH_ID;
}

export function isTextGlyph(typeOrGlyph) {
  const type = typeof typeOrGlyph === 'string' ? typeOrGlyph : typeOrGlyph?.type;
  return type === TEXT_GLYPH_ID;
}

export const NOTE_REST_GLYPH_SIZE_SCALE = 2;

export function isNoteRestGlyph(glyphId) {
  return (
    typeof glyphId === 'string'
    && (glyphId.startsWith('note-') || glyphId.startsWith('rest-'))
  );
}

export function glyphStampSizeScale(glyphId, baseScale = 1) {
  let scale = baseScale;
  if (isChordGlyph(glyphId)) {
    scale *= CHORD_GLYPH_SIZE_SCALE;
  }
  if (isNoteRestGlyph(glyphId)) {
    scale *= NOTE_REST_GLYPH_SIZE_SCALE;
  }
  return scale;
}

export function glyphDisplayText(glyph) {
  if (isTextGlyph(glyph)) {
    const text = glyph.text?.trim();
    return text || TEXT_GLYPH_DEFAULT;
  }
  return getGlyphById(glyph.type)?.symbol ?? '';
}

export function glyphEraseRadiusPx(glyph, glyphSizePx) {
  if (isTextGlyph(glyph)) {
    const text = glyphDisplayText(glyph);
    return glyphSizePx * Math.max(GLYPH_ERASE_RADIUS_RATIO, text.length * 0.28);
  }
  if (isChordGlyph(glyph)) {
    const showNumeral = glyph.chord?.romanNumeral !== CHORD_ROMAN_NUMERAL_OFF;
    const { widthPx, heightPx } = chordGlyphBoundsPx(chordMenuGlyphSizePx(glyphSizePx), {
      showNumeral,
      marks: glyph.chord?.marks,
      rotate: glyph.chord?.rotate === true,
      romanNumeral: glyph.chord?.romanNumeral,
    });
    return Math.hypot(widthPx, heightPx) * 0.38;
  }
  const sizeScale = isNoteRestGlyph(glyph.type ?? glyph.glyphId) ? NOTE_REST_GLYPH_SIZE_SCALE : 1;
  return glyphSizePx * GLYPH_ERASE_RADIUS_RATIO * sizeScale;
}

export function isDynamicGlyph(glyph) {
  return glyph?.id?.startsWith('dyn-') ?? false;
}
