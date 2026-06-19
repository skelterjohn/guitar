import ChordDiagram from './ChordDiagram.jsx';
import ChordRomanNumeralWheel from './ChordRomanNumeralWheel.jsx';
import {
  CHORD_GRID_HIT_DISPLAY_RADIUS,
  CHORD_GRID_HORIZONTAL_X1,
  CHORD_GRID_HORIZONTAL_X2,
  CHORD_GRID_LEFT_COLUMN_X,
  CHORD_GRID_MARK_FILLED,
  CHORD_GRID_MARK_OUTLINE,
  CHORD_GRID_VIEW_HEIGHT,
  CHORD_GRID_VIEW_WIDTH,
  chordDiagramWidthPx,
  chordGridIntersectionKey,
  chordGridIntersections,
} from '../data/chordGrid.js';
import {
  ChordGridLinesLayer,
  ChordGridMarkCircles,
} from './chordGridRender.jsx';

function clearRowMarks(markMap, rowY, keepKey = null) {
  for (const existingKey of [...markMap.keys()]) {
    if (existingKey === keepKey) continue;

    const [, existingY] = existingKey.split(',').map(Number);
    if (existingY === rowY) {
      markMap.delete(existingKey);
    }
  }
}

export default function ChordGridEditor({
  marks,
  onMarksChange,
  romanNumeral,
  onRomanNumeralChange,
  glyphSizePx,
  annotationColor,
  onChordGlyphPointerDown,
}) {
  const handleIntersectionClick = (x, y) => {
    const key = chordGridIntersectionKey(x, y);

    if (x === CHORD_GRID_LEFT_COLUMN_X) {
      onMarksChange((current) => {
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

    onMarksChange((current) => {
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

  const diagramWidthPx = chordDiagramWidthPx(glyphSizePx);

  return (
    <>
      <div className="annotation-menu-chord-editor">
        <div className="annotation-menu-chord-editor-column">
          <div className="annotation-menu-chord-numeral-wheel-wrap">
            <ChordRomanNumeralWheel
              value={romanNumeral}
              onChange={onRomanNumeralChange}
            />
          </div>
          <svg
            viewBox={`0 0 ${CHORD_GRID_VIEW_WIDTH} ${CHORD_GRID_VIEW_HEIGHT}`}
            className="annotation-menu-chord-grid"
            preserveAspectRatio="xMinYMin meet"
            aria-label="Chord diagram"
          >
            <ChordGridLinesLayer className="annotation-menu-chord-grid-lines" marks={marks} />
            {chordGridIntersections().map(({ x, y }) => {
              const key = chordGridIntersectionKey(x, y);

              return (
                <circle
                  key={key}
                  cx={x}
                  cy={y}
                  r={CHORD_GRID_HIT_DISPLAY_RADIUS}
                  className="annotation-menu-chord-grid-intersection"
                  onPointerDown={(event) => event.stopPropagation()}
                  onPointerUp={(event) => {
                    event.stopPropagation();
                    handleIntersectionClick(x, y);
                  }}
                />
              );
            })}
            <ChordGridMarkCircles marks={marks} />
          </svg>
        </div>
      </div>
      <button
        type="button"
        className="annotation-menu-glyph annotation-menu-chord-glyph-drag"
        style={{
          minWidth: `${diagramWidthPx + 12}px`,
          minHeight: `${(diagramWidthPx * CHORD_GRID_VIEW_HEIGHT) / CHORD_GRID_VIEW_WIDTH + 12}px`,
        }}
        aria-label="Drag chord onto score"
        onPointerDown={onChordGlyphPointerDown}
      >
        <ChordDiagram
          marks={marks}
          romanNumeral={romanNumeral}
          widthPx={diagramWidthPx}
          color={annotationColor}
          forGlyph
          numeralSizePx={glyphSizePx}
          lineClassName="annotation-menu-chord-grid-lines"
          numeralClassName="annotation-menu-chord-diagram-numeral annotation-menu-chord-diagram-numeral--glyph"
        />
      </button>
    </>
  );
}

export { ChordGridIcon } from './ChordDiagram.jsx';
