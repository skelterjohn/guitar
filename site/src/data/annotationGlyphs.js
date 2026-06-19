export const GLYPH_SIZE_MM = 5;

/** Invisible hit target when dragging (fraction of font size). */
export const GLYPH_HIT_RADIUS_RATIO = 0.65;

/** Visible ink extent for eraser intersection (fraction of font size). */
export const GLYPH_ERASE_RADIUS_RATIO = 0.38;

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

export const ANNOTATION_GLYPHS = [
  ...ANNOTATION_ACCIDENTAL_GLYPHS,
  ...ANNOTATION_NUMBER_GLYPHS,
  ...ANNOTATION_CIRCLED_NUMBER_GLYPHS,
  ...ANNOTATION_FINGERING_GLYPHS,
];

export function getGlyphById(id) {
  return ANNOTATION_GLYPHS.find((glyph) => glyph.id === id);
}
