import { useState } from 'react';
import {
  CHORD_GRID_DOT_RADIUS,
  CHORD_GRID_HIT_RADIUS,
  CHORD_GRID_HORIZONTAL_LINES,
  CHORD_GRID_HORIZONTAL_X1,
  CHORD_GRID_HORIZONTAL_X2,
  CHORD_GRID_LEFT_COLUMN_X,
  CHORD_GRID_LINE_Y1,
  CHORD_GRID_LINE_Y2,
  CHORD_GRID_MARK_FILLED,
  CHORD_GRID_MARK_OUTLINE,
  CHORD_GRID_VERTICAL_LINES,
  CHORD_GRID_VIEW_HEIGHT,
  CHORD_GRID_VIEW_WIDTH,
  chordGridIntersectionKey,
  chordGridIntersections,
} from '../data/chordGrid.js';

function ChordGridLines({ className }) {
  return (
    <g className={className}>
      {CHORD_GRID_VERTICAL_LINES.map((x) => (
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
          x2={CHORD_GRID_HORIZONTAL_X2}
          y2={y}
          stroke="currentColor"
        />
      ))}
    </g>
  );
}

function clearRowMarks(markMap, rowY, keepKey = null) {
  for (const existingKey of [...markMap.keys()]) {
    if (existingKey === keepKey) continue;

    const [, existingY] = existingKey.split(',').map(Number);
    if (existingY === rowY) {
      markMap.delete(existingKey);
    }
  }
}

export default function ChordGridEditor({ color }) {
  const [marks, setMarks] = useState(() => new Map());

  const handleIntersectionClick = (x, y) => {
    const key = chordGridIntersectionKey(x, y);

    if (x === CHORD_GRID_LEFT_COLUMN_X) {
      setMarks((current) => {
        const next = new Map(current);
        const mark = next.get(key);

        if (mark === CHORD_GRID_MARK_FILLED) {
          next.set(key, CHORD_GRID_MARK_OUTLINE);
        } else if (mark === CHORD_GRID_MARK_OUTLINE) {
          next.delete(key);
        } else {
          clearRowMarks(next, y, key);
          next.set(key, CHORD_GRID_MARK_FILLED);
        }

        return next;
      });
      return;
    }

    setMarks((current) => {
      const next = new Map(current);

      if (current.get(key) === CHORD_GRID_MARK_FILLED) {
        next.delete(key);
      } else {
        clearRowMarks(next, y, key);
        next.set(key, CHORD_GRID_MARK_FILLED);
      }

      return next;
    });
  };

  return (
    <svg
      viewBox={`0 0 ${CHORD_GRID_VIEW_WIDTH} ${CHORD_GRID_VIEW_HEIGHT}`}
      className="annotation-menu-chord-grid"
      aria-label="Chord diagram"
    >
      <ChordGridLines className="annotation-menu-chord-grid-lines" />
      {chordGridIntersections().map(({ x, y }) => {
        const key = chordGridIntersectionKey(x, y);
        const mark = marks.get(key);

        return (
          <g key={key}>
            <circle
              cx={x}
              cy={y}
              r={CHORD_GRID_HIT_RADIUS}
              className="annotation-menu-chord-grid-intersection"
              onPointerDown={(event) => event.stopPropagation()}
              onPointerUp={(event) => {
                event.stopPropagation();
                handleIntersectionClick(x, y);
              }}
            />
            {mark === CHORD_GRID_MARK_FILLED && (
              <circle
                cx={x}
                cy={y}
                r={CHORD_GRID_DOT_RADIUS}
                className="annotation-menu-chord-grid-dot"
                fill={color}
              />
            )}
            {mark === CHORD_GRID_MARK_OUTLINE && (
              <circle
                cx={x}
                cy={y}
                r={CHORD_GRID_DOT_RADIUS}
                className="annotation-menu-chord-grid-dot annotation-menu-chord-grid-dot--outline"
                stroke={color}
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}

export function ChordGridIcon({ sizePx }) {
  return (
    <svg
      viewBox={`0 0 ${CHORD_GRID_VIEW_WIDTH} ${CHORD_GRID_VIEW_HEIGHT}`}
      width={sizePx}
      height={(sizePx * CHORD_GRID_VIEW_HEIGHT) / CHORD_GRID_VIEW_WIDTH}
      className="annotation-menu-chord-grid-icon"
      aria-hidden="true"
    >
      <ChordGridLines className="annotation-menu-chord-grid-icon-lines" />
    </svg>
  );
}
