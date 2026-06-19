export const CHORD_GRID_VIEW_WIDTH = 19;
export const CHORD_GRID_VIEW_HEIGHT = 24;

export const CHORD_GRID_VERTICAL_LINES = [2, 5, 8, 11, 14];
export const CHORD_GRID_HORIZONTAL_LINES = [2, 6, 10, 14, 18, 22];
export const CHORD_GRID_HORIZONTAL_X1 = 2;
export const CHORD_GRID_HORIZONTAL_X2 = 17;

export const CHORD_GRID_LINE_Y1 = 2;
export const CHORD_GRID_LINE_Y2 = 22;

export const CHORD_GRID_DOT_RADIUS = 0.85;
export const CHORD_GRID_DOT_DISPLAY_RADIUS = CHORD_GRID_DOT_RADIUS * 2;
export const CHORD_GRID_HIT_RADIUS = 1.25;
export const CHORD_GRID_HIT_DISPLAY_RADIUS = CHORD_GRID_HIT_RADIUS * 2;

export const CHORD_GRID_LEFT_COLUMN_X = CHORD_GRID_VERTICAL_LINES[0];

export const CHORD_GRID_MARK_FILLED = 'filled';
export const CHORD_GRID_MARK_OUTLINE = 'outline';

export const CHORD_GLYPH_ID = 'chord';

export const CHORD_DIAGRAM_NUMERAL_BAND_HEIGHT = 4;
export const CHORD_DIAGRAM_VIEW_HEIGHT =
  CHORD_GRID_VIEW_HEIGHT + CHORD_DIAGRAM_NUMERAL_BAND_HEIGHT;

export const CHORD_DIAGRAM_WIDTH_RATIO = CHORD_GRID_VIEW_WIDTH / 5;

export const CHORD_GLYPH_RENDER_SCALE = 0.5;

export function chordDiagramWidthPx(glyphSizePx) {
  return glyphSizePx * CHORD_DIAGRAM_WIDTH_RATIO;
}

export function chordGlyphRenderWidthPx(glyphSizePx) {
  return chordDiagramWidthPx(glyphSizePx) * CHORD_GLYPH_RENDER_SCALE;
}

export function chordDiagramHeightPx(widthPx, options) {
  const layout = chordDiagramLayout(widthPx, options);
  return (widthPx * layout.viewHeight) / CHORD_GRID_VIEW_WIDTH;
}

export function chordGlyphRenderHeightPx(glyphSizePx, showNumeral = true) {
  return chordDiagramHeightPx(chordGlyphRenderWidthPx(glyphSizePx), {
    numeralSizePx: glyphSizePx,
    showNumeral,
  });
}

export function chordDiagramViewBox() {
  return `0 ${-CHORD_DIAGRAM_NUMERAL_BAND_HEIGHT} ${CHORD_GRID_VIEW_WIDTH} ${CHORD_DIAGRAM_VIEW_HEIGHT}`;
}

export function chordDiagramNumeralFontSize(widthPx, targetPx) {
  return (targetPx * CHORD_GRID_VIEW_WIDTH) / widthPx;
}

export function chordDiagramLayout(widthPx, { numeralSizePx, showNumeral = true } = {}) {
  if (numeralSizePx == null) {
    return {
      viewBox: chordDiagramViewBox(),
      numeralFontSize: 2.25,
      numeralY: -CHORD_DIAGRAM_NUMERAL_BAND_HEIGHT / 2,
      numeralBaseline: 'middle',
      viewHeight: CHORD_DIAGRAM_VIEW_HEIGHT,
    };
  }

  const gridBottom = CHORD_GRID_VIEW_HEIGHT;

  if (!showNumeral) {
    return {
      viewBox: `0 0 ${CHORD_GRID_VIEW_WIDTH} ${CHORD_GRID_VIEW_HEIGHT}`,
      numeralFontSize: 0,
      numeralY: 0,
      numeralBaseline: 'middle',
      viewHeight: CHORD_GRID_VIEW_HEIGHT,
    };
  }

  const numeralFontSize = chordDiagramNumeralFontSize(widthPx, numeralSizePx);
  const numeralGap = CHORD_GRID_VIEW_WIDTH / widthPx;
  const numeralY = CHORD_GRID_LINE_Y1 - numeralGap;
  const topPadding = 0.06;
  const viewBoxMinY = numeralY - numeralFontSize * 0.76 - topPadding;
  const viewHeight = gridBottom - viewBoxMinY;

  return {
    viewBox: `0 ${viewBoxMinY} ${CHORD_GRID_VIEW_WIDTH} ${viewHeight}`,
    numeralFontSize,
    numeralY,
    numeralBaseline: 'alphabetic',
    viewHeight,
  };
}

export function chordGridIntersectionKey(x, y) {
  return `${x},${y}`;
}

export function chordGridIntersections() {
  return CHORD_GRID_VERTICAL_LINES.flatMap((x) =>
    CHORD_GRID_HORIZONTAL_LINES.map((y) => ({ x, y })),
  );
}

const ROMAN_NUMERAL_PARTS = [
  [10, 'X'],
  [9, 'IX'],
  [5, 'V'],
  [4, 'IV'],
  [1, 'I'],
];

function toRomanNumeral(value) {
  let remaining = value;
  let result = '';

  for (const [partValue, numeral] of ROMAN_NUMERAL_PARTS) {
    while (remaining >= partValue) {
      result += numeral;
      remaining -= partValue;
    }
  }

  return result;
}

export const CHORD_ROMAN_NUMERAL_OFF = '';

export const CHORD_ROMAN_NUMERAL_OPTIONS = [
  { value: CHORD_ROMAN_NUMERAL_OFF, label: 'off' },
  ...Array.from({ length: 17 }, (_, index) => {
    const value = index + 1;
    return {
      value: String(value),
      label: toRomanNumeral(value),
    };
  }),
];

export function romanNumeralIndexForValue(value) {
  const index = CHORD_ROMAN_NUMERAL_OPTIONS.findIndex((option) => option.value === value);
  return index >= 0 ? index : 0;
}

export function clampRomanNumeralIndex(index) {
  return Math.min(
    Math.max(index, 0),
    CHORD_ROMAN_NUMERAL_OPTIONS.length - 1,
  );
}

export function chordRomanNumeralLabel(value) {
  return (
    CHORD_ROMAN_NUMERAL_OPTIONS.find((option) => option.value === value)?.label ??
    'off'
  );
}

export function serializeChordMarks(marks) {
  if (marks instanceof Map) {
    return [...marks.entries()].map(([key, mark]) => {
      const [x, y] = key.split(',').map(Number);
      return { x, y, mark };
    });
  }

  return marks ?? [];
}

export function chordMarksToMap(marks) {
  if (marks instanceof Map) {
    return marks;
  }

  return new Map(
    (marks ?? []).map(({ x, y, mark }) => [chordGridIntersectionKey(x, y), mark]),
  );
}

export function serializeChordDiagram(marks, romanNumeral) {
  return {
    romanNumeral: romanNumeral ?? CHORD_ROMAN_NUMERAL_OFF,
    marks: serializeChordMarks(marks),
  };
}
