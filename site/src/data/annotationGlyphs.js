export const GLYPH_SIZE_MM = 5;

/** Invisible hit target when dragging (fraction of font size). */
export const GLYPH_HIT_RADIUS_RATIO = 0.65;

/** Visible ink extent for eraser intersection (fraction of font size). */
export const GLYPH_ERASE_RADIUS_RATIO = 0.38;

export const ANNOTATION_GLYPHS = [
  {
    id: 'sharp',
    label: 'Sharp',
    symbol: '♯',
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
];

export function getGlyphById(id) {
  return ANNOTATION_GLYPHS.find((glyph) => glyph.id === id);
}
