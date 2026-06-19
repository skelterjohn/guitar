import {
  CHORD_GRID_VIEW_HEIGHT,
  CHORD_GRID_VIEW_WIDTH,
  CHORD_ROMAN_NUMERAL_OFF,
  CHORD_ROMAN_NUMERAL_FONT,
  chordDiagramLayout,
  chordRomanNumeralLabel,
} from '../data/chordGrid.js';
import {
  ChordGridLines,
  ChordGridLinesLayer,
  ChordGridMarkCircles,
} from './chordGridRender.jsx';

export default function ChordDiagram({
  marks,
  romanNumeral,
  widthPx,
  color = '#f8fafc',
  forGlyph = false,
  numeralSizePx,
  className = 'annotation-chord-diagram',
  lineClassName = 'annotation-chord-diagram-lines',
  numeralClassName = 'annotation-chord-diagram-numeral',
}) {
  const numeralLabel = chordRomanNumeralLabel(romanNumeral);
  const showNumeral = !forGlyph || romanNumeral !== CHORD_ROMAN_NUMERAL_OFF;
  const layout = chordDiagramLayout(widthPx, {
    numeralSizePx: forGlyph ? numeralSizePx : undefined,
    showNumeral: forGlyph ? showNumeral : true,
  });
  const heightPx = (widthPx * layout.viewHeight) / CHORD_GRID_VIEW_WIDTH;

  return (
    <svg
      viewBox={layout.viewBox}
      width={widthPx}
      height={heightPx}
      className={className}
      style={{ color }}
      aria-hidden="true"
    >
      {showNumeral && (
        <text
          x={0}
          y={layout.numeralY}
          className={numeralClassName}
          fontSize={layout.numeralFontSize}
          fontFamily={CHORD_ROMAN_NUMERAL_FONT}
          textAnchor="start"
          dominantBaseline={layout.numeralBaseline}
          fill="currentColor"
        >
          {numeralLabel}
        </text>
      )}
      <ChordGridLinesLayer className={lineClassName} marks={marks} />
      <ChordGridMarkCircles marks={marks} forGlyph={forGlyph} />
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
