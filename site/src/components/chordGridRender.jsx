import { useId } from 'react';
import {
  CHORD_GRID_DOT_DISPLAY_RADIUS,
  CHORD_GRID_HORIZONTAL_LINES,
  CHORD_GRID_HORIZONTAL_X1,
  CHORD_GRID_HORIZONTAL_X2,
  CHORD_GRID_LINE_Y1,
  CHORD_GRID_LINE_Y2,
  CHORD_GRID_MARK_FILLED,
  CHORD_GRID_MARK_OUTLINE,
  CHORD_GRID_VERTICAL_LINES,
  CHORD_GRID_VIEW_HEIGHT,
  CHORD_GRID_VIEW_WIDTH,
  chordGridLineGeometry,
  chordMarksToMap,
} from '../data/chordGrid.js';

export function ChordGridLines({
  className,
  verticalLines = CHORD_GRID_VERTICAL_LINES,
  horizontalX2 = CHORD_GRID_HORIZONTAL_X2,
  leftBarX = null,
}) {
  return (
    <g className={className}>
      {leftBarX != null && (
        <line
          key="v-left-bar"
          x1={leftBarX}
          y1={CHORD_GRID_LINE_Y1}
          x2={leftBarX}
          y2={CHORD_GRID_LINE_Y2}
          stroke="currentColor"
        />
      )}
      {verticalLines.map((x) => (
        <line
          key={`v-${x}`}
          x1={x}
          y1={CHORD_GRID_LINE_Y1}
          x2={x}
          y2={CHORD_GRID_LINE_Y2}
          stroke="currentColor"
        />
      ))}
      {CHORD_GRID_HORIZONTAL_LINES.map((y) => (
        <line
          key={`h-${y}`}
          x1={CHORD_GRID_HORIZONTAL_X1}
          y1={y}
          x2={horizontalX2}
          y2={y}
          stroke="currentColor"
        />
      ))}
    </g>
  );
}

function outlineMarkPositions(marksMap) {
  return [...marksMap.entries()]
    .filter(([, mark]) => mark === CHORD_GRID_MARK_OUTLINE)
    .map(([key]) => {
      const [x, y] = key.split(',').map(Number);
      return { key, x, y };
    });
}

export function ChordGridLinesLayer({
  className,
  marks,
  compact = false,
  leftBarX = null,
}) {
  const maskId = useId();
  const marksMap = chordMarksToMap(marks);
  const outlineMarks = outlineMarkPositions(marksMap);
  const { verticalLines, horizontalX2 } = chordGridLineGeometry(marks, { compact });
  const lines = (
    <ChordGridLines
      className={className}
      verticalLines={verticalLines}
      horizontalX2={horizontalX2}
      leftBarX={leftBarX}
    />
  );

  if (outlineMarks.length === 0) {
    return lines;
  }

  return (
    <>
      <defs>
        <mask id={maskId}>
          <rect
            x={-CHORD_GRID_VIEW_WIDTH}
            y={-CHORD_GRID_VIEW_HEIGHT}
            width={CHORD_GRID_VIEW_WIDTH * 3}
            height={CHORD_GRID_VIEW_HEIGHT * 3}
            fill="white"
          />
          {outlineMarks.map(({ key, x, y }) => (
            <circle
              key={key}
              cx={x}
              cy={y}
              r={CHORD_GRID_DOT_DISPLAY_RADIUS}
              fill="black"
            />
          ))}
        </mask>
      </defs>
      <g mask={`url(#${maskId})`}>{lines}</g>
    </>
  );
}

export function ChordGridMarkCircles({
  marks,
  filledFill = '#fff',
  outlineStroke = '#fff',
  forGlyph = false,
}) {
  const marksMap = chordMarksToMap(marks);
  const filledFillValue = forGlyph ? 'currentColor' : filledFill;
  const outlineStrokeValue = forGlyph ? 'currentColor' : outlineStroke;

  return [...marksMap.entries()].map(([key, mark]) => {
    const [x, y] = key.split(',').map(Number);

    if (mark === CHORD_GRID_MARK_FILLED) {
      return (
        <circle
          key={key}
          cx={x}
          cy={y}
          r={CHORD_GRID_DOT_DISPLAY_RADIUS}
          className="annotation-chord-diagram-dot"
          fill={filledFillValue}
        />
      );
    }

    if (mark === CHORD_GRID_MARK_OUTLINE) {
      return (
        <circle
          key={key}
          cx={x}
          cy={y}
          r={CHORD_GRID_DOT_DISPLAY_RADIUS}
          className="annotation-chord-diagram-dot annotation-chord-diagram-dot--outline"
          stroke={outlineStrokeValue}
        />
      );
    }

    return null;
  });
}
