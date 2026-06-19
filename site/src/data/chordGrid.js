export const CHORD_GRID_VIEW_WIDTH = 19;
export const CHORD_GRID_VIEW_HEIGHT = 24;

export const CHORD_GRID_VERTICAL_LINES = [2, 5, 8, 11, 14];
export const CHORD_GRID_HORIZONTAL_LINES = [2, 6, 10, 14, 18, 22];
export const CHORD_GRID_HORIZONTAL_X1 = 2;
export const CHORD_GRID_HORIZONTAL_X2 = 17;

export const CHORD_GRID_COLUMN_SPACING =
  CHORD_GRID_VERTICAL_LINES[1] - CHORD_GRID_VERTICAL_LINES[0];
export const CHORD_GRID_RIGHTMOST_VERTICAL_X =
  CHORD_GRID_VERTICAL_LINES[CHORD_GRID_VERTICAL_LINES.length - 1];
export const CHORD_GRID_VIEW_RIGHT_PADDING =
  CHORD_GRID_VIEW_WIDTH - CHORD_GRID_HORIZONTAL_X2;

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
  return (widthPx * layout.viewHeight) / layout.viewWidth;
}

export function chordGlyphRenderLayoutOptions(glyphSizePx, showNumeral, marks = null) {
  const widthPx = chordGlyphRenderWidthPx(glyphSizePx);
  const lineGeometry = chordGridLineGeometry(marks ?? [], { compact: true });
  let viewWidth = lineGeometry.viewWidth;
  let viewBoxMinX = 0;
  let leftBarX = null;

  if (!showNumeral) {
    const leftBarLayout = chordGridLeftBarLayout(widthPx, viewWidth);
    viewBoxMinX = leftBarLayout.viewBoxMinX;
    viewWidth = leftBarLayout.viewWidth;
    leftBarX = leftBarLayout.leftBarX;
  }

  return {
    widthPx,
    numeralSizePx: glyphSizePx,
    showNumeral,
    viewWidth,
    viewBoxMinX,
    leftBarX,
  };
}

export function chordGlyphRenderHeightPx(glyphSizePx, showNumeral = true, marks = null) {
  const options = chordGlyphRenderLayoutOptions(glyphSizePx, showNumeral, marks);
  return chordDiagramHeightPx(options.widthPx, options);
}

export function chordDiagramViewBox() {
  return `0 ${-CHORD_DIAGRAM_NUMERAL_BAND_HEIGHT} ${CHORD_GRID_VIEW_WIDTH} ${CHORD_DIAGRAM_VIEW_HEIGHT}`;
}

export function chordDiagramNumeralFontSize(widthPx, targetPx) {
  return (targetPx * CHORD_GRID_VIEW_WIDTH) / widthPx;
}

export function chordGridOnePxInViewBox(widthPx, viewWidth) {
  return viewWidth / widthPx;
}

export function chordGridLeftBarLayout(widthPx, viewWidth) {
  const onePx = chordGridOnePxInViewBox(widthPx, viewWidth);
  const leftBarX = CHORD_GRID_HORIZONTAL_X1 - 2 * onePx;
  const barViewBoxMinX = leftBarX - onePx;
  const circleViewBoxMinX =
    CHORD_GRID_LEFT_COLUMN_X - CHORD_GRID_DOT_DISPLAY_RADIUS - onePx;
  const viewBoxMinX = Math.min(barViewBoxMinX, circleViewBoxMinX);

  return {
    leftBarX,
    viewBoxMinX,
    viewWidth: viewWidth - viewBoxMinX,
  };
}

export function chordDiagramLayout(
  widthPx,
  {
    numeralSizePx,
    showNumeral = true,
    viewWidth = CHORD_GRID_VIEW_WIDTH,
    viewBoxMinX = 0,
  } = {},
) {
  if (numeralSizePx == null) {
    return {
      viewBox: chordDiagramViewBox(),
      numeralFontSize: 2.25,
      numeralY: -CHORD_DIAGRAM_NUMERAL_BAND_HEIGHT / 2,
      numeralBaseline: 'middle',
      viewHeight: CHORD_DIAGRAM_VIEW_HEIGHT,
      viewWidth: CHORD_GRID_VIEW_WIDTH,
    };
  }

  const gridBottom = CHORD_GRID_VIEW_HEIGHT;

  if (!showNumeral) {
    const effectiveWidth = viewWidth - viewBoxMinX;
    return {
      viewBox: `${viewBoxMinX} 0 ${effectiveWidth} ${CHORD_GRID_VIEW_HEIGHT}`,
      numeralFontSize: 0,
      numeralY: 0,
      numeralBaseline: 'middle',
      viewHeight: CHORD_GRID_VIEW_HEIGHT,
      viewWidth: effectiveWidth,
      viewBoxMinX,
    };
  }

  const numeralFontSize = chordDiagramNumeralFontSize(widthPx, numeralSizePx);
  const numeralGap = CHORD_GRID_VIEW_WIDTH / widthPx;
  const numeralY = CHORD_GRID_LINE_Y1 - numeralGap;
  const topPadding = 0.06;
  const viewBoxMinY = numeralY - numeralFontSize * 0.76 - topPadding;
  const viewHeight = gridBottom - viewBoxMinY;

  return {
    viewBox: `0 ${viewBoxMinY} ${viewWidth} ${viewHeight}`,
    numeralFontSize,
    numeralY,
    numeralBaseline: 'alphabetic',
    viewHeight,
    viewWidth,
    viewBoxMinY,
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

export const CHORD_ROMAN_NUMERAL_FONT = "'Times New Roman', Times, serif";

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

export function chordGridRightColumnHasMarks(marks) {
  for (const key of chordMarksToMap(marks).keys()) {
    const [x] = key.split(',').map(Number);
    if (x === CHORD_GRID_RIGHTMOST_VERTICAL_X) {
      return true;
    }
  }
  return false;
}

export function chordGridLineGeometry(marks, { compact = false } = {}) {
  if (!compact || chordGridRightColumnHasMarks(marks)) {
    return {
      verticalLines: CHORD_GRID_VERTICAL_LINES,
      horizontalX2: CHORD_GRID_HORIZONTAL_X2,
      viewWidth: CHORD_GRID_VIEW_WIDTH,
    };
  }

  const verticalLines = CHORD_GRID_VERTICAL_LINES.slice(0, -1);
  const rightmostVertical = verticalLines[verticalLines.length - 1];
  const horizontalX2 = rightmostVertical + CHORD_GRID_COLUMN_SPACING;

  return {
    verticalLines,
    horizontalX2,
    viewWidth: horizontalX2 + CHORD_GRID_VIEW_RIGHT_PADDING,
  };
}

export function chordGridOnlyRenderLayout(widthPx, marks, { useLeftBar = false } = {}) {
  const lineGeometry = chordGridLineGeometry(marks, { compact: true });
  let viewWidth = lineGeometry.viewWidth;
  let viewBoxMinX = 0;
  let leftBarX = null;

  if (useLeftBar) {
    const leftBarLayout = chordGridLeftBarLayout(widthPx, viewWidth);
    viewBoxMinX = leftBarLayout.viewBoxMinX;
    viewWidth = leftBarLayout.viewWidth;
    leftBarX = leftBarLayout.leftBarX;
  }

  return {
    viewBox: `${viewBoxMinX} 0 ${viewWidth} ${CHORD_GRID_VIEW_HEIGHT}`,
    viewWidth,
    viewHeight: CHORD_GRID_VIEW_HEIGHT,
    heightPx: (widthPx * CHORD_GRID_VIEW_HEIGHT) / viewWidth,
    widthPx,
    leftBarX,
    viewBoxMinX,
  };
}

export function chordGlyphNumeralLayoutPx(glyphSizePx, marks) {
  const widthPx = chordGlyphRenderWidthPx(glyphSizePx);
  const lineGeometry = chordGridLineGeometry(marks ?? [], { compact: true });
  const layout = chordDiagramLayout(widthPx, {
    numeralSizePx: glyphSizePx,
    showNumeral: true,
    viewWidth: lineGeometry.viewWidth,
  });
  const scale = widthPx / layout.viewWidth;

  return {
    x: 0,
    y: (layout.numeralY - layout.viewBoxMinY) * scale,
    fontSize: glyphSizePx,
    baseline: layout.numeralBaseline,
  };
}

export function chordGlyphNumeralBandHeightPx(glyphSizePx, marks) {
  const widthPx = chordGlyphRenderWidthPx(glyphSizePx);
  const lineGeometry = chordGridLineGeometry(marks ?? [], { compact: true });
  const layout = chordDiagramLayout(widthPx, {
    numeralSizePx: glyphSizePx,
    showNumeral: true,
    viewWidth: lineGeometry.viewWidth,
  });
  const fullHeightPx = (widthPx * layout.viewHeight) / layout.viewWidth;
  const gridLayout = chordGridOnlyRenderLayout(widthPx, marks);
  return fullHeightPx - gridLayout.heightPx;
}

export function serializeChordDiagram(marks, romanNumeral, rotate = false) {
  return {
    romanNumeral: romanNumeral ?? CHORD_ROMAN_NUMERAL_OFF,
    marks: serializeChordMarks(marks),
    rotate: !!rotate,
  };
}

export function chordGlyphBoundsPx(
  glyphSizePx,
  { showNumeral = true, marks = null, rotate = false } = {},
) {
  const diagramWidthPx = chordGlyphRenderWidthPx(glyphSizePx);
  const diagramHeightPx = chordGlyphRenderHeightPx(glyphSizePx, showNumeral, marks);

  if (!rotate) {
    return {
      widthPx: diagramWidthPx,
      heightPx: diagramHeightPx,
      diagramWidthPx,
      diagramHeightPx,
    };
  }

  if (showNumeral) {
    const gridLayout = chordGridOnlyRenderLayout(diagramWidthPx, marks);
    const numeralBandHeightPx = chordGlyphNumeralBandHeightPx(glyphSizePx, marks);
    return {
      widthPx: gridLayout.heightPx,
      heightPx: numeralBandHeightPx + diagramWidthPx,
      diagramWidthPx,
      diagramHeightPx: gridLayout.heightPx,
      numeralBandHeightPx,
      gridLayout,
    };
  }

  const gridLayout = chordGridOnlyRenderLayout(diagramWidthPx, marks, { useLeftBar: true });
  return {
    widthPx: gridLayout.heightPx,
    heightPx: gridLayout.widthPx,
    diagramWidthPx: gridLayout.widthPx,
    diagramHeightPx: gridLayout.heightPx,
    gridLayout,
  };
}
