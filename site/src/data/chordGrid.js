export const CHORD_GRID_VIEW_WIDTH = 19;
export const CHORD_GRID_VIEW_HEIGHT = 24;

export const CHORD_GRID_VERTICAL_LINES = [2, 5, 8, 11, 14];
export const CHORD_GRID_HORIZONTAL_LINES = [2, 6, 10, 14, 18, 22];
export const CHORD_GRID_HORIZONTAL_X1 = 2;
export const CHORD_GRID_HORIZONTAL_X2 = 17;

export const CHORD_GRID_LINE_Y1 = 2;
export const CHORD_GRID_LINE_Y2 = 22;

export const CHORD_GRID_DOT_RADIUS = 0.85;
export const CHORD_GRID_HIT_RADIUS = 1.25;

export const CHORD_GRID_LEFT_COLUMN_X = CHORD_GRID_VERTICAL_LINES[0];

export const CHORD_GRID_MARK_FILLED = 'filled';
export const CHORD_GRID_MARK_OUTLINE = 'outline';

export function chordGridIntersectionKey(x, y) {
  return `${x},${y}`;
}

export function chordGridIntersections() {
  return CHORD_GRID_VERTICAL_LINES.flatMap((x) =>
    CHORD_GRID_HORIZONTAL_LINES.map((y) => ({ x, y })),
  );
}
