export const GLYPH_SIZE_MM = 5;

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
