import ChordDiagram from './ChordDiagram.jsx';
import ChordRomanNumeralWheel from './ChordRomanNumeralWheel.jsx';
import {
  CHORD_GRID_HIT_DISPLAY_RADIUS,
  CHORD_GRID_LEFT_COLUMN_X,
  CHORD_GRID_MARK_FILLED,
  CHORD_GRID_MARK_OUTLINE,
  CHORD_GRID_VIEW_HEIGHT,
  CHORD_GRID_VIEW_WIDTH,
  CHORD_ROMAN_NUMERAL_OFF,
  chordGlyphBoundsPx,
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
  rotate,
  onRotateChange,
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

  const showNumeral = romanNumeral !== CHORD_ROMAN_NUMERAL_OFF;
  const { widthPx: previewWidthPx, heightPx: previewHeightPx, diagramWidthPx, diagramHeightPx } =
    chordGlyphBoundsPx(glyphSizePx, { showNumeral, marks, rotate });

  return (
    <>
      <div className="annotation-menu-chord-editor">
        <button
          type="button"
          className={
            rotate
              ? 'annotation-menu-tool-btn annotation-menu-tool-btn--selected annotation-menu-chord-rotate-btn'
              : 'annotation-menu-tool-btn annotation-menu-chord-rotate-btn'
          }
          onPointerDown={(event) => event.stopPropagation()}
          onPointerUp={(event) => {
            event.stopPropagation();
            onRotateChange(!rotate);
          }}
          aria-label="Rotate"
          aria-pressed={rotate}
        >
          <svg viewBox="0 0 16 16" aria-hidden="true" className="annotation-menu-tool-rotate">
            <path
              d="M11.5 3A5.5 5.5 0 1 0 13 8.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
            />
            <path
              d="M13.5 1.5v3h-3"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
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
          minWidth: `${previewWidthPx + 12}px`,
          minHeight: `${previewHeightPx + 12}px`,
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
          rotate={rotate}
          numeralSizePx={glyphSizePx}
          lineClassName="annotation-menu-chord-grid-lines"
          numeralClassName="annotation-chord-diagram-numeral"
        />
      </button>
    </>
  );
}

export { ChordGridIcon } from './ChordDiagram.jsx';
